import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'

const prisma = new PrismaClient()

async function main() {
    const hashedPassword = await bcrypt.hash('password123', 10)

    // Create demo users
    const user = await prisma.user.upsert({
        where: { email: 'test@example.com' },
        update: {},
        create: {
            email: 'test@example.com',
            name: 'Marek Kowalski',
            hashedPassword,
            image: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80'
        },
    })

    const user2 = await prisma.user.upsert({
        where: { email: 'anna@example.com' },
        update: {},
        create: {
            email: 'anna@example.com',
            name: 'Anna Nowak',
            hashedPassword,
        },
    })

    // Delete existing listings to avoid duplicates on re-seed
    await prisma.listing.deleteMany({ where: { ownerId: { in: [user.id, user2.id] } } })

    const listings = [
        // Elektronika
        {
            title: 'Aparat Sony A7 III + obiektywy',
            description: 'Profesjonalny bezlusterkowiec Sony A7 III w zestawie z obiektywami 24-70mm f/2.8 i 85mm f/1.8. Idealny do sesji portretowych i fotografii ślubnej. Bateria na cały dzień pracy.',
            pricePerDay: 149,
            location: 'Warszawa, Śródmieście',
            category: 'Foto/Video',
            imageSrc: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&q=80',
            ownerId: user.id
        },
        {
            title: 'DJI Mini 3 Pro — dron z kamerą 4K',
            description: 'Lekki dron DJI Mini 3 Pro z kamerą 4K HDR i funkcją unikania przeszkód. Zestaw zawiera 3 baterie (łącznie ok. 90 minut lotu) oraz torbę transportową. Wymaga posiadania uprawnień UAVO.',
            pricePerDay: 199,
            location: 'Kraków, Kazimierz',
            category: 'Foto/Video',
            imageSrc: 'https://images.unsplash.com/photo-1473968512647-3e447244af8f?auto=format&fit=crop&q=80',
            ownerId: user.id
        },
        {
            title: 'MacBook Pro 16" M2 Pro',
            description: 'Najnowszy MacBook Pro z chipem M2 Pro, 32 GB RAM i 1 TB SSD. Świetny do montażu wideo, programowania i pracy kreatywnej. Ładowarka i torba w zestawie.',
            pricePerDay: 120,
            location: 'Wrocław, Stare Miasto',
            category: 'Elektronika',
            imageSrc: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&q=80',
            ownerId: user2.id
        },
        {
            title: 'iPad Pro 12.9" + Apple Pencil',
            description: 'iPad Pro 12.9" z ekranem Liquid Retina XDR i Apple Pencil 2. generacji. Doskonały do rysowania, projektowania i prezentacji.',
            pricePerDay: 80,
            location: 'Poznań, Centrum',
            category: 'Elektronika',
            imageSrc: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&q=80',
            ownerId: user.id
        },
        {
            title: 'Gimbal stabilizator DJI RS 3',
            description: 'Stabilizator gimbala DJI RS 3 do aparatów lustrzanek i bezlusterkowców. Do 4.5 kg ładowności. Wbudowany Bluetooth i ekran dotykowy. Ideale na wesela i eventy.',
            pricePerDay: 60,
            location: 'Gdańsk, Wrzeszcz',
            category: 'Foto/Video',
            imageSrc: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&q=80',
            ownerId: user2.id
        },
        // Rowery
        {
            title: 'Rower górski Trek Marlin 7 — MTB 29"',
            description: 'Solidny rower górski Trek Marlin 7 na kołach 29". Rama aluminiowa, amortyzator RockShox 100mm, 21 biegów Shimano. Idealny na szlaki rowerowe i leśne ścieżki.',
            pricePerDay: 55,
            location: 'Zakopane, Centrum',
            category: 'Rowery',
            imageSrc: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&q=80',
            ownerId: user.id
        },
        {
            title: 'Rower elektryczny Cube Reaction Hybrid',
            description: 'E-bike z silnikiem Bosch Performance 500 Wh. Zasięg do 120 km na jednm ładowaniu. Świetny na dojazdy do pracy i wycieczki.",',
            pricePerDay: 90,
            location: 'Wrocław, Krzyki',
            category: 'Rowery',
            imageSrc: 'https://images.unsplash.com/photo-1571068316344-75bc76f77890?auto=format&fit=crop&q=80',
            ownerId: user2.id
        },
        {
            title: 'Hulajnoga elektryczna Segway Ninebot Max',
            description: 'Składana hulajnoga elektryczna z zasięgiem 65 km, ładownością 100 kg i oponami pneumatycznymi 10". Hamulce bębnowe + regeneracyjne. Kabel do ładowania w zestawie.',
            pricePerDay: 45,
            location: 'Warszawa, Mokotów',
            category: 'Rowery',
            imageSrc: 'https://images.unsplash.com/photo-1544191696-102dbdaeeaa0?auto=format&fit=crop&q=80',
            ownerId: user.id
        },
        // Narzędzia
        {
            title: 'Wiertarka udarowa Bosch GSB 21-2 RCT',
            description: 'Profesjonalna wiertarka udarowa Bosch 1100W z regulacją prędkości i trybem kucia. Walizka z zestawem wierteł do betonu, drewna i metalu.',
            pricePerDay: 35,
            location: 'Łódź, Bałuty',
            category: 'Narzędzia',
            imageSrc: 'https://images.unsplash.com/photo-1504148455328-c376907d081c?auto=format&fit=crop&q=80',
            ownerId: user2.id
        },
        {
            title: 'Szlifierka kątowa Makita 230mm',
            description: 'Szlifierka kątowa Makita GA9020 2200W z tarczą 230mm. Idealna do cięcia i szlifowania metalu, kamienia i betonu. W zestawie 5 tarcz.',
            pricePerDay: 30,
            location: 'Katowice, Ligota',
            category: 'Narzędzia',
            imageSrc: 'https://images.unsplash.com/photo-1572981779307-38b8cabb2407?auto=format&fit=crop&q=80',
            ownerId: user.id
        },
        {
            title: 'Myjka ciśnieniowa Kärcher K7',
            description: 'Myjka ciśnieniowa Kärcher K7 z ciśnieniem 160 bar i wydajnością 600 l/h. Idealna do mycia samochodów, tarasów, chodników i elewacji.',
            pricePerDay: 50,
            location: 'Kraków, Prokocim',
            category: 'Narzędzia',
            imageSrc: 'https://images.unsplash.com/photo-1558317374-067fb5f30001?auto=format&fit=crop&q=80',
            ownerId: user2.id
        },
        // Camping
        {
            title: 'Namiot 4-osobowy MSR Hubba Tour',
            description: 'Lekki namiot turystyczny MSR Hubba Tour na 4 osoby. Wodoodporny (HH 3000mm), szybki montaż. Śledzie i słupki aluminiowe w zestawie. Świetny na festiwale i trekking.',
            pricePerDay: 40,
            location: 'Białystok, Centrum',
            category: 'Camping',
            imageSrc: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?auto=format&fit=crop&q=80',
            ownerId: user.id
        },
        {
            title: 'Plecaki trekkingowe 65L (para)',
            description: 'Dwa plecaki trekkingowe Gregory Baltoro 65L z systemem wentylacji pleców i biodrówki. Idealne na długie wyprawy górskie. System regulacji długości pleców.',
            pricePerDay: 35,
            location: 'Nowy Sącz, Centrum',
            category: 'Camping',
            imageSrc: 'https://images.unsplash.com/photo-1553361371-9b22f78e8b1d?auto=format&fit=crop&q=80',
            ownerId: user2.id
        },
        // Samochody
        {
            title: 'Tesla Model 3 Long Range',
            description: 'Tesla Model 3 Long Range w kolorze Pearl White. Zasięg 560 km, autopilot, podgrzewane fotele. Ładowanie przez Supercharger (koszty ładowania po stronie najemcy).',
            pricePerDay: 280,
            location: 'Warszawa, Wilanów',
            category: 'Samochody',
            imageSrc: 'https://images.unsplash.com/photo-1560958089-b8a1929cea89?auto=format&fit=crop&q=80',
            ownerId: user.id
        },
        {
            title: 'BMW 3 seria — elegancja na każdą okazję',
            description: 'BMW 330d xDrive 2022, kolor szary, skórzana tapicerka, panoramiczny dach. Idealny na ważne spotkania, wesela i dłuższe trasy.',
            pricePerDay: 220,
            location: 'Poznań, Jeżyce',
            category: 'Samochody',
            imageSrc: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&q=80',
            ownerId: user2.id
        },
        // Muzyka
        {
            title: 'Gitara elektryczna Fender Stratocaster',
            description: 'Fender American Professional II Stratocaster w kolorze Olympic White z wzmacniaczem Fender Blues Junior. Kabel, kapo i kostki w zestawie.',
            pricePerDay: 65,
            location: 'Gdańsk, Śródmieście',
            category: 'Muzyka',
            imageSrc: 'https://images.unsplash.com/photo-1510915361894-db8b60106cb1?auto=format&fit=crop&q=80',
            ownerId: user.id
        },
        {
            title: 'Zestaw perkusyjny Roland TD-17KVX',
            description: 'Elektroniczna perkusja Roland TD-17KVX z modułem TD-17 i 5 tomami. Cicha gra z słuchawkami. Stołek i słuchawki w zestawie.',
            pricePerDay: 80,
            location: 'Lublin, Centrum',
            category: 'Muzyka',
            imageSrc: 'https://images.unsplash.com/photo-1519892300165-cb5542fb47c7?auto=format&fit=crop&q=80',
            ownerId: user2.id
        },
        // Fitness
        {
            title: 'Rower stacjonarny Wahoo KICKR',
            description: 'Trenażer interaktywny Wahoo KICKR z symulacją wzniesień do 20%. Kompatybilny z Zwift, TrainerRoad i Stravą. Łączność Bluetooth i ANT+.',
            pricePerDay: 55,
            location: 'Warszawa, Żoliborz',
            category: 'Fitness',
            imageSrc: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80',
            ownerId: user.id
        },
        {
            title: 'Komplet hantli 2–20 kg z stojakiem',
            description: 'Komplet hantli gumowanych od 2 do 20 kg ze stojakiem. Idealne do treningu siłowego w domu. Można wypożyczyć na tydzień lub miesiąc.',
            pricePerDay: 25,
            location: 'Kraków, Nowa Huta',
            category: 'Fitness',
            imageSrc: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&q=80',
            ownerId: user2.id
        },
        // Sporty wodne
        {
            title: 'Kajak dwuosobowy Perception Conduit 13.7',
            description: 'Plastikowy kajak dwuosobowy Perception Conduit 13.7 z wygodnymi siedzeniami i regulowanymi oparciami. Wiosła i kamizelki ratunkowe w zestawie.',
            pricePerDay: 70,
            location: 'Augustów, Centrum',
            category: 'Sporty wodne',
            imageSrc: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&q=80',
            ownerId: user.id
        },
        {
            title: 'Deska SUP Fanatic Ray 10.6"',
            description: 'Nadmuchiwana deska Stand-Up Paddle Fanatic Ray 10.6" z wiosłem aluminiowym, pompą i plecakiem. Nośność do 130 kg. Idealna dla początkujących i średniozaawansowanych.',
            pricePerDay: 60,
            location: 'Mikołajki, Marina',
            category: 'Sporty wodne',
            imageSrc: 'https://images.unsplash.com/photo-1551524559-8af4e6624178?auto=format&fit=crop&q=80',
            ownerId: user2.id
        },
    ]

    for (const listing of listings) {
        await prisma.listing.create({ data: listing })
    }

    console.log(`✅ Seed zakończony. Dodano ${listings.length} ogłoszeń.`)
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
