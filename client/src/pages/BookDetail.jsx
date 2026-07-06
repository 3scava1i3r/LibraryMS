import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api';

export default function BookDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  useEffect(() => {
    api.get(`/books/${id}`).then(r => {
      setBook(r.data);
      setLoading(false);
    }).catch(() => {
      setLoading(false);
      navigate('/');
    });
  }, [id]);

  const handleBorrow = async () => {
    try {
      await api.post('/borrow', { book_id: parseInt(id) });
      setMessage('Book borrowed successfully! Due in 14 days.');
      const { data } = await api.get(`/books/${id}`);
      setBook(data);
    } catch (err) {
      setMessage(err.response?.data?.error || 'Failed to borrow');
    }
  };

  if (loading) return <div className="text-center py-20 text-gray-500 font-mono">Loading...</div>;
  if (!book) return null;

  return (
    <div className="max-w-2xl mx-auto">
      <button onClick={() => navigate('/browse')} className="text-gray-500 hover:text-black mb-4 block font-mono">&larr; Back to Browse</button>
      <div className="bg-white border-[3px] border-black p-8">
        <div className="mb-4">
          <h1 className="font-raw text-4xl uppercase tracking-wider">{book.title}</h1>
        </div>
        <p className="text-gray-500 text-lg mb-4 font-mono">by {book.author}</p>
        <div className="flex gap-2 mb-6">
          <span className="text-xs font-mono uppercase tracking-wider border-[2px] border-black px-3 py-1">{book.category}</span>
          {book.isbn && <span className="text-xs font-mono border-[2px] border-black px-3 py-1">ISBN: {book.isbn}</span>}
        </div>
        <div className="grid grid-cols-2 gap-4 mb-6 text-sm">
          <div className="border-[3px] border-black p-3">
            <span className="text-gray-500 font-mono uppercase tracking-wider text-xs">Total Copies</span>
            <p className="text-xl font-raw text-black">{book.quantity}</p>
          </div>
          <div className="border-[3px] border-black p-3">
            <span className="text-gray-500 font-mono uppercase tracking-wider text-xs">Available</span>
            <p className={`text-xl font-raw ${book.available > 0 ? 'text-[#008000]' : 'text-[#FF0000]'}`}>{book.available}</p>
          </div>
        </div>
        {message && (
          <div className={`p-3 mb-4 text-sm border-[3px] font-mono ${message.includes('successfully') ? 'border-[#008000] text-[#008000]' : 'border-[#FF0000] text-[#FF0000]'}`}>
            {message}
          </div>
        )}
        <button onClick={handleBorrow} disabled={book.available < 1}
          className={`w-full py-3 font-mono text-sm uppercase tracking-widest border-[3px] ${
            book.available > 0
              ? 'bg-black text-white border-black hover:bg-white hover:text-black'
              : 'bg-white text-gray-400 border-gray-400 cursor-not-allowed'
          }`}>
          {book.available > 0 ? 'Borrow This Book' : 'Unavailable'}
        </button>
      </div>
    </div>
  );
}
