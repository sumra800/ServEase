import React, { useState, useEffect } from 'react';
import { FaCheckCircle } from 'react-icons/fa';
import { adminAPI } from '../../utils/api';

function PaymentManagement() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    status: '',
    method: '',
    page: 1,
  });
  const [pagination, setPagination] = useState({});
  const [totalAmount, setTotalAmount] = useState(0);

  const fetchPayments = async () => {
    try {
      setLoading(true);
      const response = await adminAPI.getPayments(filters);
      if (response.success) {
        setPayments(response.payments);
        setTotalAmount(response.totalAmount);
        setPagination({
          page: response.page,
          pages: response.pages,
          total: response.total,
        });
      }
    } catch (error) {
      console.error('Error fetching payments:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters]);

  const handleVerifyPayment = async (paymentId) => {
    if (!window.confirm('Verify this payment as completed?')) return;

    try {
      const response = await adminAPI.verifyPayment(paymentId);
      if (response.success) {
        fetchPayments();
      }
    } catch (error) {
      alert(error.message || 'Failed to verify payment');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'processing':
        return 'bg-yellow-100 text-yellow-800';
      case 'pending':
        return 'bg-gray-100 text-gray-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-6 border-b border-gray-200">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-semibold text-gray-800">Payment Management</h2>
          <div className="text-right">
            <p className="text-sm text-gray-600">Total Revenue</p>
            <p className="text-2xl font-bold text-primary-600">Rs.{totalAmount.toLocaleString()}</p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="p-6 border-b border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <select
            value={filters.status}
            onChange={(e) => setFilters({ ...filters, status: e.target.value, page: 1 })}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
          >
            <option value="">All Status</option>
            <option value="pending">Pending</option>
            <option value="processing">Processing</option>
            <option value="completed">Completed</option>
            <option value="failed">Failed</option>
          </select>
          <select
            value={filters.method}
            onChange={(e) => setFilters({ ...filters, method: e.target.value, page: 1 })}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
          >
            <option value="">All Methods</option>
            <option value="razorpay">Razorpay</option>
            <option value="qr">QR Code</option>
            <option value="bank-transfer">Bank Transfer</option>
            <option value="cash">Cash</option>
          </select>
          <button
            onClick={() => setFilters({ status: '', method: '', page: 1 })}
            className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg transition"
          >
            Clear Filters
          </button>
        </div>
      </div>

      {/* Payments Table */}
      <div className="overflow-x-auto">
        {loading ? (
          <div className="p-12 text-center">
            <p className="text-gray-600">Loading payments...</p>
          </div>
        ) : payments.length === 0 ? (
          <div className="p-12 text-center">
            <p className="text-gray-600">No payments found</p>
          </div>
        ) : (
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">User</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Booking</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Method</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {payments.map((payment) => {
                const paymentDate = new Date(payment.createdAt).toLocaleDateString();
                return (
                  <tr key={payment._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{payment.user?.name || 'N/A'}</div>
                      <div className="text-sm text-gray-500">{payment.user?.email || ''}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {payment.booking?.service || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                      Rs.{payment.amount}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-800">
                        {payment.paymentMethod}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(payment.status)}`}>
                        {payment.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{paymentDate}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      {payment.status === 'processing' && payment.paymentMethod === 'bank-transfer' && (
                        <button
                          onClick={() => handleVerifyPayment(payment._id)}
                          className="text-green-600 hover:text-green-900 flex items-center gap-1"
                        >
                          <FaCheckCircle /> Verify
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination */}
      {pagination.pages > 1 && (
        <div className="p-6 border-t border-gray-200 flex justify-between items-center">
          <p className="text-sm text-gray-600">
            Showing page {pagination.page} of {pagination.pages} ({pagination.total} total)
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => setFilters({ ...filters, page: filters.page - 1 })}
              disabled={filters.page === 1}
              className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              Previous
            </button>
            <button
              onClick={() => setFilters({ ...filters, page: filters.page + 1 })}
              disabled={filters.page >= pagination.pages}
              className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default PaymentManagement;

