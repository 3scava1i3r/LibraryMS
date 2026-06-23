import { useState, useEffect } from 'react';
import api from '../../api';

export default function Transactions() {
  const [records, setRecords] = useState([]);
  const [filter, setFilter] = useState('');
  const [search, setSearch] = useState('');
  const [showIssue, setShowIssue] = useState(false);
  const [issueForm, setIssueForm] = useState({ user_id: '', book_id: '' });
  const [message, setMessage] = useState('');

  useEffect(() => {
    const params = {};
    if (filter) params.status = filter;
    if (search) params.search = search;
    api.get('/borrow/all', { params }).then(r => setRecords(r.data));
  }, [filter, search]);

  const handleReturn = async (id) => {
    try {
      await api.put(`/borrow/return/${id}`);
      api.get('/borrow/all', { params: { status: filter, search } }).then(r => setRecords(r.data));
    } catch (err) {
      alert(err.response?.data?.error || 'Return failed');
    }
  };

  const handleIssue = async (e) => {
    e.preventDefault();
    try {
      await api.post('/borrow', { book_id: parseInt(issueForm.book_id), user_id: parseInt(issueForm.user_id) });
      setShowIssue(false);
      setMessage('Book issued successfully!');
      api.get('/borrow/all', { params: { status: filter, search } }).then(r => setRecords(r.data));
    } catch (err) {
      setMessage(err.response?.data?.error || 'Failed');
    }
  };

  const getStatusBadge = (r) => {
    if (r.status === 'returned') return <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-medium">Returned</span>;
    if (new Date(r.due_date) < new Date()) return <span className="bg-red-100 text-red-700 px-2 py-1 rounded-full text-xs font-medium">Overdue</span>;
    return <span className="bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full text-xs font-medium">Borrowed</span>;
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Transactions</h1>
        <button onClick={() => setShowIssue(true)} className="bg-[#0000FF] text-white px-4 py-2 rounded-lg text-sm hover:bg-[#0000DD]">
          + Issue Book
        </button>
      </div>

      {message && (
        <div className={`p-3 rounded-lg mb-4 text-sm ${message.includes('successfully') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
          {message}
          <button onClick={() => setMessage('')} className="float-right font-bold">&times;</button>
        </div>
      )}

      <div className="flex gap-4 mb-4">
        <input type="text" placeholder="Search by user or book..." value={search} onChange={e => setSearch(e.target.value)}
          className="flex-1 border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#0000FF]" />
        <select value={filter} onChange={e => setFilter(e.target.value)}
          className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#0000FF]">
          <option value="">All</option>
          <option value="borrowed">Borrowed</option>
          <option value="returned">Returned</option>
        </select>
      </div>

      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-600">
            <tr>
              <th className="text-left p-4">Book</th>
              <th className="text-left p-4">Member</th>
              <th className="text-left p-4">Borrowed</th>
              <th className="text-left p-4">Due</th>
              <th className="text-left p-4">Returned</th>
              <th className="text-left p-4">Status</th>
              <th className="text-center p-4">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {records.map(r => (
              <tr key={r.id} className="hover:bg-gray-50">
                <td className="p-4 font-medium">{r.title}</td>
                <td className="p-4 text-gray-500">{r.user_name}</td>
                <td className="p-4 text-gray-500">{new Date(r.borrow_date).toLocaleDateString()}</td>
                <td className="p-4">{new Date(r.due_date).toLocaleDateString()}</td>
                <td className="p-4 text-gray-500">{r.return_date ? new Date(r.return_date).toLocaleDateString() : '-'}</td>
                <td className="p-4">{getStatusBadge(r)}</td>
                <td className="p-4 text-center">
                  {r.status === 'borrowed' && (
                    <button onClick={() => handleReturn(r.id)} className="text-green-600 hover:underline text-sm">Return</button>
                  )}
                </td>
              </tr>
            ))}
            {records.length === 0 && (
              <tr><td colSpan="7" className="text-center p-8 text-gray-400">No transactions found</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {showIssue && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Issue Book</h2>
            <form onSubmit={handleIssue} className="space-y-3">
              <input type="number" placeholder="User ID" required value={issueForm.user_id} onChange={e => setIssueForm({ ...issueForm, user_id: e.target.value })}
                className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#0000FF]" />
              <input type="number" placeholder="Book ID" required value={issueForm.book_id} onChange={e => setIssueForm({ ...issueForm, book_id: e.target.value })}
                className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#0000FF]" />
              <div className="flex gap-3 pt-2">
                <button type="submit" className="flex-1 bg-[#0000FF] text-white py-2 rounded-lg hover:bg-[#0000DD]">Issue</button>
                <button type="button" onClick={() => { setShowIssue(false); setMessage(''); }} className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-lg hover:bg-gray-300">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
