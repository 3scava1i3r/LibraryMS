import { useState, useEffect } from 'react';
import api from '../api';

export default function MyBooks() {
  const [records, setRecords] = useState([]);

  useEffect(() => { api.get('/borrow/my').then(r => setRecords(r.data)); }, []);

  const isOverdue = (dueDate) => new Date(dueDate) < new Date();

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">My Borrowed Books</h1>
      {records.length === 0 ? (
        <p className="text-center text-gray-400 py-12">No borrowing history yet</p>
      ) : (
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-600">
              <tr>
                <th className="text-left p-4">Book</th>
                <th className="text-left p-4">Author</th>
                <th className="text-left p-4">Borrowed</th>
                <th className="text-left p-4">Due Date</th>
                <th className="text-left p-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {records.map(r => (
                <tr key={r.id} className="hover:bg-gray-50">
                  <td className="p-4 font-medium">{r.title}</td>
                  <td className="p-4 text-gray-500">{r.author}</td>
                  <td className="p-4 text-gray-500">{new Date(r.borrow_date).toLocaleDateString()}</td>
                  <td className="p-4">
                    <span className={isOverdue(r.due_date) && r.status === 'borrowed' ? 'text-red-600 font-medium' : 'text-gray-500'}>
                      {new Date(r.due_date).toLocaleDateString()}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      r.status === 'returned' ? 'bg-green-100 text-green-700' :
                      isOverdue(r.due_date) ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'
                    }`}>
                      {r.status === 'returned' ? 'Returned' : isOverdue(r.due_date) ? 'Overdue' : 'Borrowed'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
