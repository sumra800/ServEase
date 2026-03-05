import React, { useState, useEffect } from 'react';
import { FaUser, FaCalendarAlt, FaClock, FaCheckCircle } from 'react-icons/fa';
import { adminAPI, bookingsAPI } from '../../utils/api';

function BookingManagement() {
  const [bookings, setBookings] = useState([]);
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    status: '',
    page: 1,
  });
  const [pagination, setPagination] = useState({});
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showAssignModal, setShowAssignModal] = useState(false);

  const fetchStaff = async () => {
    try {
      const response = await adminAPI.getStaff({ verified: 'true' });
      if (response.success) {
        setStaff(response.staff);
      }
    } catch (error) {
      console.error('Error fetching staff:', error);
    }
  };

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const response = await adminAPI.getBookings(filters);
      if (response.success) {
        setBookings(response.bookings);
        setPagination({
          page: response.page,
          pages: response.pages,
          total: response.total,
        });
      }
    } catch (error) {
      console.error('Error fetching bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
    fetchStaff();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters]);

  const handleAssignHelper = async (bookingId, helperId) => {
    try {
      const response = await adminAPI.assignHelper(bookingId, helperId);
      if (response.success) {
        fetchBookings();
        setShowAssignModal(false);
        setSelectedBooking(null);
      }
    } catch (error) {
      alert(error.message || 'Failed to assign helper');
    }
  };

  const handleStatusUpdate = async (bookingId, status) => {
    try {
      const response = await bookingsAPI.updateStatus(bookingId, status);
      if (response.success) {
        fetchBookings();
      }
    } catch (error) {
      console.error('Status update error:', error);
      alert(error.message || 'Failed to update status');
    }
  };

  const handleApproveBooking = async (bookingId) => {
    try {
      if (window.confirm('Are you sure you want to approve this booking?')) {
        const response = await adminAPI.approveBooking(bookingId);
        if (response.success) {
          fetchBookings();
          alert('Booking approved successfully');
        }
      }
    } catch (error) {
      console.error('Approve booking error:', error);
      alert(error.message || 'Failed to approve booking');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'pending':
      case 'pending_admin':
        return 'bg-yellow-100 text-yellow-800';
      case 'pending_provider':
        return 'bg-orange-100 text-orange-800';
      case 'in-progress':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-gray-100 text-gray-800';
      case 'cancelled':
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-2xl font-semibold text-gray-800">Booking Management</h2>
      </div>

      {/* Filters */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex gap-4">
          <select
            value={filters.status}
            onChange={(e) => setFilters({ ...filters, status: e.target.value, page: 1 })}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
          >
            <option value="">All Status</option>
            <option value="pending_admin">Pending Admin</option>
            <option value="pending_provider">Pending Provider</option>
            <option value="confirmed">Confirmed</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
          <button
            onClick={() => setFilters({ status: '', page: 1 })}
            className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg transition"
          >
            Clear Filters
          </button>
        </div>
      </div>

      {/* Bookings List */}
      <div className="overflow-x-auto">
        {loading ? (
          <div className="p-12 text-center">
            <p className="text-gray-600">Loading bookings...</p>
          </div>
        ) : bookings.length === 0 ? (
          <div className="p-12 text-center">
            <p className="text-gray-600">No bookings found</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {bookings.map((booking) => {
              const bookingDate = new Date(booking.date).toLocaleDateString();
              return (
                <div key={booking._id} className="p-6 hover:bg-gray-50">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-4 mb-2">
                        <h3 className="text-lg font-semibold text-gray-800">{booking.service}</h3>
                        <span className={`px-3 py-1 rounded-full text-sm ${getStatusColor(booking.status)}`}>
                          {booking.status.replace('_', ' ')}
                        </span>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600">
                        <div>
                          <FaUser className="inline mr-1" />
                          <span className="font-medium">Client:</span> {booking.user?.name || 'N/A'}
                        </div>
                        <div>
                          <FaCalendarAlt className="inline mr-1" />
                          <span className="font-medium">Date:</span> {bookingDate}
                        </div>
                        <div>
                          <FaClock className="inline mr-1" />
                          <span className="font-medium">Time:</span> {booking.time}
                        </div>
                        <div>
                          <span className="font-medium">Amount:</span> Rs.{booking.totalAmount}
                        </div>
                      </div>
                      {booking.assignedHelper && (
                        <div className="mt-2 text-sm text-gray-600">
                          <FaCheckCircle className="inline mr-1 text-green-600" />
                          <span className="font-medium">Helper:</span> {booking.assignedHelper.name || booking.helperName}
                        </div>
                      )}
                    </div>
                    <div className="flex gap-2 ml-4">
                      {booking.status === 'pending_admin' && booking.assignedHelper && (
                        <button
                          onClick={() => handleApproveBooking(booking._id)}
                          className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm transition"
                        >
                          Approve
                        </button>
                      )}
                      {!booking.assignedHelper && ['pending_admin', 'pending', 'pending_provider'].includes(booking.status) && (
                        <button
                          onClick={() => {
                            setSelectedBooking(booking);
                            setShowAssignModal(true);
                          }}
                          className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg text-sm transition"
                        >
                          Assign Helper
                        </button>
                      )}
                      <select
                        value={booking.status}
                        onChange={(e) => handleStatusUpdate(booking._id, e.target.value)}
                        className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-primary-500 focus:border-primary-500"
                      >
                        <option value="pending">Pending</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="in-progress">In Progress</option>
                        <option value="completed">Completed</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
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

      {/* Assign Helper Modal */}
      {showAssignModal && selectedBooking && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-xl font-semibold mb-4">Assign Helper</h3>
            <p className="text-gray-600 mb-4">Select a helper for this booking:</p>
            <div className="space-y-2 max-h-64 overflow-y-auto mb-4">
              {staff.length === 0 ? (
                <p className="text-gray-500 text-sm">No verified staff available</p>
              ) : (
                staff.map((member) => (
                  <button
                    key={member._id}
                    onClick={() => handleAssignHelper(selectedBooking._id, member._id)}
                    className="w-full text-left p-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
                  >
                    <div className="font-medium">{member.name}</div>
                    <div className="text-sm text-gray-600">{member.email}</div>
                    <div className="text-xs text-gray-500">
                      Active: {member.activeAssignments} | Total: {member.totalAssignments}
                    </div>
                  </button>
                ))
              )}
            </div>
            <button
              onClick={() => {
                setShowAssignModal(false);
                setSelectedBooking(null);
              }}
              className="w-full px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg transition"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default BookingManagement;

