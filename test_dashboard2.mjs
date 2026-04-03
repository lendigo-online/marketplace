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
await page.waitForTimeout(2000)

// Zamknij cookie banner jeśli jest
try { await page.click('button:has-text("Rozumiem")', { timeout: 2000 }) } catch {}

// Header + stats
await page.screenshot({ path: '/tmp/dash_header.png', clip: { x: 0, y: 0, width: 1400, height: 320 } })

// Przychodzące rezerwacje
await page.screenshot({ path: '/tmp/dash_incoming.png', clip: { x: 0, y: 300, width: 1400, height: 320 } })

// Moje ogłoszenia
await page.screenshot({ path: '/tmp/dash_listings.png', clip: { x: 0, y: 580, width: 1400, height: 500 } })

// Kliknij pierwsze ogłoszenie żeby otworzyć terminarz
await page.click('details:first-of-type summary')
await page.waitForTimeout(500)
await page.screenshot({ path: '/tmp/dash_calendar.png', clip: { x: 0, y: 580, width: 1400, height: 700 } })

await browser.close()
