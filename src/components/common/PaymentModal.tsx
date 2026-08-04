import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, CreditCard, QrCode, Building2, Wallet, ArrowRight, CheckCircle2, XCircle, Loader2, Sparkles, Clock, ChevronRight } from 'lucide-react';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  amount: number;
  orderNumber: string;
  onSuccess: (paymentId?: string, signature?: string) => Promise<void>;
  onFailure: (reason: string) => void;
}

type PaymentMethodTab = 'upi' | 'card' | 'netbanking' | 'wallet' | 'emi' | 'paylater';
type ModalStep = 'OPTIONS' | 'BANK_REDIRECT' | 'CONFIRMING' | 'SUCCESS' | 'FAILURE';

export default function PaymentModal({
  isOpen,
  onClose,
  amount,
  orderNumber,
  onSuccess,
  onFailure,
}: PaymentModalProps) {
  const [step, setStep] = useState<ModalStep>('OPTIONS');
  const [activeTab, setActiveTab] = useState<PaymentMethodTab>('upi');
  const [upiId, setUpiId] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [cardName, setCardName] = useState('');
  const [saveCard, setSaveCard] = useState(true);
  const [selectedBank, setSelectedBank] = useState('HDFC');
  const [selectedWallet, setSelectedWallet] = useState('Paytm');
  const [processing, setProcessing] = useState(false);

  if (!isOpen) return null;

  const handleStartPayment = async () => {
    if (activeTab === 'card' && cardNumber) {
      if (cardNumber.replace(/\s/g, '').length < 12) {
        alert('Please enter a valid card number');
        return;
      }
      if (!cardExpiry) {
        alert('Please enter card expiry MM/YY');
        return;
      }
      if (cardCvv.length < 3) {
        alert('Please enter a valid 3-digit CVV');
        return;
      }
    }

    setStep('CONFIRMING');
    setProcessing(true);

    try {
      const mockPaymentId = `pay_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
      await new Promise((resolve) => setTimeout(resolve, 1800));
      await onSuccess(mockPaymentId, undefined);
      setStep('SUCCESS');
    } catch {
      setStep('FAILURE');
      setTimeout(() => {
        onFailure('Payment processing failed');
      }, 1000);
    } finally {
      setProcessing(false);
    }
  };

  const tabs: { id: PaymentMethodTab; label: string; icon: React.ElementType; tag?: string }[] = [
    { id: 'upi', label: 'UPI / QR', icon: QrCode, tag: 'Fastest' },
    { id: 'card', label: 'Cards', icon: CreditCard, tag: 'Credit/Debit' },
    { id: 'netbanking', label: 'Net Banking', icon: Building2 },
    { id: 'wallet', label: 'Wallets', icon: Wallet },
    { id: 'emi', label: 'EMI', icon: Clock, tag: 'No Cost' },
    { id: 'paylater', label: 'Pay Later', icon: Sparkles, tag: 'LazyPay/Simpl' },
  ];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/75 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.93, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.93, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="w-full max-w-2xl bg-white dark:bg-slate-900 rounded-[32px] shadow-2xl border border-slate-100 dark:border-slate-800 overflow-hidden relative"
        >
          {/* Top Branding Header Bar */}
          <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white p-6 relative">
            <button
              onClick={onClose}
              disabled={processing || step === 'CONFIRMING'}
              className="absolute top-5 right-5 text-slate-400 hover:text-white text-sm font-bold w-8 h-8 rounded-full bg-white/10 flex items-center justify-center transition-colors disabled:opacity-30"
            >
              ✕
            </button>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-brand-500 to-fuchsia-500 flex items-center justify-center font-display font-extrabold text-white text-xl shadow-lg shadow-brand-500/30">
                  SX
                </div>
                <div>
                  <span className="font-display font-extrabold text-lg tracking-wide text-white block">SportX Checkout</span>
                  <span className="font-mono text-xs text-slate-400">Order #{orderNumber}</span>
                </div>
              </div>
              <div className="text-right">
                <span className="text-[11px] text-slate-400 block uppercase tracking-wider">Amount Payable</span>
                <span className="font-display font-extrabold text-2xl text-gradient">₹{amount.toLocaleString('en-IN')}</span>
              </div>
            </div>
          </div>

          {/* STEP 1: RAZORPAY CHECKOUT INTERFACE */}
          {step === 'OPTIONS' && (
            <div className="grid grid-cols-1 md:grid-cols-3 min-h-[400px]">
              {/* Sidebar Navigation */}
              <div className="bg-slate-50 dark:bg-slate-800/50 p-4 border-r border-slate-100 dark:border-slate-800 space-y-1.5">
                <p className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 px-3 py-2">Payment Options</p>
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  const isActive = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center justify-between p-3 rounded-2xl text-left text-xs font-semibold transition-all ${
                        isActive
                          ? 'bg-white dark:bg-slate-800 text-brand-600 dark:text-brand-400 shadow-soft font-bold'
                          : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <Icon size={16} className={isActive ? 'text-brand-500' : 'text-slate-400'} />
                        <span>{tab.label}</span>
                      </div>
                      {tab.tag && (
                        <span className="text-[9px] font-extrabold uppercase bg-brand-100 dark:bg-brand-950/60 text-brand-600 dark:text-brand-400 px-2 py-0.5 rounded-full">
                          {tab.tag}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Main Content Area */}
              <div className="md:col-span-2 p-6 flex flex-col justify-between">
                <div>
                  {/* TAB 1: UPI */}
                  {activeTab === 'upi' && (
                    <div className="space-y-5">
                      <div className="flex items-center justify-between">
                        <h4 className="font-display font-bold text-slate-900 dark:text-white text-base">Pay with UPI</h4>
                        <span className="text-xs text-slate-400">Zero Convenience Fee</span>
                      </div>

                      <div className="flex items-center gap-4 bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl border border-slate-100 dark:border-slate-800">
                        <div className="w-16 h-16 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl flex items-center justify-center p-1.5 shrink-0">
                          <QrCode size={38} className="text-slate-800 dark:text-slate-200" />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-slate-800 dark:text-slate-200">Scan QR Code</p>
                          <p className="text-[11px] text-slate-400 mt-0.5">Use GPay, PhonePe, Paytm, or any UPI app to scan</p>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        {['GPay', 'PhonePe', 'Paytm', 'BHIM'].map((app) => (
                          <div key={app} className="flex-1 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-center text-xs font-bold text-slate-700 dark:text-slate-300">
                            {app}
                          </div>
                        ))}
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wide">Enter VPA / UPI ID</label>
                        <input
                          type="text"
                          value={upiId}
                          onChange={(e) => setUpiId(e.target.value)}
                          placeholder="e.g. mobileNumber@upi"
                          className="input-premium w-full text-xs"
                        />
                      </div>
                    </div>
                  )}

                  {/* TAB 2: CARDS */}
                  {activeTab === 'card' && (
                    <div className="space-y-4">
                      <h4 className="font-display font-bold text-slate-900 dark:text-white text-base">Credit or Debit Card</h4>

                      <div className="space-y-1.5">
                        <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Card Number</label>
                        <input
                          type="text"
                          value={cardNumber}
                          onChange={(e) => setCardNumber(e.target.value)}
                          placeholder="4111 2222 3333 4444"
                          className="input-premium w-full text-xs tracking-widest font-mono"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1.5">
                          <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Expiry (MM/YY)</label>
                          <input
                            type="text"
                            value={cardExpiry}
                            onChange={(e) => setCardExpiry(e.target.value)}
                            placeholder="MM / YY"
                            className="input-premium w-full text-xs text-center"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">CVV</label>
                          <input
                            type="password"
                            maxLength={4}
                            value={cardCvv}
                            onChange={(e) => setCardCvv(e.target.value)}
                            placeholder="123"
                            className="input-premium w-full text-xs text-center font-mono"
                          />
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Cardholder Name</label>
                        <input
                          type="text"
                          value={cardName}
                          onChange={(e) => setCardName(e.target.value)}
                          placeholder="Name on card"
                          className="input-premium w-full text-xs"
                        />
                      </div>

                      <label className="flex items-center gap-2 cursor-pointer pt-1">
                        <input
                          type="checkbox"
                          checked={saveCard}
                          onChange={(e) => setSaveCard(e.target.checked)}
                          className="accent-brand-600 rounded"
                        />
                        <span className="text-xs text-slate-600 dark:text-slate-400">Save card securely for future payments</span>
                      </label>
                    </div>
                  )}

                  {/* TAB 3: NET BANKING */}
                  {activeTab === 'netbanking' && (
                    <div className="space-y-4">
                      <h4 className="font-display font-bold text-slate-900 dark:text-white text-base">Popular Banks</h4>
                      <div className="grid grid-cols-3 gap-2">
                        {['HDFC', 'ICICI', 'SBI', 'Axis', 'Kotak', 'PNB'].map((bank) => (
                          <button
                            key={bank}
                            type="button"
                            onClick={() => setSelectedBank(bank)}
                            className={`p-3 rounded-xl border text-xs font-bold transition-all ${
                              selectedBank === bank
                                ? 'border-brand-500 bg-brand-50/50 text-brand-600 shadow-soft'
                                : 'border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                            }`}
                          >
                            {bank} Bank
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* TAB 4: WALLETS */}
                  {activeTab === 'wallet' && (
                    <div className="space-y-4">
                      <h4 className="font-display font-bold text-slate-900 dark:text-white text-base">Digital Wallets</h4>
                      <div className="space-y-2">
                        {['Paytm Wallet', 'PhonePe Wallet', 'Mobikwik', 'Freecharge'].map((wallet) => (
                          <label
                            key={wallet}
                            className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all ${
                              selectedWallet === wallet
                                ? 'border-brand-500 bg-brand-50/50 text-brand-600 font-bold'
                                : 'border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                            }`}
                          >
                            <span className="text-xs">{wallet}</span>
                            <input
                              type="radio"
                              name="wallet"
                              checked={selectedWallet === wallet}
                              onChange={() => setSelectedWallet(wallet)}
                              className="accent-brand-600"
                            />
                          </label>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* TAB 5: EMI */}
                  {activeTab === 'emi' && (
                    <div className="space-y-4">
                      <h4 className="font-display font-bold text-slate-900 dark:text-white text-base">EMI Payment Options</h4>
                      <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-800 space-y-2">
                        <div className="flex items-center justify-between text-xs font-bold text-slate-800 dark:text-slate-200">
                          <span>No Cost EMI available</span>
                          <span className="text-emerald-500">From ₹{Math.round(amount / 3)}/mo</span>
                        </div>
                        <p className="text-[11px] text-slate-400">Available on HDFC, ICICI, and SBI Credit Cards</p>
                      </div>
                    </div>
                  )}

                  {/* TAB 6: PAY LATER */}
                  {activeTab === 'paylater' && (
                    <div className="space-y-4">
                      <h4 className="font-display font-bold text-slate-900 dark:text-white text-base">Pay Later</h4>
                      <div className="space-y-2 text-xs">
                        <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center justify-between font-semibold">
                          <span>LazyPay</span>
                          <ChevronRight size={16} className="text-slate-400" />
                        </div>
                        <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center justify-between font-semibold">
                          <span>Simpl</span>
                          <ChevronRight size={16} className="text-slate-400" />
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Bottom Action Button */}
                <div className="pt-6 border-t border-slate-100 dark:border-slate-800 mt-6">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleStartPayment}
                    className="btn-gradient w-full py-3.5 rounded-2xl font-display font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-brand-500/25"
                  >
                    Pay ₹{amount.toLocaleString('en-IN')}
                    <ArrowRight size={16} />
                  </motion.button>

                  <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-400 mt-3">
                    <ShieldCheck size={13} className="text-emerald-500" />
                    Secured by Razorpay · 256-Bit Encryption
                  </div>
                </div>
              </div>
            </div>
          )}



          {/* STEP 3: PROCESSING PAYMENT (GOLD COIN SPINNER ANIMATION) */}
          {step === 'CONFIRMING' && (
            <div className="p-10 text-center space-y-6">
              <div className="relative w-24 h-24 mx-auto flex items-center justify-center">
                <motion.div
                  animate={{ rotateY: 360 }}
                  transition={{ repeat: Infinity, duration: 1.2, ease: 'linear' }}
                  className="w-20 h-20 rounded-full bg-gradient-to-tr from-amber-400 via-yellow-300 to-amber-500 shadow-xl shadow-amber-500/30 border-4 border-yellow-200 flex items-center justify-center text-amber-900 font-extrabold text-2xl"
                >
                  ₹
                </motion.div>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 2, ease: 'linear' }}
                  className="absolute inset-0 border-4 border-dashed border-brand-500 rounded-full"
                />
              </div>

              <div>
                <h4 className="font-display font-extrabold text-2xl text-slate-900 dark:text-white">Processing Payment...</h4>
                <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Please do not refresh or close this page.</p>
              </div>

              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-50 dark:bg-brand-950/40 text-brand-600 dark:text-brand-400 text-xs font-bold">
                <Loader2 size={14} className="animate-spin" /> Verifying transaction details with bank...
              </div>

              <div className="flex items-center justify-center gap-1.5 text-xs text-slate-400 pt-4 border-t border-slate-100 dark:border-slate-800">
                <ShieldCheck size={14} className="text-emerald-500" />
                Secured by Razorpay
              </div>
            </div>
          )}

          {/* STEP 4: SUCCESS */}
          {step === 'SUCCESS' && (
            <div className="p-10 text-center space-y-4">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', damping: 15 }}
                className="w-20 h-20 mx-auto rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-xl shadow-emerald-500/30"
              >
                <CheckCircle2 size={48} />
              </motion.div>
              <h4 className="font-display font-extrabold text-2xl text-slate-900 dark:text-white">Payment Successful!</h4>
              <p className="text-slate-500 text-sm">Redirecting to order confirmation...</p>
            </div>
          )}

          {/* STEP 5: FAILURE */}
          {step === 'FAILURE' && (
            <div className="p-10 text-center space-y-4">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', damping: 15 }}
                className="w-20 h-20 mx-auto rounded-full bg-rose-500 text-white flex items-center justify-center shadow-xl shadow-rose-500/30"
              >
                <XCircle size={48} />
              </motion.div>
              <h4 className="font-display font-extrabold text-2xl text-slate-900 dark:text-white">Payment Failed</h4>
              <p className="text-slate-500 text-sm">Redirecting to payment failure page...</p>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
