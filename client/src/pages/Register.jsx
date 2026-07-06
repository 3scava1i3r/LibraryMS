import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', phone: '' });
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password.length < 8) return setError('Password must be at least 8 characters');
    try {
      await register(form.name, form.email, form.password, form.phone);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-16">
      <div className="bg-white border-[3px] border-black p-8">
        <div className="text-center mb-6">
          <h1 className="font-raw text-4xl uppercase tracking-wider">Create Account</h1>
        </div>
        {error && <div className="bg-white text-[#FF0000] p-3 mb-4 text-sm border-[3px] border-[#FF0000] font-mono">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block font-raw text-sm uppercase tracking-wider text-black mb-1">Full Name</label>
            <input type="text" required autoComplete="name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
              className="w-full bg-[#F0F0F0] border-[3px] border-black px-3 py-2 text-black placeholder:text-gray-500 font-mono text-[15px] focus:outline-none focus:border-[5px]" />
          </div>
          <div>
            <label className="block font-raw text-sm uppercase tracking-wider text-black mb-1">Email</label>
            <input type="email" required autoComplete="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })}
              className="w-full bg-[#F0F0F0] border-[3px] border-black px-3 py-2 text-black placeholder:text-gray-500 font-mono text-[15px] focus:outline-none focus:border-[5px]" />
          </div>
          <div>
            <label className="block font-raw text-sm uppercase tracking-wider text-black mb-1">Password</label>
            <input type="password" required autoComplete="new-password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })}
              className="w-full bg-[#F0F0F0] border-[3px] border-black px-3 py-2 text-black placeholder:text-gray-500 font-mono text-[15px] focus:outline-none focus:border-[5px]" />
          </div>
          <div>
            <label className="block font-raw text-sm uppercase tracking-wider text-black mb-1">Phone (optional)</label>
            <input type="text" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })}
              className="w-full bg-[#F0F0F0] border-[3px] border-black px-3 py-2 text-black placeholder:text-gray-500 font-mono text-[15px] focus:outline-none focus:border-[5px]" />
          </div>
          <button type="submit" className="w-full bg-black text-white py-3 font-mono text-sm uppercase tracking-widest border-[3px] border-black hover:bg-white hover:text-black">
            Register
          </button>
        </form>
        <p className="text-center text-sm text-gray-500 mt-4 font-mono">
          Already have an account? <Link to="/login" className="text-[#0000FF] hover:underline">Sign In</Link>
        </p>
      </div>
    </div>
  );
}
