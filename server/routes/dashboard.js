import { Router } from 'express';
import { get, all } from '../db.js';
import { authenticate, adminOnly } from '../middleware/auth.js';

const router = Router();

router.get('/', authenticate, adminOnly, (req, res) => {
  const totalBooks = get("SELECT COUNT(*) as c FROM books").c;
  const totalMembers = get("SELECT COUNT(*) as c FROM users WHERE role = 'member'").c;
  const borrowedBooks = get("SELECT COUNT(*) as c FROM borrow_records WHERE status = 'borrowed'").c;
  const overdueBooks = get("SELECT COUNT(*) as c FROM borrow_records WHERE status = 'borrowed' AND due_date < datetime('now')").c;
  const returnedToday = get("SELECT COUNT(*) as c FROM borrow_records WHERE status = 'returned' AND date(return_date) = date('now')").c;
  const totalTransactions = get("SELECT COUNT(*) as c FROM borrow_records").c;

  const recentBorrows = all(`SELECT br.*, b.title, u.name AS user_name
    FROM borrow_records br JOIN books b ON br.book_id = b.id JOIN users u ON br.user_id = u.id
    ORDER BY br.borrow_date DESC LIMIT 5`);

  const popularBooks = all(`SELECT b.id, b.title, b.author, COUNT(br.id) as borrow_count
    FROM books b JOIN borrow_records br ON b.id = br.book_id
    GROUP BY b.id ORDER BY borrow_count DESC LIMIT 5`);

  res.json({ totalBooks, totalMembers, borrowedBooks, overdueBooks, returnedToday, totalTransactions, recentBorrows, popularBooks });
});

export default router;
