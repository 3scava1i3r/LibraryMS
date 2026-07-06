import { useState, useEffect } from 'react';
import api from '../../api';

export default function Transactions() {
  const [records, setRecords] = useState([]);
  const [filter, setFilter] = useState('');
  const [search, setSearch] = useState('');
  const [showIssue, setShowIssue] = useState(false);
  const [issueForm, setIssueForm] = useState({ user_id: '', book_id: '' });
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    setLoading(true);
    setError('');
    const params = {};
    if (filter) params.status = filter;
    if (search) params.search = search;
    api.get('/borrow/all', { params }).then(r => {
      setRecords(r.data);
      setLoading(false);
    }).catch(() => {
      setError('Failed to load transactions');
      setLoading(false);
    });
  }, [filter, search]);

  const showMessage = (msg) => {
    setMessage(msg);
    setTimeout(() => setMessage(''), 5000);
  };

  const fetchTransactions = () => {
    const params = {};
    if (filter) params.status = filter;
    if (search) params.search = search;
    api.get('/borrow/all', { params }).then(r => setRecords(r.data)).catch(() => {});
  };

  const handleReturn = async (id) => {
    try {
      await api.put(`/borrow/return/${id}`);
      showMessage('Book returned successfully!');
      fetchTransactions();
    } catch (err) {
      showMessage(err.response?.data?.error || 'Return failed');
    }
  };

  const handleIssue = async (e) => {
    e.preventDefault();
    try {
      await api.post('/borrow', { book_id: parseInt(issueForm.book_id), user_id: parseInt(issueForm.user_id) });
      setShowIssue(false);
      showMessage('Book issued successfully!');
      fetchTransactions();
    } catch (err) {
      showMessage(err.response?.data?.error || 'Failed');
    }
  };

  const getStatusBadge = (r) => {
    if (r.status === 'returned') return <span className="text-xs font-mono uppercase tracking-wider border-[2px] border-[#008000] text-[#008000] px-2 py-1">Returned</span>;
    if (new Date(r.due_date) < new Date()) return <span className="text-xs font-mono uppercase tracking-wider border-[2px] border-[#FF0000] text-[#FF0000] px-2 py-1">Overdue</span>;
    return <span className="text-xs font-mono uppercase tracking-wider border-[2px] border-[#FFA500] text-[#FFA500] px-2 py-1">Borrowed</span>;
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="font-raw text-5xl uppercase tracking-wider">Transactions</h1>
        <button onClick={() => setShowIssue(true)} className="bg-black text-white px-4 py-2 font-mono text-sm uppercase tracking-widest border-[3px] border-black hover:bg-white hover:text-black">
          + Issue Book
        </button>
      </div>

      {message && (
        <div className={`p-3 mb-4 text-sm border-[3px] font-mono ${message.includes('successfully') ? 'border-[#008000] text-[#008000]' : 'border-[#FF0000] text-[#FF0000]'}`}>
          {message}
          <button onClick={() => setMessage('')} className="float-right font-bold">&times;</button>
        </div>
      )}
      {error && <div className="bg-white text-[#FF0000] p-3 mb-4 text-sm border-[3px] border-[#FF0000] font-mono">{error}</div>}

      <div className="flex gap-4 mb-4">
        <input type="text" placeholder="Search by user or book..." value={search} onChange={e => setSearch(e.target.value)}
          className="flex-1 bg-[#F0F0F0] border-[3px] border-black px-4 py-2 text-black placeholder:text-gray-500 font-mono text-[15px] focus:outline-none focus:border-[5px]" />
        <select value={filter} onChange={e => setFilter(e.target.value)}
          className="bg-[#F0F0F0] border-[3px] border-black px-4 py-2 text-black font-mono text-[15px] focus:outline-none focus:border-[5px]">
          <option value="">All</option>
          <option value="borrowed">Borrowed</option>
          <option value="returned">Returned</option>
        </select>
      </div>

      {loading ? (
        <p className="text-center text-gray-500 py-12 font-mono">Loading transactions...</p>
      ) : (
      <div className="bg-white border-[3px] border-black">
        <table className="w-full text-sm">
          <thead className="bg-black text-white">
            <tr>
              <th className="text-left p-4 font-mono uppercase tracking-wider text-xs">Book</th>
              <th className="text-left p-4 font-mono uppercase tracking-wider text-xs">Member</th>
              <th className="text-left p-4 font-mono uppercase tracking-wider text-xs">Borrowed</th>
              <th className="text-left p-4 font-mono uppercase tracking-wider text-xs">Due</th>
              <th className="text-left p-4 font-mono uppercase tracking-wider text-xs">Returned</th>
              <th className="text-left p-4 font-mono uppercase tracking-wider text-xs">Status</th>
              <th className="text-center p-4 font-mono uppercase tracking-wider text-xs">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-black">
            {records.length === 0 ? (
              <tr><td colSpan="7" className="text-center p-8 text-gray-500 font-mono">No transactions found</td></tr>
            ) : records.map(r => (
              <tr key={r.id} className="hover:bg-black hover:text-white">
                <td className="p-4 font-medium">{r.title}</td>
                <td className="p-4 text-gray-500">{r.user_name}</td>
                <td className="p-4 text-gray-500">{new Date(r.borrow_date).toLocaleDateString()}</td>
                <td className="p-4 text-gray-500">{new Date(r.due_date).toLocaleDateString()}</td>
                <td className="p-4 text-gray-500">{r.return_date ? new Date(r.return_date).toLocaleDateString() : '-'}</td>
                <td className="p-4">{getStatusBadge(r)}</td>
                <td className="p-4 text-center">
                  {r.status === 'borrowed' && (
                    <button onClick={() => handleReturn(r.id)} className="hover:underline text-sm font-medium">Return</button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      )}

      {showIssue && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white border-[3px] border-black p-6 w-full max-w-md">
            <h2 className="font-raw text-xl uppercase tracking-wider text-black mb-4">Issue Book</h2>
            <form onSubmit={handleIssue} className="space-y-3">
              <input type="number" placeholder="User ID" required value={issueForm.user_id} onChange={e => setIssueForm({ ...issueForm, user_id: e.target.value })}
                className="w-full bg-[#F0F0F0] border-[3px] border-black px-3 py-2 text-black placeholder:text-gray-500 font-mono text-[15px] focus:outline-none focus:border-[5px]" />
              <input type="number" placeholder="Book ID" required value={issueForm.book_id} onChange={e => setIssueForm({ ...issueForm, book_id: e.target.value })}
                className="w-full bg-[#F0F0F0] border-[3px] border-black px-3 py-2 text-black placeholder:text-gray-500 font-mono text-[15px] focus:outline-none focus:border-[5px]" />
              <div className="flex gap-3 pt-2">
                <button type="submit" className="flex-1 bg-black text-white py-2 font-mono text-sm uppercase tracking-widest border-[3px] border-black hover:bg-white hover:text-black">Issue</button>
                <button type="button" onClick={() => { setShowIssue(false); setMessage(''); }} className="flex-1 bg-white text-black py-2 font-mono text-sm uppercase tracking-widest border-[3px] border-black hover:bg-black hover:text-white">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
