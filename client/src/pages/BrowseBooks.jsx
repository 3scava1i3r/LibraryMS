import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';

export default function BrowseBooks() {
  const [books, setBooks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get('/books/categories').then(r => setCategories(r.data)).catch(() => {});
  }, []);

  useEffect(() => {
    setLoading(true);
    setError('');
    const params = {};
    if (search) params.search = search;
    if (category) params.category = category;
    api.get('/books', { params }).then(r => {
      setBooks(r.data);
      setLoading(false);
    }).catch(() => {
      setError('Failed to load books');
      setLoading(false);
    });
  }, [search, category]);

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-raw text-5xl uppercase tracking-wider">Browse Books</h1>
      </div>
      <div className="flex gap-4 mb-6">
        <input type="text" placeholder="Search by title or author..." value={search}
          onChange={e => setSearch(e.target.value)}
          className="flex-1 bg-[#F0F0F0] border-[3px] border-black px-4 py-2 text-black placeholder:text-gray-500 font-mono text-[15px] focus:outline-none focus:border-[5px]" />
        <select value={category} onChange={e => setCategory(e.target.value)}
          className="bg-[#F0F0F0] border-[3px] border-black px-4 py-2 text-black font-mono text-[15px] focus:outline-none focus:border-[5px]">
          <option value="">All Categories</option>
          {categories.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {loading ? (
          <p className="col-span-full text-center text-gray-500 py-12 font-mono">Loading books...</p>
        ) : error ? (
          <p className="col-span-full text-center text-[#FF0000] py-12 font-mono">{error}</p>
        ) : books.length === 0 ? (
          <p className="col-span-full text-center text-gray-500 py-12 font-mono">No books found</p>
        ) : books.map(book => (
          <Link key={book.id} to={`/books/${book.id}`}
            className="bg-white border-[3px] border-black p-5 hover:bg-black hover:text-white group">
            <h3 className="font-body font-semibold text-base mb-1 line-clamp-2 group-hover:text-white">{book.title}</h3>
            <p className="text-sm text-gray-500 mb-2 group-hover:text-gray-300">{book.author}</p>
            <span className="text-xs font-mono uppercase tracking-wider border-[2px] border-black px-2 py-1 group-hover:border-white group-hover:text-white">{book.category}</span>
            <p className="text-sm mt-3 font-mono">
              <span className={book.available > 0 ? 'text-[#008000] font-medium' : 'text-[#FF0000] font-medium'}>
                {book.available > 0 ? `${book.available} available` : 'Unavailable'}
              </span>
              <span className="text-gray-500 ml-2 group-hover:text-gray-300">({book.quantity} total)</span>
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
