import { Router } from 'express';
import bcrypt from 'bcryptjs';
import { get, all, run } from '../db.js';
import { authenticate, adminOnly } from '../middleware/auth.js';

const router = Router();

router.get('/', authenticate, adminOnly, (req, res) => {
  const { search } = req.query;
  let sql = "SELECT id, name, email, role, phone, created_at FROM users WHERE role = 'member'";
  const params = [];
  if (search) { sql += " AND (name LIKE ? OR email LIKE ?)"; params.push(`%${search}%`, `%${search}%`); }
  sql += " ORDER BY created_at DESC";
  res.json(all(sql, params));
});

router.get('/:id', authenticate, (req, res) => {
  const user = get("SELECT id, name, email, role, phone, created_at FROM users WHERE id = ?", [req.params.id]);
  if (!user) return res.status(404).json({ error: 'User not found' });
  if (req.user.role !== 'admin' && req.user.id !== user.id) return res.status(403).json({ error: 'Access denied' });
  res.json(user);
});

router.post('/', authenticate, adminOnly, async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;
    if (!name || !email || !password) return res.status(400).json({ error: 'Name, email and password required' });

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return res.status(400).json({ error: 'Invalid email format' });

    if (password.length < 8) return res.status(400).json({ error: 'Password must be at least 8 characters' });

    const existing = get("SELECT id FROM users WHERE email = ?", [email]);
    if (existing) return res.status(409).json({ error: 'Email already registered' });

    const hash = await bcrypt.hash(password, 10);
    run("INSERT INTO users (name, email, password, role, phone) VALUES (?, ?, ?, 'member', ?)", [name, email, hash, phone || '']);
    const user = get("SELECT id, name, email, role, phone, created_at FROM users WHERE email = ?", [email]);
    if (!user) return res.status(500).json({ error: 'Failed to create user' });
    res.status(201).json(user);
  } catch (err) {
    console.error('Create user error:', err);
    res.status(500).json({ error: 'Failed to create user' });
  }
});

router.put('/:id', authenticate, adminOnly, (req, res) => {
  const { name, phone } = req.body;
  const user = get("SELECT id FROM users WHERE id = ?", [req.params.id]);
  if (!user) return res.status(404).json({ error: 'User not found' });
  run("UPDATE users SET name=COALESCE(?, name), phone=COALESCE(?, phone) WHERE id=?", [name, phone, req.params.id]);
  res.json(get("SELECT id, name, email, role, phone, created_at FROM users WHERE id = ?", [req.params.id]));
});

router.delete('/:id', authenticate, adminOnly, (req, res) => {
  const borrowed = get("SELECT id FROM borrow_records WHERE user_id = ? AND status = 'borrowed'", [req.params.id]);
  if (borrowed) return res.status(400).json({ error: 'Cannot delete member with active borrows' });
  run("DELETE FROM users WHERE id = ? AND role = 'member'", [req.params.id]);
  res.json({ message: 'Member deleted' });
});

export default router;
