import { chromium } from 'playwright'
const browser = await chromium.launch({ headless: true })
const page = await browser.newPage()
await page.setViewportSize({ width: 1400, height: 900 })
await page.goto('http://localhost:3000/login')
await page.waitForLoadState('networkidle')
await page.fill('input[type="email"]', 'test@example.com')
await page.fill('input[type="password"]', 'password123')
await page.click('button[type="submit"]')
await page.waitForTimeout(3000)
await page.goto('http://localhost:3000/dashboard')
await page.waitForLoadState('networkidle')
await page.waitForTimeout(1500)
try { await page.click('button:has-text("Rozumiem")', { timeout: 1500 }) } catch {}
await page.waitForTimeout(300)

// sekcja ogłoszeń
await page.evaluate(() => window.scrollTo(0, 550))
await page.waitForTimeout(300)
await page.screenshot({ path: '/tmp/dash_grid.png', clip: { x: 0, y: 500, width: 1400, height: 800 } })

// otwórz terminarz pierwszej karty
const btn = page.locator('button:has-text("Terminarz")').first()
await btn.click()
await page.waitForTimeout(600)
await page.screenshot({ path: '/tmp/dash_grid_open.png', clip: { x: 0, y: 480, width: 1400, height: 900 } })

await browser.close()
