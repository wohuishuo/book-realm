# Room

> **结论先行**:Room 是 Android 官方 SQLite 封装。书域用它保存本地书架,让用户把书加入书架后,重启 App 仍能看到。

## 一句话

Room = Android 本地数据库的类型安全访问层。

| 项 | 值 |
| --- | --- |
| 定位 | 本地关系型数据库访问 |
| 底层 | SQLite |
| 书域位置 | MVP-2 阅读 App |
| 真实文件 | `ReaderDatabase.kt` |

## 解决什么问题

书架不能只存在内存里。用户点"加入书架"后,退出 App 再回来,这本书仍然应该在。

Room 让我们用 Kotlin 数据类定义表:

```kotlin
@Entity(tableName = "book_cache")
data class BookCacheEntity(
    @PrimaryKey val id: Long,
    val title: String,
    val author: String,
    val coverUrl: String?,
    val intro: String = "",
    val inShelf: Boolean = false,
)
```

再用 DAO 定义查询:

```kotlin
@Dao
interface BookCacheDao {
    @Query("SELECT * FROM book_cache WHERE inShelf = 1")
    fun shelfBooks(): Flow<List<BookCacheEntity>>

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun upsert(books: List<BookCacheEntity>)
}
```

## 依赖关系

```
书库接口返回 BookDto
      │
ReaderRepository 转成 BookCacheEntity
      │
Room / SQLite
      │ Flow
      ▼
ViewModel 合并成 ReaderUiState
```

Room 不直接服务页面,它服务 Repository。

## 在书域里的角色

当前 Room 负责书架缓存。后续可以继续扩展:

- 每本书读到哪个章节;
- 每章读到哪个段落;
- 离线章节缓存。

真实代码:[ReaderDatabase.kt](https://github.com/wohuishuo/br-reader-app/blob/main/app/src/main/java/com/bookrealm/reader/data/local/ReaderDatabase.kt)

## 真实踩坑

Room 表结构变更要处理版本。MVP-2 中 `BookCacheEntity` 增加字段后,数据库版本从 1 到 2,开发期使用 `fallbackToDestructiveMigration()` 避免旧表阻塞调试。正式产品不能随便这样做,要写迁移脚本保护用户数据。

## 对应资源

- 规格:[PRD-005 个人书架](/product/prd/prd-005-bookshelf) · [PRD-009 离线阅读](/product/prd/prd-009-offline-reading)
- 相关卡:[DataStore](/stack/datastore)
