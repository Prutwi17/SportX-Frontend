import { useState, useEffect, type FormEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapPin, CreditCard, Ticket, StickyNote, ArrowRight, Wallet, Lock, ShieldCheck } from 'lucide-react';
import { addressService } from '../services/addressService';
import { paymentService } from '../services/paymentService';
import { cartService, notifyCartUpdated } from '../services/cartService';
import type { Address, Cart } from '../types';
import LoadingSpinner from '../components/common/LoadingSpinner';
import PaymentModal from '../components/common/PaymentModal';

declare global {
  interface Window {
    Razorpay: new (options: Record<string, unknown>) => {
      open: () => void;
      on: (event: string, callback: (response: unknown) => void) => void;
    };
  }
}

export default function Checkout() {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [cart, setCart] = useState<Cart | null>(null);
  const [selectedAddressId, setSelectedAddressId] = useState<number | null>(null);
  const [couponCode, setCouponCode] = useState('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(true);
  const [placing, setPlacing] = useState(false);

  // Fallback Payment Modal State
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [modalPaymentData, setModalPaymentData] = useState<{
    orderId: number;
    orderNumber: string;
    amount: number;
    razorpayOrderId: string;
  } | null>(null);

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
    }).catch(() => setLoading(false));
  }, []);

  const handlePlaceOrder = async (e: FormEvent) => {
    e.preventDefault();
    if (!selectedAddressId) return;
    setPlacing(true);

    try {
      // 1. Create Razorpay Order on Backend
      const createRes = await paymentService.createRazorpayOrder({
        addressId: selectedAddressId,
        paymentMethod: 'RAZORPAY',
        couponCode: couponCode || undefined,
        notes: notes || undefined,
      });

      const pData = createRes.data;
      const selectedAddress = addresses.find((a) => a.id === selectedAddressId);

      const completePayment = async (
        razorpayPaymentId?: string,
        razorpayOrderId?: string,
        razorpaySignature?: string,
      ) => {
        try {
          await paymentService.verifyPayment({
            orderId: pData.orderId,
            razorpayOrderId: razorpayOrderId || pData.razorpayOrderId,
            razorpayPaymentId: razorpayPaymentId || `pay_${Date.now()}`,
            razorpaySignature,
          });
          try {
            await cartService.clearCart();
          } catch {
            /* backend may have already cleared the cart */
          }
          setCart(null);
          notifyCartUpdated();
          navigate(`/payment/success/${pData.orderId}`, { replace: true });
        } catch (err: unknown) {
          const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Payment verification failed';
          navigate(`/payment/failure?reason=${encodeURIComponent(msg)}`);
        } finally {
          setPlacing(false);
          setShowPaymentModal(false);
        }
      };

      // 2. Open Official Razorpay Checkout Popup SDK if order was created on Razorpay server
      const isSimulatedOrder = !pData.razorpayOrderId || !pData.razorpayOrderId.startsWith('order_');

      if (typeof window.Razorpay !== 'undefined' && pData.keyId && pData.razorpayOrderId && !isSimulatedOrder) {
        const options = {
          key: pData.keyId,
          amount: Math.round(pData.amount * 100),
          currency: pData.currency || 'INR',
          name: 'SportX',
          description: 'Sports Equipment Purchase',
          order_id: pData.razorpayOrderId,
          prefill: {
            name: selectedAddress ? selectedAddress.fullName : '',
            email: '',
            contact: selectedAddress ? selectedAddress.phone : '',
          },
          theme: {
            color: '#3399cc',
          },
          handler: function (response: { razorpay_payment_id?: string; razorpay_order_id?: string; razorpay_signature?: string }) {
            void completePayment(response.razorpay_payment_id, response.razorpay_order_id, response.razorpay_signature);
          },
          modal: {
            ondismiss: function () {
              setPlacing(false);
            },
          },
        };

        try {
          const rzp = new window.Razorpay(options);
          rzp.on('payment.failed', function () {
            // On SDK payment fail, fallback to interactive test modal
            setModalPaymentData({
              orderId: pData.orderId,
              orderNumber: pData.orderNumber || '',
              amount: pData.amount,
              razorpayOrderId: pData.razorpayOrderId || '',
            });
            setShowPaymentModal(true);
            setPlacing(false);
          });
          rzp.open();
          return;
        } catch {
          /* fallback to modal */
        }
      }

      // 3. Fallback: Interactive Payment Modal for local testing when credentials require refresh
      setModalPaymentData({
        orderId: pData.orderId,
        orderNumber: pData.orderNumber || '',
        amount: pData.amount,
        razorpayOrderId: pData.razorpayOrderId || '',
      });
      setShowPaymentModal(true);
      setPlacing(false);
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Failed to initialize payment';
      alert(msg);
      setPlacing(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  const subtotal = cart?.subtotal || 0;
  const shipping = 49;
  const tax = Math.round(subtotal * 0.18);
  const total = subtotal + shipping + tax;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
      <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="font-display text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white mb-2">
          Check<span className="text-gradient">out</span>
        </h1>
        <p className="text-slate-600 dark:text-slate-300 font-medium">Secure Online Payment via Razorpay</p>
      </motion.div>

      <form onSubmit={handlePlaceOrder}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-10">
          <div className="lg:col-span-2 space-y-6">
            {/* Address Card */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-soft p-7">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center shadow-md">
                  <MapPin size={17} className="text-white" />
                </div>
                <h2 className="font-display text-lg font-extrabold text-slate-900 dark:text-white">Shipping Address</h2>
              </div>
              {addresses.length === 0 ? (
                <p className="text-slate-600 dark:text-slate-300 text-sm">
                  No addresses found.{' '}
                  <span
                    className="text-brand-600 dark:text-brand-400 font-bold cursor-pointer hover:underline"
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
                          ? 'border-brand-500 bg-brand-50/60 dark:bg-brand-950/40 shadow-soft'
                          : 'border-slate-200 dark:border-slate-800 hover:border-brand-200 dark:hover:border-brand-800 hover:bg-slate-50 dark:hover:bg-slate-800/50'
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
                        <p className="font-display font-bold text-sm text-slate-900 dark:text-white">
                          {addr.fullName}
                          {addr.isDefault && (
                            <span className="ml-2 text-[10px] font-extrabold uppercase tracking-wide text-brand-600 dark:text-brand-400 bg-brand-100 dark:bg-brand-950/60 border border-brand-200 dark:border-brand-800 px-2 py-0.5 rounded-full">Default</span>
                          )}
                        </p>
                        <p className="text-sm text-slate-700 dark:text-slate-200 font-medium mt-1">{addr.addressLine1}{addr.addressLine2 ? `, ${addr.addressLine2}` : ''}</p>
                        <p className="text-sm text-slate-700 dark:text-slate-200 font-medium">{addr.city}, {addr.state} - {addr.zipCode}</p>
                        <p className="text-sm text-slate-700 dark:text-slate-200 font-medium">{addr.country} · {addr.phone}</p>
                      </div>
                    </label>
                  ))}
                </div>
              )}
            </div>

            {/* Payment Divider Badge */}
            <div className="relative flex items-center justify-center my-3">
              <div className="w-full border-t border-slate-300 dark:border-slate-700"></div>
              <span className="absolute bg-slate-100 dark:bg-slate-800 px-4 py-1 text-xs font-extrabold text-slate-900 dark:text-white uppercase tracking-widest border border-slate-300 dark:border-slate-700 rounded-full shadow-sm">
                PAYMENT
              </span>
            </div>

            {/* Payment Method - Razorpay ONLY */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-soft p-7">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center shadow-md">
                  <CreditCard size={17} className="text-white" />
                </div>
                <h2 className="font-display text-lg font-extrabold text-slate-900 dark:text-white">Payment Gateway</h2>
              </div>
              <div className="p-5 border-2 border-brand-500 bg-brand-50/80 dark:bg-slate-800/90 rounded-2xl flex items-start gap-4 shadow-sm">
                <Wallet size={24} className="text-brand-600 dark:text-brand-400 shrink-0 mt-1" />
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <p className="font-display font-bold text-base text-slate-900 dark:text-white">Razorpay (Online Payment)</p>
                    <span className="text-[10px] font-extrabold uppercase tracking-widest text-emerald-800 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-950/80 border border-emerald-300 dark:border-emerald-800 px-2.5 py-0.5 rounded-full">Test Mode</span>
                  </div>
                  <p className="text-xs text-slate-700 dark:text-slate-200 font-medium">Pay securely with UPI, Credit/Debit Cards, Net Banking, or Wallets using official Razorpay Checkout.</p>
                  <div className="flex items-center gap-2 pt-2 text-[11px] font-bold text-slate-600 dark:text-slate-300">
                    <ShieldCheck size={14} className="text-emerald-500 shrink-0" />
                    Official Razorpay 256-Bit Encrypted Gateway
                  </div>
                </div>
              </div>
            </div>

            {/* Coupon */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-soft p-7">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-400 flex items-center justify-center shadow-md">
                  <Ticket size={17} className="text-white" />
                </div>
                <h2 className="font-display text-lg font-extrabold text-slate-900 dark:text-white">Coupon Code</h2>
              </div>
              <input
                type="text"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
                placeholder="Enter coupon code (e.g. SPORTX20)"
                className="input-premium w-full bg-white dark:bg-slate-800 text-slate-900 dark:text-white border-slate-200 dark:border-slate-700 placeholder-slate-400 dark:placeholder-slate-500 font-medium"
              />
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 font-medium">
                Coupon is validated and its discount is applied when you place the order.
              </p>
            </div>

            {/* Notes */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-soft p-7">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-slate-600 to-slate-800 flex items-center justify-center shadow-md">
                  <StickyNote size={17} className="text-white" />
                </div>
                <h2 className="font-display text-lg font-extrabold text-slate-900 dark:text-white">Order Notes</h2>
              </div>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Any special instructions..."
                className="input-premium w-full bg-white dark:bg-slate-800 text-slate-900 dark:text-white border-slate-200 dark:border-slate-700 placeholder-slate-400 dark:placeholder-slate-500 font-medium"
                rows={3}
              />
            </div>
          </div>

          {/* Summary */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-soft p-7 h-fit sticky top-24">
            <h3 className="font-display text-lg font-extrabold text-slate-900 dark:text-white mb-5">Order Summary</h3>
            {cart?.items.map((item) => (
              <div key={item.id} className="flex justify-between text-sm mb-2.5 gap-3">
                <span className="text-slate-700 dark:text-slate-200 font-medium truncate">{item.productName} <span className="text-slate-400 dark:text-slate-400 font-semibold">x{item.quantity}</span></span>
                <span className="font-bold text-slate-800 dark:text-slate-200 shrink-0">₹{item.subtotal.toLocaleString('en-IN')}</span>
              </div>
            ))}
            <hr className="my-5 border-slate-200 dark:border-slate-800" />
            <div className="flex justify-between mb-2 text-sm"><span className="text-slate-600 dark:text-slate-300 font-medium">Subtotal</span><span className="font-bold text-slate-800 dark:text-slate-200">₹{subtotal.toLocaleString('en-IN')}</span></div>
            <div className="flex justify-between mb-2 text-sm"><span className="text-slate-600 dark:text-slate-300 font-medium">Shipping</span><span className="font-bold text-slate-800 dark:text-slate-200">₹{shipping.toLocaleString('en-IN')}</span></div>
            <div className="flex justify-between mb-2 text-sm"><span className="text-slate-600 dark:text-slate-300 font-medium">Tax (18%)</span><span className="font-bold text-slate-800 dark:text-slate-200">₹{tax.toLocaleString('en-IN')}</span></div>
            {couponCode.trim() && (
              <div className="flex justify-between mb-2 text-sm">
                <span className="text-slate-600 dark:text-slate-300 font-medium">Coupon</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400">{couponCode.trim().toUpperCase()}</span>
              </div>
            )}
            <hr className="my-5 border-slate-200 dark:border-slate-800" />
            <div className="flex justify-between font-display font-extrabold text-xl mb-6">
              <span className="text-slate-900 dark:text-white">Total</span>
              <span className="text-gradient">₹{total.toLocaleString('en-IN')}</span>
            </div>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={placing || !selectedAddressId}
              className="btn-accent w-full inline-flex items-center justify-center gap-2 py-3.5 rounded-xl font-display font-bold text-sm uppercase tracking-wide disabled:opacity-50"
            >
              {placing ? 'Initializing Razorpay...' : 'Pay with Razorpay'}
              {!placing && <ArrowRight size={17} />}
            </motion.button>
            <Link to="/cart" className="block text-center text-slate-600 dark:text-slate-300 hover:text-brand-600 dark:hover:text-brand-400 text-sm font-bold mt-4 transition-colors">
              Back to Cart
            </Link>
            <div className="flex items-center justify-center gap-1.5 mt-5 pt-4 border-t border-slate-200 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400 font-semibold">
              <Lock size={12} className="text-emerald-500" />
              100% Secure Razorpay Checkout
            </div>
          </div>
        </div>
      </form>

      {/* Fallback Interactive Test Payment Modal */}
      {modalPaymentData && (
        <PaymentModal
          isOpen={showPaymentModal}
          onClose={() => setShowPaymentModal(false)}
          amount={modalPaymentData.amount}
          orderNumber={modalPaymentData.orderNumber}
          onSuccess={async (paymentId, signature) => {
            try {
              await paymentService.verifyPayment({
                orderId: modalPaymentData.orderId,
                razorpayOrderId: modalPaymentData.razorpayOrderId,
                razorpayPaymentId: paymentId || `pay_${Date.now()}`,
                razorpaySignature: signature,
              });
              try {
                await cartService.clearCart();
              } catch {
                /* cart may already be deleted */
              }
              setCart(null);
              notifyCartUpdated();
              navigate(`/payment/success/${modalPaymentData.orderId}`, { replace: true });
            } catch (err: unknown) {
              const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Payment verification failed';
              navigate(`/payment/failure?reason=${encodeURIComponent(msg)}`);
            } finally {
              setShowPaymentModal(false);
            }
          }}
          onFailure={(reason) => {
            setShowPaymentModal(false);
            navigate(`/payment/failure?reason=${encodeURIComponent(reason)}`);
          }}
        />
      )}
    </div>
  );
}
