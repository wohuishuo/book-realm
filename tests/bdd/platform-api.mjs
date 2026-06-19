import { Given, When, Then, setDefaultTimeout } from '@cucumber/cucumber'
import assert from 'node:assert/strict'

setDefaultTimeout(120_000)

const urls = {
  auth: process.env.AUTH_URL ?? 'http://127.0.0.1:8080/api',
  library: process.env.LIBRARY_URL ?? 'http://127.0.0.1:8082/api',
  stats: process.env.STATS_URL ?? 'http://127.0.0.1:8083/api',
  ai: process.env.AI_URL ?? 'http://127.0.0.1:8084/api'
}

async function json(method, url, body) {
  let response, lastError
  for (let attempt = 1; attempt <= 120; attempt += 1) {
    try {
      response = await fetch(url, {
        method,
        headers: body ? { 'content-type': 'application/json' } : undefined,
        body: body ? JSON.stringify(body) : undefined
      })
      break
    } catch (error) {
      lastError = error
      await new Promise((resolve) => setTimeout(resolve, 1_000))
    }
  }
  if (!response) throw new Error(`${method} ${url} could not connect`, { cause: lastError })
  assert.equal(response.ok, true, `${method} ${url} returned ${response.status}`)
  const payload = await response.json()
  assert.equal(payload.code, 0, payload.message ?? `${url} failed`)
  return payload.data
}

Given('平台服务已经启动', async function () {
  this.health = await Promise.all(Object.values(urls).map((base) => json('GET', `${base}/health`)))
})

for (const [step, key] of [['认证服务应健康', 'auth'], ['书库服务应健康', 'library'], ['统计服务应健康', 'stats'], ['AI 服务应健康', 'ai']]) {
  Then(step, async function () {
    await json('GET', `${urls[key]}/health`)
  })
}

When('用户使用测试账号登录', async function () {
  const data = await json('POST', `${urls.auth}/user/login`, {
    userAccount: process.env.BDD_USER ?? 'root',
    userPassword: process.env.BDD_PASSWORD ?? '12345678',
    loginType: 'Cucumber'
  })
  this.userId = data.user.id
  assert.ok(this.userId)
})

When('用户搜索一本书并打开第一章', async function () {
  const books = await json('GET', `${urls.library}/books?q=${encodeURIComponent('西游')}&page=0&size=5`)
  assert.ok(books.items.length, 'No seeded book matched the BDD query')
  this.book = await json('GET', `${urls.library}/books/${books.items[0].id}`)
  assert.ok(this.book.chapters.length, 'The selected book has no chapter')
  this.chapter = await json('GET', `${urls.library}/chapters/${this.book.chapters[0].id}`)
  assert.ok(this.chapter.paragraphs.length, 'The selected chapter has no paragraph')
})

When('用户保存当前阅读位置', async function () {
  assert.ok(this.userId, 'Login must run before saving progress')
  this.position = {
    userId: this.userId,
    bookId: this.book.id,
    chapterId: this.chapter.id,
    paragraphIndex: 0
  }
  await json('POST', `${urls.stats}/stats/progress`, this.position)
})

Then('再次查询时应返回该阅读位置', async function () {
  const rows = await json('GET', `${urls.stats}/stats/reading?userId=${this.userId}`)
  const serialized = JSON.stringify(rows)
  assert.ok(serialized.includes(String(this.position.chapterId)), 'Saved chapter was not returned')
})

When('用户为当前段落保存划线和笔记', async function () {
  const paragraph = this.chapter.paragraphs[0]
  this.note = `Cucumber note ${Date.now()}`
  this.mark = await json('POST', `${urls.library}/marks`, {
    userId: this.userId,
    bookId: this.book.id,
    chapterId: this.chapter.id,
    paragraphId: paragraph.id,
    paragraphSeq: paragraph.seq,
    markType: 'NOTE',
    note: this.note
  })
})

Then('再次查询章节标记时应返回该笔记', async function () {
  const marks = await json(
    'GET',
    `${urls.library}/chapters/${this.chapter.id}/marks?userId=${this.userId}`
  )
  assert.ok(marks.some((mark) => mark.id === this.mark.id && mark.note === this.note))
})

When('用户为当前段落发布段评', async function () {
  const paragraph = this.chapter.paragraphs[0]
  this.comment = await json('POST', `${urls.library}/comments`, {
    userId: this.userId,
    bookId: this.book.id,
    chapterId: this.chapter.id,
    paragraphId: paragraph.id,
    content: `Cucumber comment ${Date.now()}`
  })
})

When('用户连续两次点赞该段评', async function () {
  this.firstLike = await json(
    'POST',
    `${urls.library}/comments/${this.comment.id}/like?userId=${this.userId}`
  )
  this.secondLike = await json(
    'POST',
    `${urls.library}/comments/${this.comment.id}/like?userId=${this.userId}`
  )
})

Then('段评只记录一次点赞', function () {
  assert.equal(this.firstLike.likeCount, 1)
  assert.equal(this.secondLike.likeCount, 1)
  assert.equal(this.secondLike.likedByMe, true)
})

When('用户连续上报两个阅读位置', async function () {
  this.latestParagraphIndex = 2
  for (const paragraphIndex of [1, this.latestParagraphIndex]) {
    await json('POST', `${urls.stats}/stats/progress`, {
      userId: this.userId,
      bookId: this.book.id,
      chapterId: this.chapter.id,
      paragraphIndex
    })
  }
})

Then('阅读统计只保留该书当天的最新位置', async function () {
  const rows = await json('GET', `${urls.stats}/stats/reading`)
  const matches = rows.filter((row) =>
    row.userId === this.userId &&
    row.bookId === this.book.id &&
    row.chapterId === this.chapter.id
  )
  assert.equal(matches.length, 1)
  assert.equal(matches[0].paragraphIndex, this.latestParagraphIndex)
  assert.ok(matches[0].reportCount >= 2)
})

When('用户针对当前章节提问', async function () {
  this.answer = await json('POST', `${urls.ai}/ai/ask`, {
    bookId: this.book.id,
    chapterId: this.chapter.id,
    question: '这一章开头在讲什么？'
  })
})

Then('AI 请求应成功并返回非空答案', function () {
  assert.ok(JSON.stringify(this.answer).length > 2, 'AI returned an empty answer')
})
