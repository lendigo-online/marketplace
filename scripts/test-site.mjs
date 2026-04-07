import { chromium } from "playwright"
import { PrismaClient } from "@prisma/client"

const BASE = "http://localhost:3001"
const LENDIGO = { email: "lendigo00@gmail.com", password: "hyqryv-Bushup-jopby9" }
const TESTOWY = { email: "test@lendigo.pl", password: "Test1234!" }

async function login(page, { email, password }) {
    await page.goto(`${BASE}/login`)
    await page.fill('input[type="email"]', email)
    await page.fill('input[type="password"]', password)
    await page.click('button[type="submit"]')
    await page.waitForURL(BASE + "/", { timeout: 10000 })
    console.log(`  ✓ zalogowano jako ${email}`)
}

async function run() {
    const prisma = new PrismaClient()
    const listing = await prisma.listing.findFirst({ select: { id: true, title: true } })
    await prisma.$disconnect()
    if (!listing) { console.error("Brak ogłoszeń!"); process.exit(1) }
    console.log(`\nTestowe ogłoszenie: "${listing.title}"`)

    const browser = await chromium.launch({ headless: false, slowMo: 600 })

    // ── KARTA 1: konto testowe — rezerwacja ──
    console.log("\n[Karta 1] Konto testowe — rezerwacja")
    const ctx1 = await browser.newContext({ viewport: { width: 1280, height: 900 } })
    const page1 = await ctx1.newPage()
    await login(page1, TESTOWY)

    await page1.goto(`${BASE}/listings/${listing.id}`)
    await page1.waitForSelector("text=Zarezerwuj", { timeout: 8000 })
    console.log("  ✓ strona ogłoszenia załadowana")

    // Otwórz date picker
    await page1.click("#date")
    await page1.waitForTimeout(1000)

    // Znajdź dostępne przyciski dni (nie-disabled)
    const availableDayBtns = page1.locator('button:not([disabled])').filter({ hasText: /^\d+$/ })
    const count = await availableDayBtns.count()
    console.log(`  ℹ dostępnych dni: ${count}`)

    if (count >= 6) {
        await availableDayBtns.nth(2).click()
        await page1.waitForTimeout(400)
        await availableDayBtns.nth(7).click()
        await page1.waitForTimeout(400)
        console.log("  ✓ wybrano daty")
    }

    await page1.keyboard.press("Escape")
    await page1.waitForTimeout(600)

    const reserveBtn = page1.locator("button", { hasText: "Zarezerwuj" })
    const isEnabled = await reserveBtn.isEnabled()

    if (isEnabled) {
        await reserveBtn.click()
        await page1.waitForTimeout(3000)
        console.log("  ✓ rezerwacja wysłana!")
    } else {
        console.log("  ⚠ przycisk nieaktywny")
    }

    // ── KARTA 2: konto Lendigo — dashboard ──
    console.log("\n[Karta 2] Konto Lendigo — dashboard")
    const ctx2 = await browser.newContext({ viewport: { width: 1280, height: 900 } })
    const page2 = await ctx2.newPage()
    await login(page2, LENDIGO)
    await page2.goto(`${BASE}/dashboard`)
    await page2.waitForSelector("h1", { timeout: 8000 })
    console.log("  ✓ dashboard załadowany")
    await page2.waitForTimeout(1500)

    const confirmBtn = page2.locator("button", { hasText: "Potwierdź" }).first()
    if (await confirmBtn.isVisible()) {
        await confirmBtn.click()
        await page2.waitForTimeout(2500)
        console.log("  ✓ rezerwacja potwierdzona!")
    } else {
        console.log("  ⚠ brak oczekujących rezerwacji")
    }

    console.log("\n✅ Test zakończony — przeglądarki otwarte\n")
}

run().catch(e => { console.error(e); process.exit(1) })
