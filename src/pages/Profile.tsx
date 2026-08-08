import { useState, useEffect, type FormEvent } from 'react';
import { motion } from 'framer-motion';
import { User as UserIcon, Mail, Phone, ShieldCheck, MapPin, Lock, Plus, Trash2, Star, X, CheckCircle2, Pencil } from 'lucide-react';
import { userService } from '../services/userService';
import { addressService } from '../services/addressService';
import { authService } from '../services/authService';
import type { User, Address } from '../types';
import LoadingSpinner from '../components/common/LoadingSpinner';

export default function Profile() {
  const [profile, setProfile] = useState<User | null>(null);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ firstName: '', lastName: '', phone: '' });
  const [passwordForm, setPasswordForm] = useState({ currentPassword: '', newPassword: '' });
  const [addressForm, setAddressForm] = useState({
    fullName: '', phone: '', addressLine1: '', addressLine2: '',
    city: '', state: '', zipCode: '', country: '', isDefault: false,
  });
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [msg, setMsg] = useState('');

  useEffect(() => {
    Promise.all([userService.getProfile(), addressService.getAll()])
      .then(([userRes, addrRes]) => {
        setProfile(userRes.data);
        setAddresses(addrRes.data);
        setForm({
          firstName: userRes.data.firstName,
          lastName: userRes.data.lastName,
          phone: userRes.data.phone || '',
        });
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleUpdateProfile = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const res = await userService.updateProfile(form);
      setProfile(res.data);
      setEditing(false);
      setMsg('Profile updated!');
    } catch { setMsg('Update failed'); }
  };

  const handleChangePassword = async (e: FormEvent) => {
    e.preventDefault();
    try {
      await authService.changePassword(passwordForm.currentPassword, passwordForm.newPassword);
      setPasswordForm({ currentPassword: '', newPassword: '' });
      setMsg('Password changed!');
    } catch { setMsg('Password change failed'); }
  };

  const handleAddAddress = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const res = await addressService.create(addressForm);
      setAddresses((prev) => [...prev, res.data]);
      setShowAddressForm(false);
      setAddressForm({ fullName: '', phone: '', addressLine1: '', addressLine2: '', city: '', state: '', zipCode: '', country: '', isDefault: false });
    } catch { setMsg('Failed to add address'); }
  };

  const handleDeleteAddress = async (id: number) => {
    try {
      await addressService.delete(id);
      setAddresses((prev) => prev.filter((a) => a.id !== id));
    } catch { setMsg('Failed to delete address'); }
  };

  const handleSetDefault = async (id: number) => {
    try {
      await addressService.setDefault(id);
      const updated = await addressService.getAll();
      setAddresses(updated.data);
    } catch { setMsg('Failed to set default address'); }
  };

  if (loading) return <LoadingSpinner />;

  const inputClass = 'input-premium w-full';
  const labelClass = 'block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wide';

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12">
      <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="font-display text-3xl md:text-4xl font-extrabold text-slate-900 mb-2">
          My <span className="text-gradient">Profile</span>
        </h1>
        <p className="text-slate-500">Manage your account, password and addresses</p>
      </motion.div>

      {msg && (
        <div className="mt-6 flex items-center gap-2 bg-emerald-50 border border-emerald-200 text-emerald-700 px-4 py-3 rounded-2xl text-sm font-semibold">
          <CheckCircle2 size={16} />
          {msg}
        </div>
      )}

      {/* Profile header */}
      <div className="bg-dark-900 rounded-3xl p-8 mt-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-brand-600/25 rounded-full blur-3xl" />
        <div className="relative flex items-center gap-5">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center text-white font-display text-2xl font-extrabold shadow-lg shadow-brand-500/30">
            {profile?.firstName?.charAt(0)?.toUpperCase()}{profile?.lastName?.charAt(0)?.toUpperCase()}
          </div>
          <div>
            <h2 className="font-display text-xl font-extrabold text-white">
              {profile?.firstName} {profile?.lastName}
            </h2>
            <p className="text-slate-400 text-sm mt-0.5">{profile?.email}</p>
          </div>
          <span className="ml-auto hidden sm:inline-flex items-center gap-1.5 text-xs font-bold text-white bg-white/10 border border-white/15 px-3 py-1.5 rounded-full">
            <ShieldCheck size={13} className="text-accent-400" />
            {profile?.role}
          </span>
        </div>
      </div>

      {/* Personal info */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-soft p-7 mt-6">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center">
              <UserIcon size={17} className="text-white" />
            </div>
            <h3 className="font-display text-lg font-extrabold text-slate-900">Personal Information</h3>
          </div>
          <button
            onClick={() => setEditing(!editing)}
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-600 hover:text-brand-700 transition-colors"
          >
            {editing ? <><X size={15} /> Cancel</> : <><Pencil size={14} /> Edit</>}
          </button>
        </div>

        {editing ? (
          <form onSubmit={handleUpdateProfile} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>First Name</label>
                <input value={form.firstName} onChange={(e) => setForm((p) => ({ ...p, firstName: e.target.value }))} className={inputClass} required />
              </div>
              <div>
                <label className={labelClass}>Last Name</label>
                <input value={form.lastName} onChange={(e) => setForm((p) => ({ ...p, lastName: e.target.value }))} className={inputClass} required />
              </div>
            </div>
            <div>
              <label className={labelClass}>Phone</label>
              <input value={form.phone} onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))} className={inputClass} />
            </div>
            <button type="submit" className="btn-accent px-6 py-3 rounded-xl font-display font-semibold text-sm uppercase tracking-wide">
              Save Changes
            </button>
          </form>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center gap-3 bg-slate-50 rounded-2xl p-4">
              <UserIcon size={18} className="text-brand-600 shrink-0" />
              <div>
                <p className="text-xs text-slate-400 uppercase tracking-wide">Name</p>
                <p className="font-semibold text-slate-900">{profile?.firstName} {profile?.lastName}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 bg-slate-50 rounded-2xl p-4">
              <Mail size={18} className="text-brand-600 shrink-0" />
              <div>
                <p className="text-xs text-slate-400 uppercase tracking-wide">Email</p>
                <p className="font-semibold text-slate-900 truncate">{profile?.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 bg-slate-50 rounded-2xl p-4">
              <Phone size={18} className="text-brand-600 shrink-0" />
              <div>
                <p className="text-xs text-slate-400 uppercase tracking-wide">Phone</p>
                <p className="font-semibold text-slate-900">{profile?.phone || 'N/A'}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 bg-slate-50 rounded-2xl p-4">
              <ShieldCheck size={18} className="text-brand-600 shrink-0" />
              <div>
                <p className="text-xs text-slate-400 uppercase tracking-wide">Role</p>
                <p className="font-semibold text-slate-900">{profile?.role}</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Password */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-soft p-7 mt-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center">
            <Lock size={17} className="text-white" />
          </div>
          <h3 className="font-display text-lg font-extrabold text-slate-900">Change Password</h3>
        </div>
        <form onSubmit={handleChangePassword} className="space-y-4 max-w-md">
          <div>
            <label className={labelClass}>Current Password</label>
            <input type="password" value={passwordForm.currentPassword} onChange={(e) => setPasswordForm((p) => ({ ...p, currentPassword: e.target.value }))} className={inputClass} required />
          </div>
          <div>
            <label className={labelClass}>New Password</label>
            <input type="password" value={passwordForm.newPassword} onChange={(e) => setPasswordForm((p) => ({ ...p, newPassword: e.target.value }))} className={inputClass} required minLength={6} />
          </div>
          <button type="submit" className="btn-accent px-6 py-3 rounded-xl font-display font-semibold text-sm uppercase tracking-wide">
            Change Password
          </button>
        </form>
      </div>

      {/* Addresses */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-soft p-7 mt-6">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-400 flex items-center justify-center">
              <MapPin size={17} className="text-white" />
            </div>
            <h3 className="font-display text-lg font-extrabold text-slate-900">Saved Addresses</h3>
          </div>
          <button
            onClick={() => setShowAddressForm(!showAddressForm)}
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-600 hover:text-brand-700 transition-colors"
          >
            {showAddressForm ? <><X size={15} /> Cancel</> : <><Plus size={15} /> Add Address</>}
          </button>
        </div>

        {showAddressForm && (
          <form onSubmit={handleAddAddress} className="space-y-4 mb-6 p-6 bg-slate-50 rounded-3xl">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Full Name</label>
                <input value={addressForm.fullName} onChange={(e) => setAddressForm((p) => ({ ...p, fullName: e.target.value }))} className={inputClass} required />
              </div>
              <div>
                <label className={labelClass}>Phone</label>
                <input value={addressForm.phone} onChange={(e) => setAddressForm((p) => ({ ...p, phone: e.target.value }))} className={inputClass} required />
              </div>
            </div>
            <div>
              <label className={labelClass}>Address Line 1</label>
              <input value={addressForm.addressLine1} onChange={(e) => setAddressForm((p) => ({ ...p, addressLine1: e.target.value }))} className={inputClass} required />
            </div>
            <div>
              <label className={labelClass}>Address Line 2</label>
              <input value={addressForm.addressLine2} onChange={(e) => setAddressForm((p) => ({ ...p, addressLine2: e.target.value }))} className={inputClass} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>City</label>
                <input value={addressForm.city} onChange={(e) => setAddressForm((p) => ({ ...p, city: e.target.value }))} className={inputClass} required />
              </div>
              <div>
                <label className={labelClass}>State</label>
                <input value={addressForm.state} onChange={(e) => setAddressForm((p) => ({ ...p, state: e.target.value }))} className={inputClass} required />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Zip Code</label>
                <input value={addressForm.zipCode} onChange={(e) => setAddressForm((p) => ({ ...p, zipCode: e.target.value }))} className={inputClass} required />
              </div>
              <div>
                <label className={labelClass}>Country</label>
                <input value={addressForm.country} onChange={(e) => setAddressForm((p) => ({ ...p, country: e.target.value }))} className={inputClass} required />
              </div>
            </div>
            <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
              <input type="checkbox" checked={addressForm.isDefault} onChange={(e) => setAddressForm((p) => ({ ...p, isDefault: e.target.checked }))} className="w-4 h-4 accent-brand-600" />
              Set as default address
            </label>
            <button type="submit" className="btn-accent px-6 py-3 rounded-xl font-display font-semibold text-sm uppercase tracking-wide">
              Save Address
            </button>
          </form>
        )}

        {addresses.length === 0 ? (
          <p className="text-slate-500 text-sm">No addresses saved yet.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {addresses.map((addr) => (
              <div key={addr.id} className="border-2 border-slate-100 rounded-3xl p-5 flex justify-between items-start hover:border-brand-200 transition-colors">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    {addr.isDefault && (
                      <span className="inline-flex items-center gap-1 bg-brand-100 text-brand-700 text-[10px] font-bold uppercase px-2 py-0.5 rounded-full">
                        <Star size={9} className="fill-current" />
                        Default
                      </span>
                    )}
                    <p className="font-display font-bold text-slate-900">{addr.fullName}</p>
                  </div>
                  <p className="text-sm text-slate-600">{addr.addressLine1}{addr.addressLine2 ? `, ${addr.addressLine2}` : ''}</p>
                  <p className="text-sm text-slate-600">{addr.city}, {addr.state} - {addr.zipCode}</p>
                  <p className="text-sm text-slate-600">{addr.phone}</p>
                </div>
                <div className="flex gap-3 shrink-0">
                  {!addr.isDefault && (
                    <button onClick={() => handleSetDefault(addr.id)} className="text-brand-600 text-xs font-semibold hover:underline">
                      Set Default
                    </button>
                  )}
                  <button onClick={() => handleDeleteAddress(addr.id)} className="text-red-500 text-xs font-semibold hover:underline flex items-center gap-0.5">
                    <Trash2 size={12} />
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
