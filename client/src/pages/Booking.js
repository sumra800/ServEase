import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FaCalendarAlt, FaClock, FaMapMarkerAlt, FaCreditCard, FaCheckCircle } from 'react-icons/fa';
import { useAppSelector } from '../store/hooks';
import { bookingsAPI, providersAPI } from '../utils/api';
import PaymentModal from '../Components/PaymentModal';

function Booking() {
  const location = useLocation();
  const navigate = useNavigate();
  const currentUser = useAppSelector((state) => state.auth.user);
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
  const service = location.state?.service || null;

  const [bookingData, setBookingData] = useState({
    serviceId: service?.id || '',
    service: service?.name || '',
    date: '',
    time: '',
    duration: '4',
    address: '',
    specialInstructions: '',
    paymentMethod: 'qr',
    assignedHelper: null, // New field for selected provider
    helperName: '',
  });

  const [providers, setProviders] = useState([]);
  const [loadingProviders, setLoadingProviders] = useState(false);

  // Update address when user data is available
  useEffect(() => {
    if (currentUser?.address && !bookingData.address) {
      setBookingData(prev => ({
        ...prev,
        address: currentUser.address
      }));
    }
  }, [currentUser, bookingData.address]);

  // Fetch providers when serviceId changes
  useEffect(() => {
    if (bookingData.serviceId) {
      const fetchProviders = async () => {
        setLoadingProviders(true);
        try {
          const response = await providersAPI.getAll(bookingData.serviceId);
          if (response.success) {
            setProviders(response.providers);
          }
        } catch (error) {
          console.error('Error fetching providers:', error);
        } finally {
          setLoadingProviders(false);
        }
      };
      fetchProviders();
    }
  }, [bookingData.serviceId]);

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [createdBooking, setCreatedBooking] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isAuthenticated || !currentUser) {
      navigate('/login', { state: { from: '/booking' } });
      return;
    }

    try {
      setLoading(true);
      setError('');

      const bookingPayload = {
        service: bookingData.service,
        serviceId: parseInt(bookingData.serviceId),
        date: bookingData.date,
        time: bookingData.time,
        duration: parseInt(bookingData.duration),
        address: bookingData.address,
        specialInstructions: bookingData.specialInstructions,
        paymentMethod: bookingData.paymentMethod,
        // Include assignedHelper if selected
        ...(bookingData.assignedHelper && { assignedHelper: bookingData.assignedHelper, helperName: bookingData.helperName }),
      };

      const response = await bookingsAPI.create(bookingPayload);

      if (response.success) {
        setCreatedBooking(response.booking);
        setShowPaymentModal(true);
      } else {
        setError(response.message || 'Failed to create booking');
      }
    } catch (err) {
      setError(err.message || 'Failed to create booking. Please try again.');
      console.error('Booking error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setBookingData({
      ...bookingData,
      [e.target.name]: e.target.value
    });
  };

  const handleProviderSelect = (provider) => {
    setBookingData(prev => ({
      ...prev,
      assignedHelper: provider._id,
      helperName: provider.name
    }));
  };

  if (!service && step === 1) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">No service selected</h2>
          <button
            onClick={() => navigate('/services')}
            className="bg-primary-600 text-white px-6 py-2 rounded-lg"
          >
            Browse Services
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-center text-gray-800">
          Book a Service
        </h1>

        {/* Progress Steps */}
        <div className="flex justify-center mb-8">
          <div className="flex items-center">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${step >= 1 ? 'bg-primary-600 text-white' : 'bg-gray-300 text-gray-600'}`}>1</div>
            <div className={`w-16 h-1 ${step >= 2 ? 'bg-primary-600' : 'bg-gray-300'}`}></div>
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${step >= 2 ? 'bg-primary-600 text-white' : 'bg-gray-300 text-gray-600'}`}>2</div>
            <div className={`w-16 h-1 ${step >= 3 ? 'bg-primary-600' : 'bg-gray-300'}`}></div>
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${step >= 3 ? 'bg-primary-600 text-white' : 'bg-gray-300 text-gray-600'}`}>3</div>
            <div className={`w-16 h-1 ${step >= 4 ? 'bg-primary-600' : 'bg-gray-300'}`}></div>
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${step >= 4 ? 'bg-primary-600 text-white' : 'bg-gray-300 text-gray-600'}`}>4</div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-lg p-8">
          {error && (
            <div className="mb-6 bg-red-50 border border-red-400 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          {/* Step 1: Service Details */}
          {step === 1 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold mb-4">Service Details</h2>
              <div className="bg-primary-50 p-4 rounded-lg">
                <h3 className="text-xl font-semibold text-primary-800">{service.name}</h3>
                <p className="text-gray-600 mt-2">{service.description}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <FaCalendarAlt className="inline mr-2" />
                  Select Date
                </label>
                <input
                  type="date"
                  name="date"
                  value={bookingData.date}
                  onChange={handleChange}
                  min={new Date().toISOString().split('T')[0]}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <FaClock className="inline mr-2" />
                  Select Time
                </label>
                <input
                  type="time"
                  name="time"
                  value={bookingData.time}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Duration (hours)
                </label>
                <select
                  name="duration"
                  value={bookingData.duration}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                >
                  <option value="2">2 hours</option>
                  <option value="4">4 hours</option>
                  <option value="6">6 hours</option>
                  <option value="8">8 hours (Full day)</option>
                </select>
              </div>
              <button
                type="button"
                onClick={() => setStep(2)}
                className="w-full bg-primary-600 hover:bg-primary-700 text-white py-3 rounded-lg font-semibold transition"
              >
                Continue
              </button>
            </div>
          )}

          {/* Step 2: Select Provider */}
          {step === 2 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold mb-4">Select a Provider (Optional)</h2>
              <p className="text-gray-600 text-sm mb-4">
                Choose a specific professional for your service, or skip to get the next available one.
              </p>

              {loadingProviders ? (
                <div className="text-center py-8">Loading providers...</div>
              ) : providers.length === 0 ? (
                <div className="bg-yellow-50 p-4 rounded-lg text-yellow-800">
                  No specific providers available for this service yet. We will assign the best match for you.
                </div>
              ) : (
                <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
                  {providers.map((provider) => (
                    <div
                      key={provider._id}
                      className={`border rounded-xl p-4 cursor-pointer transition-all ${bookingData.assignedHelper === provider._id
                        ? 'border-primary-500 bg-primary-50 ring-2 ring-primary-200'
                        : 'border-gray-200 hover:border-primary-300 hover:shadow-md'
                        }`}
                      onClick={() => handleProviderSelect(provider)}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-primary-200 rounded-full flex items-center justify-center text-primary-700 font-bold text-xl">
                          {provider.avatar ? (
                            <img src={provider.avatar} alt={provider.name} className="w-full h-full rounded-full object-cover" />
                          ) : (
                            provider.name.charAt(0)
                          )}
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-800">{provider.name}</h4>
                          <p className="text-xs text-gray-500">Verified Service Provider</p>
                        </div>
                        {bookingData.assignedHelper === provider._id && (
                          <FaCheckCircle className="ml-auto text-primary-600 text-xl" />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <div className="flex gap-4 mt-6">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 py-3 rounded-lg font-semibold transition"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  className="flex-1 bg-primary-600 hover:bg-primary-700 text-white py-3 rounded-lg font-semibold transition"
                >
                  {bookingData.assignedHelper ? 'Continue with Selected' : 'Skip & Continue'}
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Location & Instructions */}
          {step === 3 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold mb-4">Location & Instructions</h2>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <FaMapMarkerAlt className="inline mr-2" />
                  Service Address
                </label>
                <textarea
                  name="address"
                  value={bookingData.address}
                  onChange={handleChange}
                  required
                  rows="3"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                  placeholder="Enter your address"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Special Instructions
                </label>
                <textarea
                  name="specialInstructions"
                  value={bookingData.specialInstructions}
                  onChange={handleChange}
                  rows="4"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                  placeholder="Any special requirements or instructions..."
                />
              </div>
              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 py-3 rounded-lg font-semibold transition"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={() => setStep(4)}
                  className="flex-1 bg-primary-600 hover:bg-primary-700 text-white py-3 rounded-lg font-semibold transition"
                >
                  Continue
                </button>
              </div>
            </div>
          )}

          {/* Step 4: Review & Payment */}
          {step === 4 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold mb-4">Review & Payment</h2>
              <div className="bg-gray-50 p-6 rounded-lg space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Service:</span>
                  <span className="font-semibold">{service.name}</span>
                </div>
                {bookingData.helperName && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Provider:</span>
                    <span className="font-semibold text-primary-700">{bookingData.helperName}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-gray-600">Date:</span>
                  <span className="font-semibold">{bookingData.date}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Time:</span>
                  <span className="font-semibold">{bookingData.time}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Duration:</span>
                  <span className="font-semibold">{bookingData.duration} hours</span>
                </div>
                <div className="border-t pt-2 mt-2">
                  <div className="flex justify-between text-lg">
                    <span className="font-semibold">Total:</span>
                    <span className="font-bold text-primary-600">
                      Rs.{service.basePrice ? Math.round((service.basePrice / 4) * parseInt(bookingData.duration)) : 'Calculating...'}
                    </span>
                  </div>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <FaCreditCard className="inline mr-2" />
                  Payment Method
                </label>
                <select
                  name="paymentMethod"
                  value={bookingData.paymentMethod}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                >
                  <option value="qr">QR Code Payment</option>
                  <option value="bank-transfer">Bank Transfer</option>
                  <option value="cash">Cash on Service</option>
                </select>
              </div>
              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 py-3 rounded-lg font-semibold transition"
                  disabled={loading}
                >
                  Back
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-primary-600 hover:bg-primary-700 text-white py-3 rounded-lg font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={loading}
                >
                  {loading ? 'Creating Booking...' : 'Confirm Booking'}
                </button>
              </div>
            </div>
          )}
        </form>

        {/* Payment Modal */}
        {showPaymentModal && createdBooking && (
          <PaymentModal
            isOpen={showPaymentModal}
            onClose={() => {
              setShowPaymentModal(false);
              navigate('/dashboard', {
                state: { message: 'Booking created successfully!' }
              });
            }}
            bookingId={createdBooking._id}
            amount={createdBooking.totalAmount}
            onPaymentSuccess={(payment) => {
              setShowPaymentModal(false);
              navigate('/dashboard', {
                state: { message: 'Booking and payment completed successfully!' }
              });
            }}
          />
        )}
      </div>
    </div>
  );
}

export default Booking;

