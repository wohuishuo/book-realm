# 05 Android 阅读器

阅读器的第一目标是让正文稳定、清晰、不中断。工具栏和功能入口都必须服从阅读，而不是把页面做成操作面板。

## 状态模型

Reader UI 只消费明确状态：Loading、Content、Empty、Error、Offline。ViewModel 负责加载章节和用户设置，Composable 不直接发网络请求。

## 交互

正文全屏且不使用卡片。点击中央显示固定高度的顶部栏与底部工具栏；滚动或再次点击隐藏。目录、设置、听书进入设计系统定义的 BottomSheet。

## 相关规格

[PRD-006](/product/prd/prd-006-reader)、[Android UI Rules](/ui/android-rules)、[Pattern Library](/ui/patterns)。

## 完成证据

长标题、大字体、横竖屏和工具栏切换不造成布局跳动；Android `lintDebug testDebugUnitTest assembleDebug` 通过。
