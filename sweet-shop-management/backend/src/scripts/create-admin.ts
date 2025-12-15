import bcrypt from 'bcryptjs';
import { db } from '../database/database';
import * as readline from 'readline';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function question(query: string): Promise<string> {
  return new Promise((resolve) => {
    rl.question(query, resolve);
  });
}

async function createAdmin() {
  try {
    await db.initialize();
    console.log('Database connected!\n');

    const username = await question('Enter admin username: ');
    const email = await question('Enter admin email: ');
    const password = await question('Enter admin password: ');

    // Check if user already exists
    const existing = await db.get('SELECT * FROM users WHERE email = ? OR username = ?', [email, username]);
    
    if (existing) {
      console.log('\n❌ User already exists with this email or username!');
      console.log('Options:');
      console.log('1. Update existing user to admin');
      console.log('2. Exit and use a different email/username');
      const choice = await question('\nEnter choice (1 or 2): ');
      
      if (choice === '1') {
        const hashedPassword = await bcrypt.hash(password, 10);
        await db.run(
          'UPDATE users SET password = ?, role = ? WHERE email = ? OR username = ?',
          [hashedPassword, 'admin', email, username]
        );
        console.log('\n✅ User updated to admin successfully!');
      } else {
        console.log('\nExiting...');
      }
      rl.close();
      await db.close();
      process.exit(0);
      return;
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert admin user
    await db.run(
      'INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)',
      [username, email, hashedPassword, 'admin']
    );

    console.log('\n✅ Admin user created successfully!');
    console.log(`\nYou can now login with:`);
    console.log(`Email: ${email}`);
    console.log(`Password: ${password}`);
    
  } catch (error) {
    console.error('\n❌ Error creating admin:', error);
  } finally {
    rl.close();
    await db.close();
    process.exit(0);
  }
}

createAdmin();

