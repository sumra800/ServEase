import React, { useState } from 'react';
import { FaMobileAlt, FaUniversity, FaCheckCircle, FaTimes } from 'react-icons/fa';
import { paymentsAPI } from '../utils/api';

function PaymentModal({ isOpen, onClose, bookingId, amount, onPaymentSuccess }) {
  const [paymentMethod, setPaymentMethod] = useState('jazzcash');
  const [error, setError] = useState('');
  const [step, setStep] = useState(1); // 1: select method, 2: payment form, 3: success

  const handleMobilePayment = async (formData) => {
    try {
      setLoading(true);
      setError('');

      let response;
      if (paymentMethod === 'jazzcash') {
        response = await paymentsAPI.jazzCashPayment({
          bookingId,
          ...formData,
          amount,
        });
      } else if (paymentMethod === 'easypaisa') {
        response = await paymentsAPI.easyPaisaPayment({
          bookingId,
          ...formData,
          amount,
        });
      }

      if (response && response.success) {
        setStep(3);
        if (onPaymentSuccess) {
          onPaymentSuccess(response.payment);
        }
      }
    } catch (err) {
      setError(err.message || 'Failed to record payment');
    } finally {
      setLoading(false);
    }
  };

  const handleBankTransfer = async (formData) => {
    try {
      setLoading(true);
      setError('');

      const response = await paymentsAPI.bankTransfer({
        bookingId,
        ...formData,
        amount,
      });

      if (response.success) {
        setStep(3);
        if (onPaymentSuccess) {
          onPaymentSuccess(response.payment);
        }
      }
    } catch (err) {
      setError(err.message || 'Failed to record bank transfer');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Payment</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl"
          >
            <FaTimes />
          </button>
        </div>

        {error && (
          <div className="mb-4 bg-red-50 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        {step === 1 && (
          <div>
            <p className="text-lg font-semibold mb-4 text-gray-800">
              Amount: Rs.{amount}
            </p>
            <p className="text-gray-600 mb-6">Select payment method:</p>
            <div className="space-y-3">
              <button
                onClick={() => {
                  setPaymentMethod('jazzcash');
                  setStep(2);
                }}
                className="w-full p-4 border-2 rounded-lg flex items-center gap-3 border-gray-300 hover:border-red-500 hover:bg-red-50 transition"
              >
                <div className="bg-red-600 text-white p-2 rounded">
                  <FaMobileAlt className="text-xl" />
                </div>
                <div className="text-left">
                  <div className="font-semibold">JazzCash</div>
                  <div className="text-sm text-gray-600">Send money & enter TID</div>
                </div>
              </button>

              <button
                onClick={() => {
                  setPaymentMethod('easypaisa');
                  setStep(2);
                }}
                className="w-full p-4 border-2 rounded-lg flex items-center gap-3 border-gray-300 hover:border-green-500 hover:bg-green-50 transition"
              >
                <div className="bg-green-600 text-white p-2 rounded">
                  <FaMobileAlt className="text-xl" />
                </div>
                <div className="text-left">
                  <div className="font-semibold">EasyPaisa</div>
                  <div className="text-sm text-gray-600">Send money & enter TID</div>
                </div>
              </button>

              <button
                onClick={() => {
                  setPaymentMethod('bank-transfer');
                  setStep(2);
                }}
                className="w-full p-4 border-2 rounded-lg flex items-center gap-3 border-gray-300 hover:border-blue-500 hover:bg-blue-50 transition"
              >
                <div className="bg-blue-600 text-white p-2 rounded">
                  <FaUniversity className="text-xl" />
                </div>
                <div className="text-left">
                  <div className="font-semibold">Bank Transfer</div>
                  <div className="text-sm text-gray-600">NEFT/RTGS/IMPS</div>
                </div>
              </button>
            </div>
          </div>
        )}

        {step === 2 && (paymentMethod === 'jazzcash' || paymentMethod === 'easypaisa') && (
          <MobileWalletForm
            method={paymentMethod}
            onSubmit={handleMobilePayment}
            amount={amount}
            onBack={() => setStep(1)}
          />
        )}

        {step === 2 && paymentMethod === 'bank-transfer' && (
          <BankTransferForm
            onSubmit={handleBankTransfer}
            amount={amount}
            onBack={() => setStep(1)}
          />
        )}

        {step === 3 && (
          <div className="text-center">
            <FaCheckCircle className="text-6xl text-green-500 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-gray-800 mb-2">Payment Submitted!</h3>
            <p className="text-gray-600 mb-6">
              Your payment details have been recorded. We will verify the transaction and confirm your booking shortly.
            </p>
            <button
              onClick={() => {
                onClose();
                if (onPaymentSuccess) {
                  onPaymentSuccess();
                }
              }}
              className="w-full bg-primary-600 hover:bg-primary-700 text-white py-3 rounded-lg font-semibold transition"
            >
              Close
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function MobileWalletForm({ method, onSubmit, amount, onBack }) {
  const [formData, setFormData] = useState({
    mobileNumber: '',
    transactionId: '',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const merchantNumber = method === 'jazzcash' ? '0300-1234567' : '0345-1234567';
  const methodName = method === 'jazzcash' ? 'JazzCash' : 'EasyPaisa';
  const colorClass = method === 'jazzcash' ? 'text-red-600' : 'text-green-600';

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="bg-gray-50 p-4 rounded-lg mb-4">
        <p className="text-sm text-gray-600 mb-1">Please send <span className="font-bold">Rs.{amount}</span> to:</p>
        <p className={`text-xl font-bold ${colorClass}`}>{methodName}: {merchantNumber}</p>
        <p className="text-xs text-gray-500 mt-2">
          After sending, please enter your mobile number and the Transaction ID (TID) below.
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Your Mobile Number
        </label>
        <input
          type="text"
          required
          value={formData.mobileNumber}
          onChange={(e) => setFormData({ ...formData, mobileNumber: e.target.value })}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
          placeholder="e.g., 03001234567"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Transaction ID (TID)
        </label>
        <input
          type="text"
          required
          value={formData.transactionId}
          onChange={(e) => setFormData({ ...formData, transactionId: e.target.value })}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
          placeholder="Enter TID from SMS"
        />
      </div>

      <div className="flex gap-4 mt-6">
        <button
          type="button"
          onClick={onBack}
          className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 py-3 rounded-lg font-semibold transition"
        >
          Back
        </button>
        <button
          type="submit"
          className="flex-1 bg-primary-600 hover:bg-primary-700 text-white py-3 rounded-lg font-semibold transition"
        >
          Submit Payment
        </button>
      </div>
    </form>
  );
}

function BankTransferForm({ onSubmit, amount, onBack }) {
  const [formData, setFormData] = useState({
    transactionId: '',
    bankName: '',
    accountNumber: '',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Transaction ID / Reference Number
        </label>
        <input
          type="text"
          required
          value={formData.transactionId}
          onChange={(e) => setFormData({ ...formData, transactionId: e.target.value })}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
          placeholder="Enter transaction ID"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Bank Name
        </label>
        <input
          type="text"
          required
          value={formData.bankName}
          onChange={(e) => setFormData({ ...formData, bankName: e.target.value })}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
          placeholder="Enter bank name"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Account Number (Last 4 digits)
        </label>
        <input
          type="text"
          required
          maxLength={4}
          value={formData.accountNumber}
          onChange={(e) => setFormData({ ...formData, accountNumber: e.target.value })}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
          placeholder="Last 4 digits"
        />
      </div>
      <div className="bg-gray-50 p-4 rounded-lg">
        <p className="text-sm text-gray-600 mb-2">Transfer Amount:</p>
        <p className="text-2xl font-bold text-gray-800">Rs.{amount}</p>
        <p className="text-xs text-gray-500 mt-2">
          Account details will be provided after booking confirmation
        </p>
      </div>
      <div className="flex gap-4">
        <button
          type="button"
          onClick={onBack}
          className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 py-3 rounded-lg font-semibold transition"
        >
          Back
        </button>
        <button
          type="submit"
          className="flex-1 bg-primary-600 hover:bg-primary-700 text-white py-3 rounded-lg font-semibold transition"
        >
          Submit
        </button>
      </div>
    </form>
  );
}

export default PaymentModal;

