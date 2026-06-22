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

  if (loading) return <div className="text-center py-20 text-gray-500">Loading...</div>;
  if (!book) return null;

  return (
    <div className="max-w-2xl mx-auto">
      <button onClick={() => navigate(-1)} className="text-indigo-600 hover:underline mb-4 block">&larr; Back</button>
      <div className="bg-white rounded-xl shadow-md p-8">
        <div className="text-5xl mb-4">📖</div>
        <h1 className="text-3xl font-bold mb-2">{book.title}</h1>
        <p className="text-gray-500 text-lg mb-4">by {book.author}</p>
        <div className="flex gap-2 mb-6">
          <span className="text-xs bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full">{book.category}</span>
          {book.isbn && <span className="text-xs bg-gray-100 text-gray-600 px-3 py-1 rounded-full">ISBN: {book.isbn}</span>}
        </div>
        <div className="grid grid-cols-2 gap-4 mb-6 text-sm">
          <div className="bg-gray-50 p-3 rounded-lg">
            <span className="text-gray-500">Total Copies</span>
            <p className="text-xl font-bold">{book.quantity}</p>
          </div>
          <div className="bg-gray-50 p-3 rounded-lg">
            <span className="text-gray-500">Available</span>
            <p className={`text-xl font-bold ${book.available > 0 ? 'text-green-600' : 'text-red-600'}`}>{book.available}</p>
          </div>
        </div>
        {message && (
          <div className={`p-3 rounded-lg mb-4 text-sm ${message.includes('successfully') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
            {message}
          </div>
        )}
        <button onClick={handleBorrow} disabled={book.available < 1}
          className={`w-full py-3 rounded-lg font-medium transition ${book.available > 0 ? 'bg-indigo-600 text-white hover:bg-indigo-700' : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}>
          {book.available > 0 ? 'Borrow This Book' : 'Unavailable'}
        </button>
      </div>
    </div>
  );
}
