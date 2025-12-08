import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { FaUsers, FaCalendarAlt, FaStar, FaDollarSign, FaChartLine, FaUserCheck, FaCreditCard } from 'react-icons/fa';
import { useAppSelector } from '../store/hooks';
import { adminAPI } from '../utils/api';
import UserManagement from './admin/UserManagement';
import BookingManagement from './admin/BookingManagement';
import PaymentManagement from './admin/PaymentManagement';
import StaffManagement from './admin/StaffManagement';

function AdminDashboard() {
  const currentUser = useAppSelector((state) => state.auth.user);
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (activeTab === 'dashboard') {
      fetchStats();
    }
  }, [activeTab]);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const response = await adminAPI.getStats();
      if (response.success) {
        setStats(response.stats);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated || !currentUser || currentUser.role !== 'admin') {
    return <Navigate to="/" />;
  }

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: FaChartLine },
    { id: 'users', label: 'Users', icon: FaUsers },
    { id: 'bookings', label: 'Bookings', icon: FaCalendarAlt },
    { id: 'staff', label: 'Staff', icon: FaUserCheck },
    { id: 'payments', label: 'Payments', icon: FaCreditCard },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Admin Dashboard</h1>
          <p className="text-gray-600">Manage ServEase platform</p>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex -mb-px">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 px-6 py-4 border-b-2 font-medium text-sm transition ${activeTab === tab.id
                        ? 'border-primary-600 text-primary-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }`}
                  >
                    <Icon />
                    {tab.label}
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Dashboard Tab */}
        {activeTab === 'dashboard' && (
          <>
            {loading ? (
              <div className="text-center py-12">
                <p className="text-gray-600">Loading statistics...</p>
              </div>
            ) : stats ? (
              <>
                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                  <div className="bg-white rounded-lg shadow p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-gray-600 text-sm">Total Users</p>
                        <p className="text-3xl font-bold text-gray-800 mt-2">{stats.users.total}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          {stats.users.clients} clients, {stats.users.staff} staff
                        </p>
                      </div>
                      <div className="text-primary-600">
                        <FaUsers className="text-4xl" />
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-lg shadow p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-gray-600 text-sm">Active Bookings</p>
                        <p className="text-3xl font-bold text-gray-800 mt-2">{stats.bookings.confirmed}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          {stats.bookings.pending} pending
                        </p>
                      </div>
                      <div className="text-green-600">
                        <FaCalendarAlt className="text-4xl" />
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-lg shadow p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-gray-600 text-sm">Total Revenue</p>
                        <p className="text-3xl font-bold text-gray-800 mt-2">₹{stats.revenue.total.toLocaleString()}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          Rs.{stats.revenue.monthly.toLocaleString()} this month
                        </p>
                      </div>
                      <div className="text-yellow-600">
                        <FaDollarSign className="text-4xl" />
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-lg shadow p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-gray-600 text-sm">Average Rating</p>
                        <p className="text-3xl font-bold text-gray-800 mt-2">{stats.ratings.average}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          {stats.ratings.total} ratings
                        </p>
                      </div>
                      <div className="text-purple-600">
                        <FaStar className="text-4xl" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Recent Bookings */}
                <div className="bg-white rounded-lg shadow">
                  <div className="p-6 border-b border-gray-200">
                    <h2 className="text-xl font-semibold text-gray-800">Recent Bookings</h2>
                  </div>
                  <div className="divide-y divide-gray-200">
                    {stats.recentBookings.length === 0 ? (
                      <div className="p-6 text-center text-gray-600">No recent bookings</div>
                    ) : (
                      stats.recentBookings.map((booking) => {
                        const bookingDate = new Date(booking.date).toLocaleDateString();
                        return (
                          <div key={booking._id} className="p-6 hover:bg-gray-50">
                            <div className="flex justify-between items-center">
                              <div>
                                <h3 className="font-semibold text-gray-800">{booking.service}</h3>
                                <p className="text-sm text-gray-600">
                                  {booking.user?.name} • {bookingDate} • {booking.time}
                                </p>
                              </div>
                              <span className={`px-3 py-1 rounded-full text-sm ${booking.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                                  booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                    'bg-gray-100 text-gray-800'
                                }`}>
                                {booking.status}
                              </span>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>
              </>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-600">Failed to load statistics</p>
              </div>
            )}
          </>
        )}

        {/* Users Tab */}
        {activeTab === 'users' && <UserManagement />}

        {/* Bookings Tab */}
        {activeTab === 'bookings' && <BookingManagement />}

        {/* Staff Tab */}
        {activeTab === 'staff' && <StaffManagement />}

        {/* Payments Tab */}
        {activeTab === 'payments' && <PaymentManagement />}
      </div>
    </div>
  );
}

export default AdminDashboard;

