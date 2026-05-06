import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Brain } from 'lucide-react';
import api from '@/services/api';
import { useAuthStore } from '@/store/auth';
import toast from 'react-hot-toast';

export default function LoginPage() {
  const { register, handleSubmit, formState: { errors } } = useForm<{ email: string; password: string }>();
  const [loading, setLoading] = useState(false);
  const { setAuth } = useAuthStore();
  const navigate = useNavigate();

  const onSubmit = async (data: { email: string; password: string }) => {
    setLoading(true);
    // Demo mode: bypass backend if using demo credentials
    if (data.email === 'admin@example.com' && data.password === 'password') {
      setAuth('demo-token', { id: 1, email: 'admin@example.com', full_name: 'Admin User', role: 'admin', is_active: true } as any);
      toast.success('Welcome back!');
      navigate('/dashboard');
      setLoading(false);
      return;
    }
    try {
      const res = await api.post('/auth/login', data);
      setAuth(res.data.access_token, res.data.user);
      toast.success('Welcome back!');
      navigate('/dashboard');
    } catch {
      toast.error('Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ background: '#0f1117' }}>
      <div className="w-full max-w-md">
        <div className="rounded-2xl p-8" style={{ background: '#1a1d27', border: '1px solid #2a2d3e' }}>
          <div className="text-center mb-8">
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4" style={{ background: 'linear-gradient(135deg, #7c3aed, #4f46e5)' }}>
              <Brain size={28} className="text-white" />
            </div>
            <h1 className="text-2xl font-bold text-white">SalesVision AI</h1>
            <p className="text-sm mt-1" style={{ color: '#9ca3af' }}>Sign in to your account</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: '#e2e8f0' }}>Email</label>
              <input
                {...register('email', { required: 'Email is required' })}
                type="email"
                className="w-full px-4 py-2.5 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
                style={{ background: '#0f1117', border: '1px solid #2a2d3e', color: '#e2e8f0' }}
                placeholder="you@company.com"
              />
              {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: '#e2e8f0' }}>Password</label>
              <input
                {...register('password', { required: 'Password is required' })}
                type="password"
                className="w-full px-4 py-2.5 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
                style={{ background: '#0f1117', border: '1px solid #2a2d3e', color: '#e2e8f0' }}
                placeholder="••••••••"
              />
              {errors.password && <p className="text-red-400 text-xs mt-1">{errors.password.message}</p>}
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl text-white font-semibold text-sm transition-opacity disabled:opacity-60 mt-2"
              style={{ background: 'linear-gradient(135deg, #7c3aed, #4f46e5)' }}
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <div className="mt-5 p-4 rounded-xl text-sm" style={{ background: '#0f1117', border: '1px solid #2a2d3e' }}>
            <span style={{ color: '#9ca3af' }}><strong className="text-white">Demo:</strong> admin@example.com / password</span>
          </div>
        </div>
      </div>
    </div>
  );
}