import { useState, useEffect, type FormEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapPin, CreditCard, Ticket, StickyNote, ArrowRight, Banknote, Wallet, Lock } from 'lucide-react';
import { addressService } from '../services/addressService';
import { orderService } from '../services/orderService';
import { cartService } from '../services/cartService';
import type { Address, Cart } from '../types';
import LoadingSpinner from '../components/common/LoadingSpinner';

export default function Checkout() {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [cart, setCart] = useState<Cart | null>(null);
  const [selectedAddressId, setSelectedAddressId] = useState<number | null>(null);
  const [paymentMethod, setPaymentMethod] = useState('COD');
  const [couponCode, setCouponCode] = useState('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(true);
  const [placing, setPlacing] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    Promise.all([
      addressService.getAll(),
      cartService.getCart(),
    ]).then(([addrRes, cartRes]) => {
      setAddresses(addrRes.data);
      setCart(cartRes.data);
      const def = addrRes.data.find((a) => a.isDefault);
      if (def) setSelectedAddressId(def.id);
      else if (addrRes.data.length > 0) setSelectedAddressId(addrRes.data[0].id);
      setLoading(false);
    });
  }, []);

  const handlePlaceOrder = async (e: FormEvent) => {
    e.preventDefault();
    if (!selectedAddressId) return;
    setPlacing(true);
    try {
      const res = await orderService.placeOrder({
        addressId: selectedAddressId,
        paymentMethod,
        couponCode: couponCode || undefined,
        notes: notes || undefined,
      });
      navigate(`/orders/${res.data.id}`);
    } catch (err: unknown) {
      alert((err as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Failed to place order');
    } finally {
      setPlacing(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  const subtotal = cart?.subtotal || 0;
  const shipping = 49;
  const total = subtotal + shipping;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
      <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="font-display text-3xl md:text-4xl font-extrabold text-slate-900 mb-2">
          Check<span className="text-gradient">out</span>
        </h1>
        <p className="text-slate-500">Almost there — just a few details left</p>
      </motion.div>

      <form onSubmit={handlePlaceOrder}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-10">
          <div className="lg:col-span-2 space-y-6">
            {/* Address */}
            <div className="bg-white rounded-3xl border border-slate-100 shadow-soft p-7">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-500 to-fuchsia-500 flex items-center justify-center">
                  <MapPin size={17} className="text-white" />
                </div>
                <h2 className="font-display text-lg font-extrabold text-slate-900">Shipping Address</h2>
              </div>
              {addresses.length === 0 ? (
                <p className="text-slate-500 text-sm">
                  No addresses found.{' '}
                  <span
                    className="text-brand-600 font-semibold cursor-pointer hover:underline"
                    onClick={() => navigate('/profile')}
                  >
                    Add one
                  </span>
                </p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {addresses.map((addr) => (
                    <label
                      key={addr.id}
                      className={`flex items-start gap-3 p-5 border-2 rounded-2xl cursor-pointer transition-all ${
                        selectedAddressId === addr.id
                          ? 'border-brand-500 bg-brand-50/60 shadow-soft'
                          : 'border-slate-200 hover:border-brand-200 hover:bg-slate-50'
                      }`}
                    >
                      <input
                        type="radio"
                        name="address"
                        checked={selectedAddressId === addr.id}
                        onChange={() => setSelectedAddressId(addr.id)}
                        className="mt-1.5 accent-brand-600"
                      />
                      <div>
                        <p className="font-display font-bold text-sm text-slate-900">
                          {addr.fullName}
                          {addr.isDefault && (
                            <span className="ml-2 text-[10px] font-bold uppercase tracking-wide text-brand-600 bg-brand-100 px-2 py-0.5 rounded-full">Default</span>
                          )}
                        </p>
                        <p className="text-sm text-slate-600 mt-1">{addr.addressLine1}{addr.addressLine2 ? `, ${addr.addressLine2}` : ''}</p>
                        <p className="text-sm text-slate-600">{addr.city}, {addr.state} - {addr.zipCode}</p>
                        <p className="text-sm text-slate-600">{addr.country} · {addr.phone}</p>
                      </div>
                    </label>
                  ))}
                </div>
              )}
            </div>

            {/* Payment */}
            <div className="bg-white rounded-3xl border border-slate-100 shadow-soft p-7">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-accent-500 to-orange-400 flex items-center justify-center">
                  <CreditCard size={17} className="text-white" />
                </div>
                <h2 className="font-display text-lg font-extrabold text-slate-900">Payment Method</h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <label className={`flex items-center gap-3 p-5 border-2 rounded-2xl cursor-pointer transition-all ${paymentMethod === 'COD' ? 'border-brand-500 bg-brand-50/60 shadow-soft' : 'border-slate-200 hover:border-brand-200'}`}>
                  <input type="radio" value="COD" checked={paymentMethod === 'COD'} onChange={(e) => setPaymentMethod(e.target.value)} className="accent-brand-600" />
                  <Banknote size={20} className="text-emerald-600" />
                  <div>
                    <p className="font-display font-bold text-sm text-slate-900">Cash on Delivery</p>
                    <p className="text-xs text-slate-500">Pay when you receive</p>
                  </div>
                </label>
                <label className={`flex items-center gap-3 p-5 border-2 rounded-2xl cursor-pointer transition-all ${paymentMethod === 'RAZORPAY' ? 'border-brand-500 bg-brand-50/60 shadow-soft' : 'border-slate-200 hover:border-brand-200'}`}>
                  <input type="radio" value="RAZORPAY" checked={paymentMethod === 'RAZORPAY'} onChange={(e) => setPaymentMethod(e.target.value)} className="accent-brand-600" />
                  <Wallet size={20} className="text-brand-600" />
                  <div>
                    <p className="font-display font-bold text-sm text-slate-900">Razorpay (Online)</p>
                    <p className="text-xs text-slate-500">Pay with UPI, cards & more</p>
                  </div>
                </label>
              </div>
            </div>

            {/* Coupon */}
            <div className="bg-white rounded-3xl border border-slate-100 shadow-soft p-7">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-400 flex items-center justify-center">
                  <Ticket size={17} className="text-white" />
                </div>
                <h2 className="font-display text-lg font-extrabold text-slate-900">Coupon Code</h2>
              </div>
              <input
                type="text"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
                placeholder="Enter coupon code (e.g. SPORTX20)"
                className="input-premium w-full"
              />
            </div>

            {/* Notes */}
            <div className="bg-white rounded-3xl border border-slate-100 shadow-soft p-7">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-slate-600 to-slate-800 flex items-center justify-center">
                  <StickyNote size={17} className="text-white" />
                </div>
                <h2 className="font-display text-lg font-extrabold text-slate-900">Order Notes</h2>
              </div>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Any special instructions..."
                className="input-premium w-full"
                rows={3}
              />
            </div>
          </div>

          {/* Summary */}
          <div className="bg-white rounded-3xl border border-slate-100 shadow-soft p-7 h-fit sticky top-24">
            <h3 className="font-display text-lg font-extrabold text-slate-900 mb-5">Order Summary</h3>
            {cart?.items.map((item) => (
              <div key={item.id} className="flex justify-between text-sm mb-2.5 gap-3">
                <span className="text-slate-600 truncate">{item.productName} <span className="text-slate-400">x{item.quantity}</span></span>
                <span className="font-semibold text-slate-800 shrink-0">₹{item.subtotal.toLocaleString('en-IN')}</span>
              </div>
            ))}
            <hr className="my-5 border-slate-100" />
            <div className="flex justify-between mb-2 text-sm"><span className="text-slate-500">Subtotal</span><span className="font-semibold text-slate-800">₹{subtotal.toLocaleString('en-IN')}</span></div>
            <div className="flex justify-between mb-2 text-sm"><span className="text-slate-500">Shipping</span><span className="font-semibold text-slate-800">₹{shipping.toLocaleString('en-IN')}</span></div>
            <hr className="my-5 border-slate-100" />
            <div className="flex justify-between font-display font-extrabold text-xl mb-6">
              <span className="text-slate-900">Total</span>
              <span className="text-gradient">₹{total.toLocaleString('en-IN')}</span>
            </div>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={placing || !selectedAddressId}
              className="btn-gradient w-full inline-flex items-center justify-center gap-2 py-3.5 rounded-2xl font-display font-bold disabled:opacity-50"
            >
              {placing ? 'Placing Order...' : 'Place Order'}
              {!placing && <ArrowRight size={17} />}
            </motion.button>
            <Link to="/cart" className="block text-center text-slate-500 hover:text-brand-600 text-sm font-semibold mt-4 transition-colors">
              Back to Cart
            </Link>
            <div className="flex items-center justify-center gap-1.5 mt-5 pt-4 border-t border-slate-100 text-xs text-slate-400">
              <Lock size={12} className="text-emerald-500" />
              100% secure checkout
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
