import { db } from './database';

const sampleSweets = [
  { name: 'Chocolate Bar', category: 'Chocolate', price: 2.50, quantity: 50 },
  { name: 'Gummy Bears', category: 'Candy', price: 1.75, quantity: 100 },
  { name: 'Lollipop', category: 'Candy', price: 1.00, quantity: 75 },
  { name: 'Toffee', category: 'Hard Candy', price: 3.00, quantity: 30 },
  { name: 'Jelly Beans', category: 'Candy', price: 2.25, quantity: 80 },
  { name: 'Marshmallows', category: 'Soft Candy', price: 2.00, quantity: 60 },
  { name: 'Caramel Squares', category: 'Caramel', price: 2.75, quantity: 40 },
  { name: 'Licorice', category: 'Candy', price: 1.50, quantity: 55 },
];

export async function seedDatabase() {
  try {
    // Check if sweets already exist
    const existing = await db.all('SELECT COUNT(*) as count FROM sweets');
    const count = (existing && existing[0] && (existing[0] as any).count) || 0;

    if (count > 0) {
      console.log(`Database already has ${count} sweets. Skipping seed.`);
      return;
    }

    console.log('Seeding database with sample sweets...');
    
    let seeded = 0;
    for (const sweet of sampleSweets) {
      try {
        await db.run(
          'INSERT INTO sweets (name, category, price, quantity) VALUES (?, ?, ?, ?)',
          [sweet.name, sweet.category, sweet.price, sweet.quantity]
        );
        seeded++;
      } catch (error: any) {
        // Skip if sweet already exists (unique constraint)
        if (error.message && error.message.includes('UNIQUE constraint')) {
          console.log(`Sweet "${sweet.name}" already exists, skipping...`);
          continue;
        }
        throw error;
      }
    }

    console.log(`Successfully seeded ${seeded} sweets!`);
  } catch (error) {
    console.error('Error seeding database:', error);
    // Don't throw - allow server to start even if seeding fails
  }
}


