import { initDB, run } from './db.js';
import bcrypt from 'bcryptjs';

async function seed() {
  await initDB();

  run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'member',
    phone TEXT DEFAULT '',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);

  run(`CREATE TABLE IF NOT EXISTS books (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    author TEXT NOT NULL,
    isbn TEXT UNIQUE DEFAULT '',
    category TEXT DEFAULT '',
    quantity INTEGER NOT NULL DEFAULT 1,
    available INTEGER NOT NULL DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);

  run(`CREATE TABLE IF NOT EXISTS borrow_records (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    book_id INTEGER NOT NULL,
    borrow_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    due_date DATETIME NOT NULL,
    return_date DATETIME,
    status TEXT NOT NULL DEFAULT 'borrowed',
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (book_id) REFERENCES books(id)
  )`);

  const existingAdmin = run("SELECT id FROM users WHERE email = ?", ["admin@library.com"]);
  if (existingAdmin.length === 0) {
    const hash = await bcrypt.hash("admin123", 10);
    run("INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)", ["Admin", "admin@library.com", hash, "admin"]);
    console.log("Admin created: admin@library.com / admin123");
  }

  const existingUser = run("SELECT id FROM users WHERE email = ?", ["john@test.com"]);
  if (existingUser.length === 0) {
    const hash = await bcrypt.hash("user123", 10);
    run("INSERT INTO users (name, email, password, role, phone) VALUES (?, ?, ?, ?, ?)", ["John Doe", "john@test.com", hash, "member", "1234567890"]);
    console.log("User created: john@test.com / user123");
  }

  const bookCount = run("SELECT COUNT(*) as c FROM books");
  if (bookCount[0].c === 0) {
    const books = [
      ["The Great Gatsby", "F. Scott Fitzgerald", "9780743273565", "Fiction", 5],
      ["To Kill a Mockingbird", "Harper Lee", "9780061120084", "Fiction", 3],
      ["1984", "George Orwell", "9780451524935", "Dystopian", 4],
      ["Pride and Prejudice", "Jane Austen", "9780141439518", "Romance", 2],
      ["The Catcher in the Rye", "J.D. Salinger", "9780316769488", "Fiction", 3],
      ["The Hobbit", "J.R.R. Tolkien", "9780547928227", "Fantasy", 4],
      ["Harry Potter and the Sorcerer's Stone", "J.K. Rowling", "9780590353427", "Fantasy", 6],
      ["The Alchemist", "Paulo Coelho", "9780062315007", "Adventure", 3],
      ["Sapiens", "Yuval Noah Harari", "9780062316097", "Non-Fiction", 2],
      ["Atomic Habits", "James Clear", "9780735211292", "Self-Help", 4],
      ["Clean Code", "Robert C. Martin", "9780132350884", "Technology", 3],
      ["Design Patterns", "Gang of Four", "9780201633610", "Technology", 2],
    ];
    for (const [title, author, isbn, category, qty] of books) {
      run("INSERT INTO books (title, author, isbn, category, quantity, available) VALUES (?, ?, ?, ?, ?, ?)", [title, author, isbn, category, qty, qty]);
    }
    console.log(`Seeded ${books.length} books`);
  }

  console.log("Database seeded successfully!");
  process.exit(0);
}

seed().catch(err => {
  console.error("Seed failed:", err);
  process.exit(1);
});
