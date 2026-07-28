'use client';
import { useState } from 'react';
import { FaUpi, FaCreditCard, FaMoneyBillWave, FaUniversity } from 'react-icons/fa';

export default function PaymentForm({ amount, onPayment }) {
  const [method, setMethod] = useState('');
  const [loading, setLoading] = useState(false);

  const paymentMethods = [
    { id: 'upi', label: 'UPI', icon: FaUpi },
    { id: 'debit', label: 'Debit Card', icon: FaCreditCard },
    { id: 'credit', label: 'Credit Card', icon: FaCreditCard },
    { id: 'netbanking', label: 'Net Banking', icon: FaUniversity },
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!method) {
      alert('Please select a payment method');
      return;
    }
    setLoading(true);
    onPayment(method, () => setLoading(false));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-white/5 p-4 rounded-lg">
        <h3 className="font-semibold mb-2">Payment Summary</h3>
        <div className="flex justify-between text-sm">
          <span className="text-gray-400">Total Amount</span>
          <span className="text-primary font-bold text-lg">${amount}</span>
        </div>
      </div>

      <div className="space-y-3">
        <h3 className="text-lg font-medium">Select Payment Method</h3>
        {paymentMethods.map((pm) => (
          <label 
            key={pm.id}
            className={`flex items-center space-x-3 p-4 rounded-lg border-2 cursor-pointer transition ${
              method === pm.id ? 'border-primary bg-primary/10' : 'border-white/10 hover:border-white/20'
            }`}
          >
            <input
              type="radio"
              name="method"
              value={pm.id}
              checked={method === pm.id}
              onChange={(e) => setMethod(e.target.value)}
              className="accent-primary w-4 h-4"
            />
            <pm.icon className="text-primary text-xl" />
            <span className="flex-1">{pm.label}</span>
          </label>
        ))}
      </div>

      <button
        type="submit"
        disabled={loading}
        className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? 'Processing...' : `Pay $${amount}`}
      </button>

      <p className="text-xs text-gray-400 text-center">
        🔒 Your payment is secure and encrypted
      </p>
    </form>
  );
}