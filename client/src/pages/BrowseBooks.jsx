import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';

export default function BrowseBooks() {
  const [books, setBooks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');

  useEffect(() => {
    api.get('/books/categories').then(r => setCategories(r.data));
  }, []);

  useEffect(() => {
    const params = {};
    if (search) params.search = search;
    if (category) params.category = category;
    api.get('/books', { params }).then(r => setBooks(r.data));
  }, [search, category]);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Browse Books</h1>
      <div className="flex gap-4 mb-6">
        <input type="text" placeholder="Search by title or author..." value={search}
          onChange={e => setSearch(e.target.value)}
          className="flex-1 border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
        <select value={category} onChange={e => setCategory(e.target.value)}
          className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500">
          <option value="">All Categories</option>
          {categories.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {books.map(book => (
          <Link key={book.id} to={`/books/${book.id}`}
            className="bg-white rounded-xl shadow-sm hover:shadow-md transition p-5 border border-gray-100">
            <div className="text-3xl mb-3">📖</div>
            <h3 className="font-semibold text-gray-800 mb-1 line-clamp-2">{book.title}</h3>
            <p className="text-sm text-gray-500 mb-2">{book.author}</p>
            <span className="text-xs bg-indigo-100 text-indigo-700 px-2 py-1 rounded">{book.category}</span>
            <p className="text-sm mt-3">
              <span className={book.available > 0 ? 'text-green-600 font-medium' : 'text-red-600 font-medium'}>
                {book.available > 0 ? `${book.available} available` : 'Unavailable'}
              </span>
              <span className="text-gray-400 ml-2">({book.quantity} total)</span>
            </p>
          </Link>
        ))}
        {books.length === 0 && <p className="col-span-full text-center text-gray-400 py-12">No books found</p>}
      </div>
    </div>
  );
}
