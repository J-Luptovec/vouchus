import 'dotenv/config';
import { PrismaClient } from '../generated/prisma/client/client.js';
import { PrismaPg } from '@prisma/adapter-pg';

const adapter = new PrismaPg({ connectionString: process.env['DATABASE_URL']! });
const prisma = new PrismaClient({ adapter });

const products = [
  {
    name: 'Wireless Noise-Cancelling Headphones',
    description:
      'Premium over-ear headphones with active noise cancellation and 30-hour battery life.',
    category: 'Electronics',
    price: 299.99,
    imageUrl: 'https://placehold.co/400x300?text=Headphones',
  },
  {
    name: 'Ergonomic Office Chair',
    description:
      'Adjustable lumbar support, breathable mesh back, and 4D armrests for all-day comfort.',
    category: 'Furniture',
    price: 449.0,
    imageUrl: 'https://placehold.co/400x300?text=Chair',
  },
  {
    name: 'Stainless Steel Water Bottle',
    description: 'Double-wall insulated 32oz bottle keeps drinks cold 24h or hot 12h.',
    category: 'Sports',
    price: 34.95,
    imageUrl: 'https://placehold.co/400x300?text=Bottle',
  },
  {
    name: 'Mechanical Keyboard',
    description: 'Tenkeyless layout with Cherry MX Brown switches, RGB backlighting, and USB-C.',
    category: 'Electronics',
    price: 129.99,
    imageUrl: 'https://placehold.co/400x300?text=Keyboard',
  },
  {
    name: 'Running Shoes',
    description: 'Lightweight responsive foam midsole and breathable knit upper for everyday runs.',
    category: 'Sports',
    price: 119.95,
    imageUrl: 'https://placehold.co/400x300?text=Shoes',
  },
  {
    name: 'Pour-Over Coffee Maker',
    description: 'Borosilicate glass carafe with reusable stainless steel filter for a clean brew.',
    category: 'Kitchen',
    price: 42.0,
    imageUrl: 'https://placehold.co/400x300?text=Coffee+Maker',
  },
  {
    name: 'Smart Watch',
    description: 'Health tracking, GPS, and 7-day battery in a sleek 44mm aluminium case.',
    category: 'Electronics',
    price: 199.99,
    imageUrl: 'https://placehold.co/400x300?text=Watch',
  },
  {
    name: 'Yoga Mat',
    description: 'Non-slip 6mm thick TPE mat with alignment lines, 183×61cm.',
    category: 'Sports',
    price: 29.99,
    imageUrl: 'https://placehold.co/400x300?text=Yoga+Mat',
  },
  {
    name: 'Desk Lamp',
    description: 'LED lamp with 5 colour temperatures, wireless charging base, and USB-A port.',
    category: 'Furniture',
    price: 54.99,
    imageUrl: 'https://placehold.co/400x300?text=Desk+Lamp',
  },
  {
    name: 'Cast Iron Skillet',
    description:
      '10-inch pre-seasoned cast iron skillet, compatible with all cooktops including induction.',
    category: 'Kitchen',
    price: 39.95,
    imageUrl: 'https://placehold.co/400x300?text=Skillet',
  },
  {
    name: 'Portable Bluetooth Speaker',
    description:
      'IPX7 waterproof, 20W stereo sound, and 15-hour playtime in a compact cylindrical form.',
    category: 'Electronics',
    price: 79.99,
    imageUrl: 'https://placehold.co/400x300?text=Speaker',
  },
  {
    name: 'Backpack',
    description:
      '30L travel backpack with laptop sleeve, hidden pockets, and TSA-friendly lay-flat design.',
    category: 'Travel',
    price: 89.0,
    imageUrl: 'https://placehold.co/400x300?text=Backpack',
  },
  {
    name: 'Wireless Noise-Cancelling Headphones',
    description:
      'Premium over-ear headphones with active noise cancellation and 30-hour battery life.',
    category: 'Electronics',
    price: 299.99,
    imageUrl: 'https://placehold.co/400x300?text=Headphones',
  },
  {
    name: 'Ergonomic Office Chair',
    description:
      'Adjustable lumbar support, breathable mesh back, and 4D armrests for all-day comfort.',
    category: 'Furniture',
    price: 449.0,
    imageUrl: 'https://placehold.co/400x300?text=Chair',
  },
  {
    name: 'Stainless Steel Water Bottle',
    description: 'Double-wall insulated 32oz bottle keeps drinks cold 24h or hot 12h.',
    category: 'Sports',
    price: 34.95,
    imageUrl: 'https://placehold.co/400x300?text=Bottle',
  },
  {
    name: 'Mechanical Keyboard',
    description: 'Tenkeyless layout with Cherry MX Brown switches, RGB backlighting, and USB-C.',
    category: 'Electronics',
    price: 129.99,
    imageUrl: 'https://placehold.co/400x300?text=Keyboard',
  },
  {
    name: 'Running Shoes',
    description: 'Lightweight responsive foam midsole and breathable knit upper for everyday runs.',
    category: 'Sports',
    price: 119.95,
    imageUrl: 'https://placehold.co/400x300?text=Shoes',
  },
  {
    name: 'Pour-Over Coffee Maker',
    description: 'Borosilicate glass carafe with reusable stainless steel filter for a clean brew.',
    category: 'Kitchen',
    price: 42.0,
    imageUrl: 'https://placehold.co/400x300?text=Coffee+Maker',
  },
  {
    name: 'Smart Watch',
    description: 'Health tracking, GPS, and 7-day battery in a sleek 44mm aluminium case.',
    category: 'Electronics',
    price: 199.99,
    imageUrl: 'https://placehold.co/400x300?text=Watch',
  },
  {
    name: 'Yoga Mat',
    description: 'Non-slip 6mm thick TPE mat with alignment lines, 183×61cm.',
    category: 'Sports',
    price: 29.99,
    imageUrl: 'https://placehold.co/400x300?text=Yoga+Mat',
  },
  {
    name: 'Desk Lamp',
    description: 'LED lamp with 5 colour temperatures, wireless charging base, and USB-A port.',
    category: 'Furniture',
    price: 54.99,
    imageUrl: 'https://placehold.co/400x300?text=Desk+Lamp',
  },
  {
    name: 'Cast Iron Skillet',
    description:
      '10-inch pre-seasoned cast iron skillet, compatible with all cooktops including induction.',
    category: 'Kitchen',
    price: 39.95,
    imageUrl: 'https://placehold.co/400x300?text=Skillet',
  },
  {
    name: 'Portable Bluetooth Speaker',
    description:
      'IPX7 waterproof, 20W stereo sound, and 15-hour playtime in a compact cylindrical form.',
    category: 'Electronics',
    price: 79.99,
    imageUrl: 'https://placehold.co/400x300?text=Speaker',
  },
  {
    name: 'Backpack',
    description:
      '30L travel backpack with laptop sleeve, hidden pockets, and TSA-friendly lay-flat design.',
    category: 'Travel',
    price: 89.0,
    imageUrl: 'https://placehold.co/400x300?text=Backpack',
  },
];

async function main() {
  const count = await prisma.product.count();
  if (count > 0) {
    console.log('Database already seeded, skipping.');
    return;
  }
  console.log('Seeding database...');
  await prisma.product.createMany({ data: products });
  console.log(`Seeded ${products.length} products.`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
