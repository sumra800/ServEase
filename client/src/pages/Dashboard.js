import React, { useEffect, useState } from 'react';
import { useAppSelector, useAppDispatch } from '../store/hooks';
import { useNavigate } from 'react-router-dom';
import { bookingsAPI } from '../utils/api';
import { logout } from '../store/slices/authSlice';
import Button from '../Components/Button';
import Card from '../Components/Card';
import ReviewModal from '../Components/ReviewModal';
import ClientReviewModal from '../Components/ClientReviewModal';
import {
  FaCalendarAlt,
  FaClock,
  FaMapMarkerAlt,
  FaUser,
  FaSignOutAlt,
  FaCog,
  FaSpinner,
  FaStar,
} from 'react-icons/fa';

function Dashboard() {
  const { user } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Review Modal State
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [clientReviewModalOpen, setClientReviewModalOpen] = useState(false);
  const [selectedBookingId, setSelectedBookingId] = useState(null);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await bookingsAPI.getAll();
        if (response.success) {
          setBookings(response.bookings);
        } else {
          setError('Failed to fetch bookings');
        }
      } catch (err) {
        setError('Failed to fetch bookings');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const handleReviewClick = (bookingId) => {
    setSelectedBookingId(bookingId);
    setReviewModalOpen(true);
  };

  const handleClientReviewClick = (bookingId) => {
    setSelectedBookingId(bookingId);
    setClientReviewModalOpen(true);
  };

  const handleReviewSuccess = () => {
    // Refresh bookings to show the new rating
    const fetchBookings = async () => {
      try {
        const response = await bookingsAPI.getAll();
        if (response.success) {
          setBookings(response.bookings);
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchBookings();
  };

  const handleStatusUpdate = async (bookingId, newStatus) => {
    try {
      const response = await bookingsAPI.updateStatus(bookingId, newStatus);
      if (response.success) {
        // Optimistic update
        setBookings(bookings.map(book =>
          book._id === bookingId ? { ...book, status: newStatus } : book
        ));
      }
    } catch (err) {
      console.error('Failed to update status:', err);
    }
  };

  const handleProviderResponse = async (bookingId, responseStr) => {
    try {
      const response = await bookingsAPI.respondToBooking(bookingId, responseStr);
      if (response.success) {
        // Refresh bookings
        const bookingsRes = await bookingsAPI.getAll();
        if (bookingsRes.success) {
          setBookings(bookingsRes.bookings);
        }
      }
    } catch (err) {
      console.error(`Failed to ${responseStr} booking:`, err);
      // alert(`Failed to ${responseStr} booking`);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-50">
        <FaSpinner className="text-4xl text-primary-600 animate-spin" />
      </div>
    );
  }

  const isProvider = user?.role === 'staff';

  return (
    <div className="min-h-screen bg-neutral-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-neutral-900">
              Welcome back, {user?.name.split(' ')[0]}!
            </h1>
            <p className="text-neutral-600 mt-1">
              {isProvider ? 'Manage your assigned service requests' : 'Here are your recent bookings and current status'}
            </p>
          </div>
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => navigate('/profile')}
              icon={FaCog}
            >
              Settings
            </Button>
            <Button
              variant="secondary"
              onClick={handleLogout}
              icon={FaSignOutAlt}
            >
              Logout
            </Button>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-6">
            {error}
          </div>
        )}

        {bookings.length === 0 ? (
          <Card className="text-center py-16">
            <div className="bg-neutral-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <FaCalendarAlt className="text-2xl text-neutral-400" />
            </div>
            <h3 className="text-xl font-semibold text-neutral-900 mb-2">No bookings yet</h3>
            <p className="text-neutral-600 mb-6">
              {isProvider ? 'You have not been assigned any bookings yet.' : 'You haven\'t booked any services yet. Request your first service today!'}
            </p>
            {!isProvider && (
              <Button
                variant="primary"
                onClick={() => navigate('/services')}
              >
                Browse Services
              </Button>
            )}
          </Card>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {bookings.map((booking) => (
              <Card key={booking._id} className="flex flex-col h-full hover:shadow-lg transition-shadow duration-300">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-bold text-neutral-900">{booking.service}</h3>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium mt-2 capitalize
                      ${booking.status === 'completed' ? 'bg-green-100 text-green-800' :
                        ['cancelled', 'rejected'].includes(booking.status) ? 'bg-red-100 text-red-800' :
                          booking.status === 'confirmed' ? 'bg-blue-100 text-blue-800' :
                            booking.status === 'pending_provider' ? 'bg-orange-100 text-orange-800' :
                              'bg-yellow-100 text-yellow-800'}`}>
                      {booking.status === 'pending_admin' ? 'Pending Admin Approval' :
                        booking.status === 'pending_provider' ? (isProvider ? 'Action Required' : 'Waiting for Provider') :
                          booking.status}
                    </span>
                  </div>
                  <div className="bg-primary-50 p-2 rounded-lg">
                    <FaCalendarAlt className="text-primary-600" />
                  </div>
                </div>

                <div className="space-y-3 flex-grow">
                  <div className="flex items-center text-neutral-600 text-sm">
                    <FaClock className="mr-3 text-neutral-400 w-4" />
                    <span>{new Date(booking.date).toLocaleDateString()} at {booking.time}</span>
                  </div>
                  <div className="flex items-center text-neutral-600 text-sm">
                    <FaMapMarkerAlt className="mr-3 text-neutral-400 w-4" />
                    <span className="truncate">{booking.address}</span>
                  </div>

                  {/* Display Helper/Client info based on role */}
                  <div className="flex items-center text-neutral-600 text-sm pt-2 border-t border-neutral-100 mt-3">
                    <FaUser className="mr-3 text-neutral-400 w-4" />
                    {isProvider ? (
                      <div>
                        <span className="text-xs text-neutral-400 block">Client</span>
                        <span className="font-medium">{booking.user?.name || 'Unknown Client'}</span>
                        <div className="text-xs text-neutral-500">{booking.user?.phone}</div>
                      </div>
                    ) : (
                      <div>
                        <span className="text-xs text-neutral-400 block">Provider</span>
                        {booking.helperName ? (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate(`/provider/${booking.assignedHelper?._id || booking.assignedHelper}`);
                            }}
                            className="font-medium text-primary-600 hover:text-primary-700 hover:underline text-left block"
                          >
                            {booking.helperName}
                          </button>
                        ) : (
                          <span className="font-medium text-neutral-500 italic">Not assigned yet</span>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Rating Display */}
                  {booking.rating && !isProvider && (
                    <div className="bg-yellow-50 p-3 rounded-lg mt-3">
                      <div className="flex items-center gap-1 mb-1">
                        {[...Array(5)].map((_, i) => (
                          <FaStar key={i} className={`text-xs ${i < booking.rating ? 'text-yellow-400' : 'text-neutral-200'}`} />
                        ))}
                      </div>
                      {booking.review && <p className="text-xs text-neutral-600 italic">"{booking.review}"</p>}
                    </div>
                  )}

                  {booking.clientRating && isProvider && (
                    <div className="bg-yellow-50 p-3 rounded-lg mt-3">
                      <div className="text-xs font-semibold text-yellow-800 mb-1">You rated this client:</div>
                      <div className="flex items-center gap-1 mb-1">
                        {[...Array(5)].map((_, i) => (
                          <FaStar key={i} className={`text-xs ${i < booking.clientRating ? 'text-yellow-400' : 'text-neutral-200'}`} />
                        ))}
                      </div>
                      {booking.clientReview && <p className="text-xs text-neutral-600 italic">"{booking.clientReview}"</p>}
                    </div>
                  )}
                </div>

                <div className="mt-6 pt-4 border-t border-neutral-100">
                  {/* Client Actions */}
                  {!isProvider && (
                    <>
                      {booking.status === 'completed' && !booking.rating && (
                        <Button
                          variant="primary"
                          className="w-full text-sm py-2"
                          onClick={() => handleReviewClick(booking._id)}
                        >
                          Rate & Review
                        </Button>
                      )}

                      {['pending', 'pending_admin'].includes(booking.status) && (
                        <Button
                          variant="outline"
                          className="w-full text-sm py-2 text-red-600 border-red-200 hover:bg-red-50"
                        >
                          Cancel Booking
                        </Button>
                      )}
                    </>
                  )}

                  {/* Provider Actions */}
                  {isProvider && (
                    <div className="space-y-2">
                      {booking.status === 'pending_provider' && (
                        <div className="flex gap-2">
                          <Button
                            variant="primary"
                            className="flex-1 text-sm py-2 bg-green-600 hover:bg-green-700 border-green-600"
                            onClick={() => handleProviderResponse(booking._id, 'accept')}
                          >
                            Accept
                          </Button>
                          <Button
                            variant="outline"
                            className="flex-1 text-sm py-2 text-red-600 border-red-200 hover:bg-red-50"
                            onClick={() => handleProviderResponse(booking._id, 'reject')}
                          >
                            Decline
                          </Button>
                        </div>
                      )}

                      {booking.status === 'confirmed' && (
                        <Button
                          variant="primary"
                          className="w-full text-sm py-2 bg-green-600 hover:bg-green-700 border-green-600"
                          onClick={() => handleStatusUpdate(booking._id, 'completed')}
                        >
                          Mark Completed
                        </Button>
                      )}

                      {booking.status === 'completed' && !booking.clientRating && (
                        <Button
                          variant="primary"
                          className="w-full text-sm py-2"
                          onClick={() => handleClientReviewClick(booking._id)}
                        >
                          Rate Client
                        </Button>
                      )}
                    </div>
                  )}
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Modals */}
        <ReviewModal
          isOpen={reviewModalOpen}
          onClose={() => setReviewModalOpen(false)}
          bookingId={selectedBookingId}
          onReviewSuccess={handleReviewSuccess}
        />

        <ClientReviewModal
          isOpen={clientReviewModalOpen}
          onClose={() => setClientReviewModalOpen(false)}
          bookingId={selectedBookingId}
          onReviewSuccess={handleReviewSuccess}
        />
      </div>
    </div>
  );
}

export default Dashboard;
