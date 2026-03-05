import React, { useState, useEffect } from 'react';
import { FaCheckCircle, FaTimesCircle, FaSearch } from 'react-icons/fa';
import { adminAPI } from '../../utils/api';

function StaffManagement() {
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    verified: '',
    search: '',
  });

  const fetchStaff = async () => {
    try {
      setLoading(true);
      const response = await adminAPI.getStaff(filters);
      if (response.success) {
        setStaff(response.staff);
      }
    } catch (error) {
      console.error('Error fetching staff:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStaff();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters]);

  const handleVerify = async (staffId) => {
    try {
      const response = await adminAPI.verifyUser(staffId);
      if (response.success) {
        fetchStaff();
      }
    } catch (error) {
      alert(error.message || 'Failed to verify staff');
    }
  };

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-2xl font-semibold text-gray-800">Staff Management</h2>
      </div>

      {/* Filters */}
      <div className="p-6 border-b border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <FaSearch className="absolute left-3 top-3 text-gray-400" />
            <input
              type="text"
              placeholder="Search staff..."
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
            />
          </div>
          <select
            value={filters.verified}
            onChange={(e) => setFilters({ ...filters, verified: e.target.value })}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
          >
            <option value="">All Staff</option>
            <option value="true">Verified</option>
            <option value="false">Not Verified</option>
          </select>
          <button
            onClick={() => setFilters({ verified: '', search: '' })}
            className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg transition"
          >
            Clear Filters
          </button>
        </div>
      </div>

      {/* Staff Grid */}
      <div className="p-6">
        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-600">Loading staff...</p>
          </div>
        ) : staff.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600">No staff members found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {staff.map((member) => (
              <div key={member._id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-full bg-primary-100 flex items-center justify-center">
                      <span className="text-primary-600 font-semibold text-lg">
                        {member.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800">{member.name}</h3>
                      <p className="text-sm text-gray-600">{member.email}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleVerify(member._id)}
                    className={`p-2 rounded ${member.isVerified
                        ? 'bg-green-100 text-green-600'
                        : 'bg-yellow-100 text-yellow-600'
                      }`}
                    title={member.isVerified ? 'Verified' : 'Not Verified'}
                  >
                    {member.isVerified ? <FaCheckCircle /> : <FaTimesCircle />}
                  </button>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Phone:</span>
                    <span className="text-gray-800">{member.phone}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Assignments:</span>
                    <span className="font-semibold text-gray-800">{member.totalAssignments || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Active Assignments:</span>
                    <span className="font-semibold text-primary-600">{member.activeAssignments || 0}</span>
                  </div>
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <span className={`px-3 py-1 rounded-full text-xs ${member.isVerified
                        ? 'bg-green-100 text-green-800'
                        : 'bg-yellow-100 text-yellow-800'
                      }`}>
                      {member.isVerified ? 'Verified Staff' : 'Pending Verification'}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default StaffManagement;

