import { useState, useEffect, FormEvent } from 'react';
import { userService } from '../services/userService';
import { addressService } from '../services/addressService';
import { authService } from '../services/authService';
import { useAuth } from '../context/AuthContext';
import type { User, Address } from '../types';
import LoadingSpinner from '../components/common/LoadingSpinner';

export default function Profile() {
  const { user: authUser, logout } = useAuth();
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
      });
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
    await addressService.delete(id);
    setAddresses((prev) => prev.filter((a) => a.id !== id));
  };

  const handleSetDefault = async (id: number) => {
    await addressService.setDefault(id);
    const updated = await addressService.getAll();
    setAddresses(updated.data);
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">My Profile</h1>
      {msg && <div className="bg-green-100 text-green-700 p-3 rounded mb-4">{msg}</div>}

      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Personal Information</h2>
          <button onClick={() => setEditing(!editing)} className="text-indigo-600 hover:underline text-sm">
            {editing ? 'Cancel' : 'Edit'}
          </button>
        </div>
        {editing ? (
          <form onSubmit={handleUpdateProfile} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div><label className="block text-sm font-medium">First Name</label><input value={form.firstName} onChange={(e) => setForm((p) => ({ ...p, firstName: e.target.value }))} className="w-full border rounded px-3 py-2 mt-1" required /></div>
              <div><label className="block text-sm font-medium">Last Name</label><input value={form.lastName} onChange={(e) => setForm((p) => ({ ...p, lastName: e.target.value }))} className="w-full border rounded px-3 py-2 mt-1" required /></div>
            </div>
            <div><label className="block text-sm font-medium">Phone</label><input value={form.phone} onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))} className="w-full border rounded px-3 py-2 mt-1" /></div>
            <button type="submit" className="bg-indigo-600 text-white px-6 py-2 rounded hover:bg-indigo-700">Save</button>
          </form>
        ) : (
          <div className="space-y-2">
            <p><strong>Name:</strong> {profile?.firstName} {profile?.lastName}</p>
            <p><strong>Email:</strong> {profile?.email}</p>
            <p><strong>Phone:</strong> {profile?.phone || 'N/A'}</p>
            <p><strong>Role:</strong> {profile?.role}</p>
          </div>
        )}
      </div>

      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Change Password</h2>
        <form onSubmit={handleChangePassword} className="space-y-4 max-w-md">
          <div><label className="block text-sm font-medium">Current Password</label><input type="password" value={passwordForm.currentPassword} onChange={(e) => setPasswordForm((p) => ({ ...p, currentPassword: e.target.value }))} className="w-full border rounded px-3 py-2 mt-1" required /></div>
          <div><label className="block text-sm font-medium">New Password</label><input type="password" value={passwordForm.newPassword} onChange={(e) => setPasswordForm((p) => ({ ...p, newPassword: e.target.value }))} className="w-full border rounded px-3 py-2 mt-1" required minLength={6} /></div>
          <button type="submit" className="bg-indigo-600 text-white px-6 py-2 rounded hover:bg-indigo-700">Change Password</button>
        </form>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Addresses</h2>
          <button onClick={() => setShowAddressForm(!showAddressForm)} className="text-indigo-600 hover:underline text-sm">
            {showAddressForm ? 'Cancel' : '+ Add Address'}
          </button>
        </div>

        {showAddressForm && (
          <form onSubmit={handleAddAddress} className="space-y-4 mb-6 p-4 bg-gray-50 rounded">
            <div className="grid grid-cols-2 gap-4">
              <div><label className="block text-sm font-medium">Full Name</label><input value={addressForm.fullName} onChange={(e) => setAddressForm((p) => ({ ...p, fullName: e.target.value }))} className="w-full border rounded px-3 py-2 mt-1" required /></div>
              <div><label className="block text-sm font-medium">Phone</label><input value={addressForm.phone} onChange={(e) => setAddressForm((p) => ({ ...p, phone: e.target.value }))} className="w-full border rounded px-3 py-2 mt-1" required /></div>
            </div>
            <div><label className="block text-sm font-medium">Address Line 1</label><input value={addressForm.addressLine1} onChange={(e) => setAddressForm((p) => ({ ...p, addressLine1: e.target.value }))} className="w-full border rounded px-3 py-2 mt-1" required /></div>
            <div><label className="block text-sm font-medium">Address Line 2</label><input value={addressForm.addressLine2} onChange={(e) => setAddressForm((p) => ({ ...p, addressLine2: e.target.value }))} className="w-full border rounded px-3 py-2 mt-1" /></div>
            <div className="grid grid-cols-2 gap-4">
              <div><label className="block text-sm font-medium">City</label><input value={addressForm.city} onChange={(e) => setAddressForm((p) => ({ ...p, city: e.target.value }))} className="w-full border rounded px-3 py-2 mt-1" required /></div>
              <div><label className="block text-sm font-medium">State</label><input value={addressForm.state} onChange={(e) => setAddressForm((p) => ({ ...p, state: e.target.value }))} className="w-full border rounded px-3 py-2 mt-1" required /></div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div><label className="block text-sm font-medium">Zip Code</label><input value={addressForm.zipCode} onChange={(e) => setAddressForm((p) => ({ ...p, zipCode: e.target.value }))} className="w-full border rounded px-3 py-2 mt-1" required /></div>
              <div><label className="block text-sm font-medium">Country</label><input value={addressForm.country} onChange={(e) => setAddressForm((p) => ({ ...p, country: e.target.value }))} className="w-full border rounded px-3 py-2 mt-1" required /></div>
            </div>
            <label className="flex items-center gap-2">
              <input type="checkbox" checked={addressForm.isDefault} onChange={(e) => setAddressForm((p) => ({ ...p, isDefault: e.target.checked }))} />
              Set as default address
            </label>
            <button type="submit" className="bg-indigo-600 text-white px-6 py-2 rounded hover:bg-indigo-700">Save Address</button>
          </form>
        )}

        {addresses.length === 0 ? (
          <p className="text-gray-500">No addresses saved.</p>
        ) : (
          <div className="space-y-3">
            {addresses.map((addr) => (
              <div key={addr.id} className="border rounded-lg p-4 flex justify-between items-start">
                <div>
                  {addr.isDefault && <span className="bg-indigo-100 text-indigo-800 text-xs px-2 py-0.5 rounded">Default</span>}
                  <p className="font-medium mt-1">{addr.fullName}</p>
                  <p className="text-sm text-gray-600">{addr.addressLine1}{addr.addressLine2 ? `, ${addr.addressLine2}` : ''}</p>
                  <p className="text-sm text-gray-600">{addr.city}, {addr.state} - {addr.zipCode}</p>
                  <p className="text-sm text-gray-600">{addr.phone}</p>
                </div>
                <div className="flex gap-2">
                  {!addr.isDefault && (
                    <button onClick={() => handleSetDefault(addr.id)} className="text-indigo-600 text-sm hover:underline">Set Default</button>
                  )}
                  <button onClick={() => handleDeleteAddress(addr.id)} className="text-red-500 text-sm hover:underline">Delete</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
