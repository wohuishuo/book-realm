import DefaultTheme from 'vitepress/theme'
import type { Theme } from 'vitepress'
import './custom.css'

// 在默认主题上叠加自定义配色(深色科技风)
const theme: Theme = {
  extends: DefaultTheme
}

export default theme
