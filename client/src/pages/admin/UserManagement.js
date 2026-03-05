import React, { useState, useEffect } from 'react';
import { FaSearch, FaCheckCircle, FaTimesCircle, FaEdit, FaTrash } from 'react-icons/fa';
import { adminAPI } from '../../utils/api';

function UserManagement() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    role: '',
    verified: '',
    search: '',
    page: 1,
  });
  const [pagination, setPagination] = useState({});
  const [selectedUser, setSelectedUser] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await adminAPI.getUsers(filters);
      if (response.success) {
        setUsers(response.users);
        setPagination({
          page: response.page,
          pages: response.pages,
          total: response.total,
        });
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters]);

  const handleVerify = async (userId) => {
    try {
      const response = await adminAPI.verifyUser(userId);
      if (response.success) {
        fetchUsers();
      }
    } catch (error) {
      alert(error.message || 'Failed to verify user');
    }
  };

  const handleDelete = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;

    try {
      const response = await adminAPI.deleteUser(userId);
      if (response.success) {
        fetchUsers();
      }
    } catch (error) {
      alert(error.message || 'Failed to delete user');
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters({ ...filters, [key]: value, page: 1 });
  };

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-2xl font-semibold text-gray-800">User Management</h2>
      </div>

      {/* Filters */}
      <div className="p-6 border-b border-gray-200 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <FaSearch className="absolute left-3 top-3 text-gray-400" />
            <input
              type="text"
              placeholder="Search users..."
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
            />
          </div>
          <select
            value={filters.role}
            onChange={(e) => handleFilterChange('role', e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
          >
            <option value="">All Roles</option>
            <option value="client">Clients</option>
            <option value="staff">Staff</option>
            <option value="admin">Admins</option>
          </select>
          <select
            value={filters.verified}
            onChange={(e) => handleFilterChange('verified', e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
          >
            <option value="">All Verification</option>
            <option value="true">Verified</option>
            <option value="false">Not Verified</option>
          </select>
          <button
            onClick={() => setFilters({ role: '', verified: '', search: '', page: 1 })}
            className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg transition"
          >
            Clear Filters
          </button>
        </div>
      </div>

      {/* Users Table */}
      <div className="overflow-x-auto">
        {loading ? (
          <div className="p-12 text-center">
            <p className="text-gray-600">Loading users...</p>
          </div>
        ) : users.length === 0 ? (
          <div className="p-12 text-center">
            <p className="text-gray-600">No users found</p>
          </div>
        ) : (
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Phone</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {users.map((user) => (
                <tr key={user._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center">
                        <span className="text-primary-600 font-semibold">
                          {user.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{user.name}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.phone}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs rounded-full ${user.role === 'admin' ? 'bg-purple-100 text-purple-800' :
                      user.role === 'staff' ? 'bg-blue-100 text-blue-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {user.role === 'staff' && (
                      <button
                        onClick={() => handleVerify(user._id)}
                        className={`flex items-center gap-1 px-2 py-1 text-xs rounded ${user.isVerified
                          ? 'bg-green-100 text-green-800'
                          : 'bg-yellow-100 text-yellow-800'
                          }`}
                      >
                        {user.isVerified ? (
                          <>
                            <FaCheckCircle /> Verified
                          </>
                        ) : (
                          <>
                            <FaTimesCircle /> Not Verified
                          </>
                        )}
                      </button>
                    )}
                    {user.role !== 'staff' && (
                      <span className="text-sm text-gray-500">-</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          setSelectedUser(user);
                          setShowEditModal(true);
                        }}
                        className="text-primary-600 hover:text-primary-900"
                      >
                        <FaEdit />
                      </button>
                      {user.role !== 'admin' && (
                        <button
                          onClick={() => handleDelete(user._id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <FaTrash />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
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

export default UserManagement;

