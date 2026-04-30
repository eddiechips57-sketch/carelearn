import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Lock, UserPlus, Mail, ArrowLeft, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

type Mode = 'signin' | 'signup' | 'reset';

export default function Login() {
  const [searchParams] = useSearchParams();
  const initialMode: Mode = searchParams.get('mode') === 'signup' ? 'signup' : 'signin';
  const [mode, setMode] = useState<Mode>(initialMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  const { signIn, signUp, resetPassword } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);

    try {
      if (mode === 'signin') {
        const { error } = await signIn(email, password);
        if (error) throw error;
        navigate('/');
      } else if (mode === 'signup') {
        const { error } = await signUp(email, password, fullName);
        if (error) throw error;
        setMessage('Account created successfully. You can now sign in.');
        setMode('signin');
      } else {
        const { error } = await resetPassword(email);
        if (error) throw error;
        setMessage('Password reset instructions have been sent to your email.');
      }
    } catch (err: any) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const switchMode = (newMode: Mode) => {
    setMode(newMode);
    setError('');
    setMessage('');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-brand-50/20 to-warm-50/10 px-4 pt-20 pb-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2.5 mb-4">
            <img
              src="/Whisk_34b89fcdd778439a7284ea375647e3f0dr.png"
              alt="CareLearn"
              className="h-11 w-auto"
            />
            <span className="text-xl font-display font-bold text-slate-900">CareLearn</span>
          </div>
          <h1 className="text-2xl font-display font-bold text-slate-900 mb-1">
            {mode === 'signin' && 'Welcome back'}
            {mode === 'signup' && 'Create your account'}
            {mode === 'reset' && 'Reset password'}
          </h1>
          <p className="text-sm text-slate-500">
            {mode === 'signin' && 'Sign in to access your learning dashboard'}
            {mode === 'signup' && 'Join the UK\'s health & social care learning directory'}
            {mode === 'reset' && 'We\'ll send you instructions to reset your password'}
          </p>
        </div>

        <div className="card-base p-8">
          {error && (
            <div className="mb-4 rounded-lg bg-red-50 border border-red-100 p-3 text-sm text-red-700">
              {error}
            </div>
          )}
          {message && (
            <div className="mb-4 rounded-lg bg-emerald-50 border border-emerald-100 p-3 text-sm text-emerald-700">
              {message}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'signup' && (
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Full Name</label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="input-base"
                  placeholder="Your full name"
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Email</label>
              <div className="relative">
                <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input-base pl-10"
                  placeholder="you@example.com"
                  required
                />
              </div>
            </div>

            {mode !== 'reset' && (
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Password</label>
                <div className="relative">
                  <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="input-base pl-10 pr-10"
                    placeholder="Your password"
                    required
                    minLength={6}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
            )}

            {mode === 'signin' && (
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => switchMode('reset')}
                  className="text-xs font-medium text-brand-600 hover:text-brand-700 transition-colors"
                >
                  Forgot password?
                </button>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  Processing...
                </span>
              ) : (
                <>
                  {mode === 'signin' && <><Lock size={16} /> Sign In</>}
                  {mode === 'signup' && <><UserPlus size={16} /> Create Account</>}
                  {mode === 'reset' && <><Mail size={16} /> Send Reset Link</>}
                </>
              )}
            </button>
          </form>

          <div className="mt-6 pt-5 border-t border-slate-100 text-center">
            {mode === 'signin' && (
              <p className="text-sm text-slate-500">
                Don't have an account?{' '}
                <button onClick={() => switchMode('signup')} className="font-medium text-brand-600 hover:text-brand-700">
                  Sign up
                </button>
              </p>
            )}
            {mode === 'signup' && (
              <p className="text-sm text-slate-500">
                Already have an account?{' '}
                <button onClick={() => switchMode('signin')} className="font-medium text-brand-600 hover:text-brand-700">
                  Sign in
                </button>
              </p>
            )}
            {mode === 'reset' && (
              <button
                onClick={() => switchMode('signin')}
                className="flex items-center gap-1 text-sm font-medium text-brand-600 hover:text-brand-700 mx-auto"
              >
                <ArrowLeft size={14} />
                Back to sign in
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
