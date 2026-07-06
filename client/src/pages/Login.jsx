import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const user = await login(form.email, form.password);
      navigate(user.role === 'admin' ? '/admin' : '/browse');
    } catch {
      setError('Invalid email or password');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-16">
      <div className="bg-white border-[3px] border-black p-8">
        <div className="text-center mb-6">
          <h1 className="font-raw text-4xl uppercase tracking-wider">Sign In</h1>
        </div>
        {error && <div className="bg-white text-[#FF0000] p-3 mb-4 text-sm border-[3px] border-[#FF0000] font-mono">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block font-raw text-sm uppercase tracking-wider text-black mb-1">Email</label>
            <input type="email" required autoComplete="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })}
              className="w-full bg-[#F0F0F0] border-[3px] border-black px-3 py-2 text-black placeholder:text-gray-500 font-mono text-[15px] focus:outline-none focus:border-[5px]" />
          </div>
          <div>
            <label className="block font-raw text-sm uppercase tracking-wider text-black mb-1">Password</label>
            <input type="password" required autoComplete="current-password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })}
              className="w-full bg-[#F0F0F0] border-[3px] border-black px-3 py-2 text-black placeholder:text-gray-500 font-mono text-[15px] focus:outline-none focus:border-[5px]" />
          </div>
          <button type="submit" className="w-full bg-black text-white py-3 font-mono text-sm uppercase tracking-widest border-[3px] border-black hover:bg-white hover:text-black">
            Sign In
          </button>
        </form>
        <p className="text-center text-sm text-gray-500 mt-4 font-mono">
          Don't have an account? <Link to="/register" className="text-[#0000FF] hover:underline">Register</Link>
        </p>
        {import.meta.env.DEV && (
          <div className="mt-6 p-3 border-[3px] border-black text-xs font-mono">
            <p className="font-raw uppercase tracking-wider mb-1">Demo Credentials:</p>
            <p>Admin: admin@library.com / admin123</p>
            <p>User: john@test.com / user123</p>
          </div>
        )}
      </div>
    </div>
  );
}
