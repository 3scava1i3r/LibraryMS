import { Router } from 'express';
import { get, all, run } from '../db.js';
import { authenticate, adminOnly } from '../middleware/auth.js';

const router = Router();

router.get('/', authenticate, (req, res) => {
  const { search, category } = req.query;
  let sql = "SELECT * FROM books WHERE 1=1";
  const params = [];
  if (search) { sql += " AND (title LIKE ? OR author LIKE ?)"; params.push(`%${search}%`, `%${search}%`); }
  if (category) { sql += " AND category = ?"; params.push(category); }
  sql += " ORDER BY created_at DESC";
  res.json(all(sql, params));
});

router.get('/categories', authenticate, (req, res) => {
  const rows = all("SELECT DISTINCT category FROM books WHERE category != '' ORDER BY category");
  res.json(rows.map(r => r.category));
});

router.get('/:id', authenticate, (req, res) => {
  const book = get("SELECT * FROM books WHERE id = ?", [req.params.id]);
  if (!book) return res.status(404).json({ error: 'Book not found' });
  res.json(book);
});

router.post('/', authenticate, adminOnly, (req, res) => {
  const { title, author, isbn, category, quantity } = req.body;
  if (!title || !author) return res.status(400).json({ error: 'Title and author required' });
  const qty = Math.max(1, parseInt(quantity) || 1);
  if (isbn) {
    const existing = get("SELECT id FROM books WHERE isbn = ?", [isbn]);
    if (existing) return res.status(409).json({ error: 'ISBN already exists' });
  }
  run("INSERT INTO books (title, author, isbn, category, quantity, available) VALUES (?, ?, ?, ?, ?, ?)", [title, author, isbn || '', category || '', qty, qty]);
  const book = get("SELECT * FROM books ORDER BY id DESC LIMIT 1");
  res.status(201).json(book);
});

router.put('/:id', authenticate, adminOnly, (req, res) => {
  const { title, author, isbn, category, quantity } = req.body;
  const book = get("SELECT * FROM books WHERE id = ?", [req.params.id]);
  if (!book) return res.status(404).json({ error: 'Book not found' });
  const qty = quantity !== undefined ? Math.max(1, parseInt(quantity) || book.quantity) : book.quantity;
  const diff = qty - book.quantity;
  const newAvailable = book.available + diff;
  if (newAvailable < 0) return res.status(400).json({ error: 'Quantity cannot be less than currently borrowed copies' });
  run("UPDATE books SET title=?, author=?, isbn=?, category=?, quantity=?, available=? WHERE id=?",
    [title || book.title, author || book.author, isbn ?? book.isbn, category ?? book.category, qty, newAvailable, req.params.id]);
  res.json(get("SELECT * FROM books WHERE id = ?", [req.params.id]));
});

router.delete('/:id', authenticate, adminOnly, (req, res) => {
  const borrowed = get("SELECT id FROM borrow_records WHERE book_id = ? AND status = 'borrowed'", [req.params.id]);
  if (borrowed) return res.status(400).json({ error: 'Cannot delete book with active borrows' });
  run("DELETE FROM books WHERE id = ?", [req.params.id]);
  res.json({ message: 'Book deleted' });
});

export default router;
