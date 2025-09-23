import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FiSearch } from 'react-icons/fi';

const CustomerReport = () => {
  const [fromDate, setFromDate] = useState('2025-08-31');
  const [toDate, setToDate] = useState('2025-09-22');
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [usersPerPage, setUsersPerPage] = useState(10); // Default 10 users
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    fetchUserDetails();
  }, [fromDate, toDate]);

  const fetchUserDetails = async () => {
    setLoading(true);
    try {
      const response = await axios.post('https://api.mayway.in/api/report/user-details', {
        from_date: fromDate,
        to_date: toDate,
      });
      if (response.data.status === 200) {
        setUsers(response.data.data);
      } else {
        alert(response.data.message || 'Failed to fetch user details');
      }
    } catch (error) {
      console.error(error);
      alert('Error fetching user details');
    }
    setLoading(false);
  };

  const handleUpdate = (user) => {
    setSelectedUser(user);
    setShowUpdateModal(true);
  };

  const handleView = (user) => {
    setSelectedUser(user);
    setShowViewModal(true);
  };

  const updateUserDetails = async () => {
    try {
      const payload = {
        user_id: selectedUser.id,
        sender_user_id: 2, // admin ID
        firstName: selectedUser.first_name,
        lastName: selectedUser.last_name,
        email: selectedUser.email,
        mobile: selectedUser.mobile,
        is_portfolio: selectedUser.is_portfolio || 0,
      };

      const response = await axios.post(
        'https://api.mayway.in/api/users/update-user-info-admin',
        payload
      );

      if (response.data.status === 200) {
        alert('User updated successfully');
        setShowUpdateModal(false);
        fetchUserDetails();
      } else {
        alert(response.data.message || 'Failed to update user');
      }
    } catch (error) {
      console.error(error);
      alert('Error updating user');
    }
  };

  // Filtered users based on search
  const filteredUsers = users.filter(
    (user) =>
      user.first_name.toLowerCase().includes(searchText.toLowerCase()) ||
      user.last_name.toLowerCase().includes(searchText.toLowerCase()) ||
      user.email.toLowerCase().includes(searchText.toLowerCase())
  );

  // Pagination: slice users based on selected users per page
  const displayedUsers = filteredUsers.slice(0, usersPerPage);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Customer Report</h1>
        </div>

        {/* Filters */}
        <div className="flex gap-4 mb-6 flex-wrap">
          {/* Date Range */}
          <div>
            <label className="block text-sm font-medium text-gray-700">From</label>
            <input
              type="date"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              className="mt-1 border border-gray-300 rounded-md p-2 text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">To</label>
            <input
              type="date"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
              className="mt-1 border border-gray-300 rounded-md p-2 text-sm"
            />
          </div>
          <button
            onClick={fetchUserDetails}
            className="self-end px-4 py-2 bg-blue-600 text-white rounded-md text-sm"
          >
            Refresh
          </button>

          {/* Users per page dropdown */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Users per page</label>
            <select
              value={usersPerPage}
              onChange={(e) => setUsersPerPage(Number(e.target.value))}
              className="mt-1 border border-gray-300 rounded-md p-2 text-sm"
            >
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={30}>30</option>
              <option value={40}>40</option>
            </select>
          </div>

          {/* Search */}
          <div className="ml-auto relative">
            <input
              type="text"
              placeholder="Search users..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              className="pl-8 pr-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <FiSearch className="absolute left-2 top-2 text-gray-400" size={14} />
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-white rounded-lg shadow-sm p-4">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Sr. No.
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Mobile
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    City
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    State
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Created On
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {loading ? (
                  <tr>
                    <td colSpan="8" className="text-center py-4">
                      Loading...
                    </td>
                  </tr>
                ) : displayedUsers.length === 0 ? (
                  <tr>
                    <td colSpan="8" className="text-center py-4">
                      No users found
                    </td>
                  </tr>
                ) : (
                  displayedUsers.map((user, index) => (
                    <tr key={user.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {index + 1}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {user.first_name} {user.last_name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {user.email}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {user.mobile}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {user.circle || 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {user.district || 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {user.created_on
                          ? new Date(user.created_on).toLocaleDateString('en-GB')
                          : 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 space-x-2">
                        <button
                          onClick={() => handleView(user)}
                          className="px-2 py-1 bg-green-500 text-white rounded text-xs"
                        >
                          View
                        </button>
                        <button
                          onClick={() => handleUpdate(user)}
                          className="px-2 py-1 bg-blue-500 text-white rounded text-xs"
                        >
                          Update
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Update Modal */}
      {showUpdateModal && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-lg font-semibold mb-4">Update User</h2>

            <div className="space-y-3">
              <input
                type="text"
                placeholder="First Name"
                value={selectedUser.first_name}
                onChange={(e) =>
                  setSelectedUser({ ...selectedUser, first_name: e.target.value })
                }
                className="w-full border px-3 py-2 rounded"
              />
              <input
                type="text"
                placeholder="Last Name"
                value={selectedUser.last_name}
                onChange={(e) =>
                  setSelectedUser({ ...selectedUser, last_name: e.target.value })
                }
                className="w-full border px-3 py-2 rounded"
              />
              <input
                type="email"
                placeholder="Email"
                value={selectedUser.email}
                onChange={(e) =>
                  setSelectedUser({ ...selectedUser, email: e.target.value })
                }
                className="w-full border px-3 py-2 rounded"
              />
              <input
                type="text"
                placeholder="Mobile"
                value={selectedUser.mobile}
                onChange={(e) =>
                  setSelectedUser({ ...selectedUser, mobile: e.target.value })
                }
                className="w-full border px-3 py-2 rounded"
              />
            </div>

            <div className="flex justify-end mt-4 gap-2">
              <button
                onClick={() => setShowUpdateModal(false)}
                className="px-4 py-2 bg-gray-400 text-white rounded"
              >
                Cancel
              </button>
              <button
                onClick={updateUserDetails}
                className="px-4 py-2 bg-blue-600 text-white rounded"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View Modal */}
      {showViewModal && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-lg font-semibold mb-4">User Details</h2>

            <div className="space-y-2">
              <div><strong>First Name:</strong> {selectedUser.first_name}</div>
              <div><strong>Last Name:</strong> {selectedUser.last_name}</div>
              <div><strong>Email:</strong> {selectedUser.email}</div>
              <div><strong>Mobile:</strong> {selectedUser.mobile}</div>
              <div><strong>City:</strong> {selectedUser.circle || 'N/A'}</div>
              <div><strong>State:</strong> {selectedUser.district || 'N/A'}</div>
              <div>
                <strong>Created On:</strong>{' '}
                {selectedUser.created_on
                  ? new Date(selectedUser.created_on).toLocaleDateString('en-GB')
                  : 'N/A'}
              </div>
            </div>

            <div className="flex justify-end mt-4">
              <button
                onClick={() => setShowViewModal(false)}
                className="px-4 py-2 bg-gray-400 text-white rounded"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomerReport;
