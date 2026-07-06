import { useState, useEffect } from 'react';
import api from '../../api';

export default function ManageBooks() {
  const [books, setBooks] = useState([]);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editBook, setEditBook] = useState(null);
  const [form, setForm] = useState({ title: '', author: '', isbn: '', category: '', quantity: 1 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    setLoading(true);
    setError('');
    const params = {};
    if (search) params.search = search;
    api.get('/books', { params }).then(r => {
      setBooks(r.data);
      setLoading(false);
    }).catch(() => {
      setError('Failed to load books');
      setLoading(false);
    });
  }, [search]);

  useEffect(() => {
    api.get('/books/categories').then(r => setCategories(r.data)).catch(() => {});
  }, []);

  const fetchBooks = () => {
    const params = {};
    if (search) params.search = search;
    api.get('/books', { params }).then(r => setBooks(r.data)).catch(() => {});
  };

  const openCreate = () => {
    setEditBook(null);
    setForm({ title: '', author: '', isbn: '', category: '', quantity: 1 });
    setShowModal(true);
  };

  const openEdit = (book) => {
    setEditBook(book);
    const cat = categories.includes(book.category) ? book.category : '';
    setForm({ title: book.title, author: book.author, isbn: book.isbn, category: cat, quantity: book.quantity });
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
      fetchBooks();
    } catch (err) {
      setError(err.response?.data?.error || 'Operation failed');
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/books/${id}`);
      setDeleteConfirm(null);
      fetchBooks();
    } catch (err) {
      setError(err.response?.data?.error || 'Delete failed');
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="font-raw text-5xl uppercase tracking-wider">Manage Books</h1>
        <button onClick={openCreate} className="bg-black text-white px-4 py-2 font-mono text-sm uppercase tracking-widest border-[3px] border-black hover:bg-white hover:text-black">
          + Add Book
        </button>
      </div>
      {error && <div className="bg-white text-[#FF0000] p-3 mb-4 text-sm border-[3px] border-[#FF0000] font-mono">{error}</div>}
      <input type="text" placeholder="Search books..." value={search} onChange={e => setSearch(e.target.value)}
        className="w-full bg-[#F0F0F0] border-[3px] border-black px-4 py-2 mb-4 text-black placeholder:text-gray-500 font-mono text-[15px] focus:outline-none focus:border-[5px]" />
      {loading ? (
        <p className="text-center text-gray-500 py-12 font-mono">Loading books...</p>
      ) : (
      <div className="bg-white border-[3px] border-black">
        <table className="w-full text-sm">
          <thead className="bg-black text-white">
            <tr>
              <th className="text-left p-4 font-mono uppercase tracking-wider text-xs">Title</th>
              <th className="text-left p-4 font-mono uppercase tracking-wider text-xs">Author</th>
              <th className="text-left p-4 font-mono uppercase tracking-wider text-xs">Category</th>
              <th className="text-center p-4 font-mono uppercase tracking-wider text-xs">Total</th>
              <th className="text-center p-4 font-mono uppercase tracking-wider text-xs">Available</th>
              <th className="text-center p-4 font-mono uppercase tracking-wider text-xs">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-black">
            {books.length === 0 ? (
              <tr><td colSpan="6" className="text-center p-8 text-gray-500 font-mono">No books found</td></tr>
            ) : books.map(b => (
              <tr key={b.id} className="hover:bg-black hover:text-white">
                <td className="p-4 font-medium">{b.title}</td>
                <td className="p-4 text-gray-500">{b.author}</td>
                <td className="p-4"><span className="text-xs font-mono uppercase tracking-wider border-[2px] border-black px-2 py-1">{b.category}</span></td>
                <td className="p-4 text-center text-gray-500">{b.quantity}</td>
                <td className="p-4 text-center">
                  <span className={b.available > 0 ? 'text-[#008000] font-medium' : 'text-[#FF0000] font-medium'}>{b.available}</span>
                </td>
                <td className="p-4 text-center">
                  <button onClick={() => openEdit(b)} className="hover:underline mr-3">Edit</button>
                  <button onClick={() => setDeleteConfirm(b)} className="text-[#FF0000] hover:underline">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      )}

      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white border-[3px] border-black p-6 w-full max-w-sm">
            <h2 className="font-raw text-lg uppercase tracking-wider text-black mb-2">Delete Book</h2>
            <p className="text-gray-500 text-sm mb-4 font-mono">Delete "{deleteConfirm.title}"? This cannot be undone.</p>
            <div className="flex gap-3">
              <button onClick={() => handleDelete(deleteConfirm.id)} className="flex-1 bg-[#FF0000] text-white py-2 font-mono text-sm uppercase tracking-widest border-[3px] border-black hover:bg-black hover:text-[#FF0000]">Delete</button>
              <button onClick={() => setDeleteConfirm(null)} className="flex-1 bg-white text-black py-2 font-mono text-sm uppercase tracking-widest border-[3px] border-black hover:bg-black hover:text-white">Cancel</button>
            </div>
          </div>
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white border-[3px] border-black p-6 w-full max-w-md">
            <h2 className="font-raw text-xl uppercase tracking-wider text-black mb-4">{editBook ? 'Edit Book' : 'Add Book'}</h2>
            <form onSubmit={handleSubmit} className="space-y-3">
              <input type="text" placeholder="Title" required value={form.title} onChange={e => setForm({ ...form, title: e.target.value })}
                className="w-full bg-[#F0F0F0] border-[3px] border-black px-3 py-2 text-black placeholder:text-gray-500 font-mono text-[15px] focus:outline-none focus:border-[5px]" />
              <input type="text" placeholder="Author" required value={form.author} onChange={e => setForm({ ...form, author: e.target.value })}
                className="w-full bg-[#F0F0F0] border-[3px] border-black px-3 py-2 text-black placeholder:text-gray-500 font-mono text-[15px] focus:outline-none focus:border-[5px]" />
              <input type="text" placeholder="ISBN" value={form.isbn} onChange={e => setForm({ ...form, isbn: e.target.value })}
                className="w-full bg-[#F0F0F0] border-[3px] border-black px-3 py-2 text-black placeholder:text-gray-500 font-mono text-[15px] focus:outline-none focus:border-[5px]" />
              <div className="space-y-2">
                <label className="font-raw text-sm uppercase tracking-wider text-black">Category</label>
                {categories.length === 0 ? (
                  <p className="text-gray-500 font-mono text-sm">No categories available yet</p>
                ) : (
                  <div className="flex flex-wrap gap-x-5 gap-y-2">
                    {categories.map(cat => (
                      <label key={cat} className="flex items-center gap-2 cursor-pointer group">
                        <span className="relative w-5 h-5">
                          <input type="radio" name="category" value={cat}
                            checked={form.category === cat}
                            onChange={() => setForm({ ...form, category: cat })}
                            className="absolute inset-0 opacity-0 w-full h-full cursor-pointer z-10" />
                          <span className="absolute inset-0 rounded-full border-[3px] border-black bg-white flex items-center justify-center group-focus-within:border-[5px] transition-[border-width]">
                            {form.category === cat && <span className="w-[10px] h-[10px] rounded-full bg-black" />}
                          </span>
                        </span>
                        <span className="font-mono text-sm">{cat}</span>
                      </label>
                    ))}
                  </div>
                )}
              </div>
              <input type="number" placeholder="Quantity" required min="1" value={form.quantity} onChange={e => setForm({ ...form, quantity: parseInt(e.target.value) })}
                className="w-full bg-[#F0F0F0] border-[3px] border-black px-3 py-2 text-black placeholder:text-gray-500 font-mono text-[15px] focus:outline-none focus:border-[5px]" />
              <div className="flex gap-3 pt-2">
                <button type="submit" className="flex-1 bg-black text-white py-2 font-mono text-sm uppercase tracking-widest border-[3px] border-black hover:bg-white hover:text-black">{editBook ? 'Update' : 'Create'}</button>
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 bg-white text-black py-2 font-mono text-sm uppercase tracking-widest border-[3px] border-black hover:bg-black hover:text-white">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
