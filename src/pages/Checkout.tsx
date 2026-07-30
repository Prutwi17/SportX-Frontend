import { useState, useEffect, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
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
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Checkout</h1>

      <form onSubmit={handlePlaceOrder}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4">Shipping Address</h2>
              {addresses.length === 0 ? (
                <p className="text-gray-500">
                  No addresses found.{' '}
                  <span
                    className="text-indigo-600 cursor-pointer"
                    onClick={() => navigate('/profile')}
                  >
                    Add one
                  </span>
                </p>
              ) : (
                <div className="space-y-3">
                  {addresses.map((addr) => (
                    <label key={addr.id} className="flex items-start gap-3 p-3 border rounded cursor-pointer hover:bg-gray-50">
                      <input
                        type="radio"
                        name="address"
                        checked={selectedAddressId === addr.id}
                        onChange={() => setSelectedAddressId(addr.id)}
                        className="mt-1"
                      />
                      <div>
                        <p className="font-medium">{addr.fullName}</p>
                        <p className="text-sm text-gray-600">{addr.addressLine1}{addr.addressLine2 ? `, ${addr.addressLine2}` : ''}</p>
                        <p className="text-sm text-gray-600">{addr.city}, {addr.state} - {addr.zipCode}</p>
                        <p className="text-sm text-gray-600">{addr.country}</p>
                        <p className="text-sm text-gray-600">{addr.phone}</p>
                      </div>
                    </label>
                  ))}
                </div>
              )}
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4">Payment Method</h2>
              <div className="space-y-2">
                <label className="flex items-center gap-2">
                  <input type="radio" value="COD" checked={paymentMethod === 'COD'} onChange={(e) => setPaymentMethod(e.target.value)} />
                  Cash on Delivery
                </label>
                <label className="flex items-center gap-2">
                  <input type="radio" value="RAZORPAY" checked={paymentMethod === 'RAZORPAY'} onChange={(e) => setPaymentMethod(e.target.value)} />
                  Razorpay (Online)
                </label>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4">Coupon Code</h2>
              <input
                type="text"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
                placeholder="Enter coupon code"
                className="border rounded px-3 py-2 w-full"
              />
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4">Order Notes</h2>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Any special instructions..."
                className="border rounded px-3 py-2 w-full"
                rows={3}
              />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6 h-fit">
            <h3 className="text-lg font-semibold mb-4">Order Summary</h3>
            {cart?.items.map((item) => (
              <div key={item.id} className="flex justify-between text-sm mb-2">
                <span>{item.productName} x{item.quantity}</span>
                <span>${item.subtotal.toFixed(2)}</span>
              </div>
            ))}
            <hr className="my-4" />
            <div className="flex justify-between mb-2"><span>Subtotal</span><span>${subtotal.toFixed(2)}</span></div>
            <div className="flex justify-between mb-2"><span>Shipping</span><span>${shipping.toFixed(2)}</span></div>
            <hr className="my-4" />
            <div className="flex justify-between font-bold text-lg mb-6"><span>Total</span><span>${total.toFixed(2)}</span></div>
            <button
              type="submit"
              disabled={placing || !selectedAddressId}
              className="w-full bg-indigo-600 text-white py-3 rounded hover:bg-indigo-700 disabled:opacity-50"
            >
              {placing ? 'Placing Order...' : 'Place Order'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
