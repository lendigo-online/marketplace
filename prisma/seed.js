const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Create users
  const user1 = await prisma.user.upsert({
    where: { email: 'alice@example.com' },
    update: {},
    create: {
      name: 'Alice',
      email: 'alice@example.com',
      hashedPassword: 'hashedpassword123', // dummy password
    },
  });

  const user2 = await prisma.user.upsert({
    where: { email: 'bob@example.com' },
    update: {},
    create: {
      name: 'Bob',
      email: 'bob@example.com',
      hashedPassword: 'hashedpassword123',
    },
  });

  console.log('Users created:', user1.name, user2.name);

  // Create listings
  const listings = [
    {
      title: 'Modern Apartment in City Center',
      description: 'A beautiful, fully furnished apartment in the heart of the city.',
      pricePerDay: 120,
      location: 'Warsaw, Poland',
      imageSrc: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267',
      category: 'Apartments',
      ownerId: user1.id,
    },
    {
      title: 'Cozy Mountain Cabin',
      description: 'Perfect getaway cabin with beautiful mountain views.',
      pricePerDay: 85,
      location: 'Zakopane, Poland',
      imageSrc: 'https://images.unsplash.com/photo-1542718610-a1d656d1884c',
      category: 'Cabins',
      ownerId: user2.id,
    },
    {
      title: 'Professional Camera Kit',
      description: 'Sony A7III with 2 lenses. Great for professional shoots.',
      pricePerDay: 40,
      location: 'Krakow, Poland',
      imageSrc: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32',
      category: 'Electronics',
      ownerId: user1.id,
    },
    {
      title: 'Mountain Bike',
      description: 'High-quality mountain bike for rough trails.',
      pricePerDay: 25,
      location: 'Wroclaw, Poland',
      imageSrc: 'https://images.unsplash.com/photo-1576435728678-f2b1d7d23f37',
      category: 'Vehicles',
      ownerId: user2.id,
    }
  ];

  for (const listing of listings) {
    await prisma.listing.create({
      data: listing
    });
  }

  console.log('Listings created successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
