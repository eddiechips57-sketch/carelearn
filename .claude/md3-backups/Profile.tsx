import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../services/supabaseClient';

export default function Profile() {
  const { user } = useAuth();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!user) return;
    setEmail(user.email || '');
    (async () => {
      const { data } = await supabase.from('profiles').select('full_name').eq('id', user.id).maybeSingle();
      if (data) setFullName(data.full_name || '');
      setLoading(false);
    })();
  }, [user]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setSaving(true);
    setMessage('');
    const { error } = await supabase.from('profiles').update({ full_name: fullName, updated_at: new Date().toISOString() }).eq('id', user.id);
    setSaving(false);
    setMessage(error ? 'Failed to save changes.' : 'Profile updated successfully.');
    setTimeout(() => setMessage(''), 3000);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20">
        <span className="material-symbols-outlined text-primary animate-spin" style={{ fontSize: '32px' }}>progress_activity</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface pt-24 pb-16">
      <div className="section-container max-w-2xl">
        <h1 className="text-headline-lg font-headline font-bold text-on-surface mb-1">Profile Settings</h1>
        <p className="text-body-md text-on-surface-variant mb-8">Manage your CareLearn account details</p>

        <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-card">
          {message && (
            <div className={`mb-6 rounded-lg border p-3 text-label-md ${
              message.includes('Failed')
                ? 'bg-error-container border-error/20 text-error'
                : 'bg-secondary-fixed border-secondary/20 text-on-secondary-fixed'
            }`}>
              {message}
            </div>
          )}
          <form onSubmit={handleSave} className="space-y-5">
            <div>
              <label className="block text-label-md font-medium text-on-surface mb-1.5">Full Name</label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-on-surface-variant" style={{ fontSize: '16px' }}>person</span>
                <input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} className="input-base pl-10" placeholder="Your full name" />
              </div>
            </div>
            <div>
              <label className="block text-label-md font-medium text-on-surface mb-1.5">Email</label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-on-surface-variant" style={{ fontSize: '16px' }}>mail</span>
                <input type="email" value={email} disabled className="input-base pl-10 bg-slate-50 text-on-surface-variant cursor-not-allowed" />
              </div>
              <p className="text-label-sm text-on-surface-variant mt-1">Email cannot be changed</p>
            </div>
            <button type="submit" disabled={saving} className="btn-primary disabled:opacity-60 disabled:cursor-not-allowed">
              {saving ? (
                <span className="flex items-center gap-2">
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  Saving...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>save</span>
                  Save Changes
                </span>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
