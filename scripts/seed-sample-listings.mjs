import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

const SAMPLE_EMAIL = "lendigo00@gmail.com"
const SAMPLE_NOTE = "\n\n---\n⚠️ Ogłoszenie przykładowe — nie stanowi żadnej oferty handlowej. Służy wyłącznie jako prezentacja działania platformy Lendigo."

async function main() {
    const user = await prisma.user.findUnique({ where: { email: SAMPLE_EMAIL } })
    if (!user) {
        console.error(`Nie znaleziono użytkownika: ${SAMPLE_EMAIL}`)
        process.exit(1)
    }
    console.log(`Znaleziono użytkownika: ${user.name} (${user.id})`)

    const listings = await prisma.listing.findMany({ select: { id: true, description: true } })
    console.log(`Znaleziono ${listings.length} ogłoszeń`)

    for (const listing of listings) {
        const alreadyTagged = listing.description.includes("Ogłoszenie przykładowe")
        await prisma.listing.update({
            where: { id: listing.id },
            data: {
                ownerId: user.id,
                description: alreadyTagged ? listing.description : listing.description + SAMPLE_NOTE,
            },
        })
    }

    console.log("✓ Gotowe — zaktualizowano wszystkie ogłoszenia")
}

main()
    .catch(e => { console.error(e); process.exit(1) })
    .finally(() => prisma.$disconnect())
