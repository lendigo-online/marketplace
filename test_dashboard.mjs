import { chromium } from 'playwright'

const browser = await chromium.launch({ headless: true })
const page = await browser.newPage()
await page.setViewportSize({ width: 1400, height: 900 })

await page.goto('http://localhost:3000/login')
await page.waitForLoadState('networkidle')
await page.screenshot({ path: '/tmp/screen_login.png' })

await page.fill('input[type="email"]', 'test@example.com')
await page.fill('input[type="password"]', 'password123')
await page.click('button[type="submit"]')
await page.waitForTimeout(3000)
await page.screenshot({ path: '/tmp/screen_after_login.png' })
console.log('After login URL:', page.url())

await page.goto('http://localhost:3000/dashboard')
await page.waitForLoadState('networkidle')
await page.waitForTimeout(2000)
await page.screenshot({ path: '/tmp/screen_dashboard.png', fullPage: true })
console.log('Dashboard URL:', page.url())

await browser.close()
