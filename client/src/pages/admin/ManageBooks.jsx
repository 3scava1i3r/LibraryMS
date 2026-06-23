import { useState, useEffect } from 'react';
import api from '../../api';

export default function ManageBooks() {
  const [books, setBooks] = useState([]);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editBook, setEditBook] = useState(null);
  const [form, setForm] = useState({ title: '', author: '', isbn: '', category: '', quantity: 1 });

  useEffect(() => {
    const params = {};
    if (search) params.search = search;
    api.get('/books', { params }).then(r => setBooks(r.data));
  }, [search]);

  const openCreate = () => {
    setEditBook(null);
    setForm({ title: '', author: '', isbn: '', category: '', quantity: 1 });
    setShowModal(true);
  };

  const openEdit = (book) => {
    setEditBook(book);
    setForm({ title: book.title, author: book.author, isbn: book.isbn, category: book.category, quantity: book.quantity });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editBook) {
        await api.put(`/books/${editBook.id}`, form);
      } else {
        await api.post('/books', form);
      }
      setShowModal(false);
      api.get('/books').then(r => setBooks(r.data));
    } catch (err) {
      alert(err.response?.data?.error || 'Operation failed');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this book?')) return;
    try {
      await api.delete(`/books/${id}`);
      api.get('/books').then(r => setBooks(r.data));
    } catch (err) {
      alert(err.response?.data?.error || 'Delete failed');
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Manage Books</h1>
        <button onClick={openCreate} className="bg-[#0000FF] text-white px-4 py-2 rounded-lg text-sm hover:bg-[#0000DD]">
          + Add Book
        </button>
      </div>
      <input type="text" placeholder="Search books..." value={search} onChange={e => setSearch(e.target.value)}
        className="w-full border rounded-lg px-4 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-[#0000FF]" />
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-600">
            <tr>
              <th className="text-left p-4">Title</th>
              <th className="text-left p-4">Author</th>
              <th className="text-left p-4">Category</th>
              <th className="text-center p-4">Total</th>
              <th className="text-center p-4">Available</th>
              <th className="text-center p-4">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {books.map(b => (
              <tr key={b.id} className="hover:bg-gray-50">
                <td className="p-4 font-medium">{b.title}</td>
                <td className="p-4 text-gray-500">{b.author}</td>
                <td className="p-4"><span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">{b.category}</span></td>
                <td className="p-4 text-center">{b.quantity}</td>
                <td className="p-4 text-center">
                  <span className={b.available > 0 ? 'text-green-600 font-medium' : 'text-red-600 font-medium'}>{b.available}</span>
                </td>
                <td className="p-4 text-center">
                  <button onClick={() => openEdit(b)} className="text-[#0000FF] hover:underline mr-3">Edit</button>
                  <button onClick={() => handleDelete(b.id)} className="text-red-600 hover:underline">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">{editBook ? 'Edit Book' : 'Add Book'}</h2>
            <form onSubmit={handleSubmit} className="space-y-3">
              <input type="text" placeholder="Title" required value={form.title} onChange={e => setForm({ ...form, title: e.target.value })}
                className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#0000FF]" />
              <input type="text" placeholder="Author" required value={form.author} onChange={e => setForm({ ...form, author: e.target.value })}
                className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#0000FF]" />
              <input type="text" placeholder="ISBN" value={form.isbn} onChange={e => setForm({ ...form, isbn: e.target.value })}
                className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#0000FF]" />
              <input type="text" placeholder="Category" value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}
                className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#0000FF]" />
              <input type="number" placeholder="Quantity" required min="1" value={form.quantity} onChange={e => setForm({ ...form, quantity: parseInt(e.target.value) })}
                className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#0000FF]" />
              <div className="flex gap-3 pt-2">
                <button type="submit" className="flex-1 bg-[#0000FF] text-white py-2 rounded-lg hover:bg-[#0000DD]">{editBook ? 'Update' : 'Create'}</button>
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-lg hover:bg-gray-300">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
