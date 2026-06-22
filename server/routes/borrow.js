import { Router } from 'express';
import { get, all, run } from '../db.js';
import { authenticate, adminOnly } from '../middleware/auth.js';

const router = Router();

router.post('/', authenticate, (req, res) => {
  const { book_id } = req.body;
  if (!book_id) return res.status(400).json({ error: 'Book ID required' });

  const book = get("SELECT * FROM books WHERE id = ?", [book_id]);
  if (!book) return res.status(404).json({ error: 'Book not found' });
  if (book.available < 1) return res.status(400).json({ error: 'No copies available' });

  const activeBorrow = get("SELECT id FROM borrow_records WHERE user_id = ? AND book_id = ? AND status = 'borrowed'", [req.user.id, book_id]);
  if (activeBorrow) return res.status(400).json({ error: 'You already have this book borrowed' });

  const dueDate = new Date();
  dueDate.setDate(dueDate.getDate() + 14);

  run("INSERT INTO borrow_records (user_id, book_id, due_date, status) VALUES (?, ?, ?, 'borrowed')", [req.user.id, book_id, dueDate.toISOString()]);
  run("UPDATE books SET available = available - 1 WHERE id = ?", [book_id]);
  const record = get("SELECT * FROM borrow_records ORDER BY id DESC LIMIT 1");
  res.status(201).json(record);
});

router.put('/return/:id', authenticate, adminOnly, (req, res) => {
  const record = get("SELECT * FROM borrow_records WHERE id = ?", [req.params.id]);
  if (!record) return res.status(404).json({ error: 'Record not found' });
  if (record.status === 'returned') return res.status(400).json({ error: 'Already returned' });

  run("UPDATE borrow_records SET return_date = datetime('now'), status = 'returned' WHERE id = ?", [req.params.id]);
  run("UPDATE books SET available = available + 1 WHERE id = ?", [record.book_id]);
  res.json(get("SELECT * FROM borrow_records WHERE id = ?", [req.params.id]));
});

router.get('/my', authenticate, (req, res) => {
  const records = all(`SELECT br.*, b.title, b.author, b.isbn, b.category
    FROM borrow_records br JOIN books b ON br.book_id = b.id
    WHERE br.user_id = ? ORDER BY br.borrow_date DESC`, [req.user.id]);
  res.json(records);
});

router.get('/all', authenticate, adminOnly, (req, res) => {
  const { search, status } = req.query;
  let sql = `SELECT br.*, b.title, b.author, u.name AS user_name, u.email AS user_email
    FROM borrow_records br JOIN books b ON br.book_id = b.id JOIN users u ON br.user_id = u.id WHERE 1=1`;
  const params = [];
  if (status) { sql += " AND br.status = ?"; params.push(status); }
  if (search) { sql += " AND (u.name LIKE ? OR b.title LIKE ?)"; params.push(`%${search}%`, `%${search}%`); }
  sql += " ORDER BY br.borrow_date DESC";
  res.json(all(sql, params));
});

router.get('/overdue', authenticate, adminOnly, (req, res) => {
  const records = all(`SELECT br.*, b.title, b.author, u.name AS user_name, u.email AS user_email
    FROM borrow_records br JOIN books b ON br.book_id = b.id JOIN users u ON br.user_id = u.id
    WHERE br.status = 'borrowed' AND br.due_date < datetime('now') ORDER BY br.due_date`);
  res.json(records);
});

export default router;
