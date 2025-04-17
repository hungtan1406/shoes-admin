import React, { useEffect, useState } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import axios from 'axios';
import { toast } from 'react-toastify';
import { FiEye, FiTrash } from 'react-icons/fi';
import { CiSearch } from 'react-icons/ci';
const Customer = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [searchEmail, setSearchEmail] = useState(''); // State cho tìm kiếm email

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const response = await axios.get(
          'http://localhost:8000/api/v1/customers'
        );
        setCustomers(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching customers:', err);
        setError('Failed to fetch customers');
        setLoading(false);
      }
    };

    fetchCustomers();
  }, []);

  const handleViewCustomer = (customer) => {
    setSelectedCustomer(customer);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedCustomer(null);
  };

  const handleDeleteCustomer = async (customerId) => {
    if (window.confirm('Are you sure you want to delete this customer?')) {
      try {
        await axios.delete(
          `http://localhost:8000/api/v1/customers/${customerId}`
        );
        setCustomers(
          customers.filter((customer) => customer._id !== customerId)
        );
        toast.success('Customer deleted successfully!');
      } catch (err) {
        console.error('Error deleting customer:', err);
        toast.error('Failed to delete customer.');
      }
    }
  };

  // Lọc danh sách khách hàng dựa trên email
  const filteredCustomers = customers.filter((customer) =>
    customer.email.toLowerCase().includes(searchEmail.toLowerCase())
  );

  return (
    <DashboardLayout activeMenu='Customers'>
      <div className='bg-gray-100/80 my-5 p-5 rounded-lg mx-auto'>
        <div className='flex justify-between items-center w-full'>
          <h2 className='text-2xl font-bold mb-4'>Customers</h2>

          {/* Thanh tìm kiếm */}
          <div className='flex items-center bg-white p-2 mb-4 text-black rounded-lg'>
            <input
              type='text'
              placeholder='Search by email'
              value={searchEmail}
              onChange={(e) => setSearchEmail(e.target.value)}
              className='w-full outline-none bg-transparent'
            />
            <CiSearch className='text-xl' />
          </div>
        </div>

        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p className='text-red-500'>{error}</p>
        ) : (
          <div className='overflow-x-auto'>
            <table className='min-w-full bg-white border border-gray-200 text-sm sm:text-base'>
              <thead>
                <tr>
                  <th className='px-2 sm:px-4 py-2 border'>Name</th>
                  <th className='px-2 sm:px-4 py-2 border'>Email</th>
                  <th className='px-2 sm:px-4 py-2 border'>Phone</th>
                  <th className='px-2 sm:px-4 py-2 border'>Address</th>
                  <th className='px-2 sm:px-4 py-2 border'>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredCustomers.map((customer) => (
                  <tr
                    key={customer._id}
                    className='hover:bg-gray-100 text-center'
                  >
                    <td className='px-2 sm:px-4 py-2 border'>
                      {customer.name}
                    </td>
                    <td className='px-2 sm:px-4 py-2 border'>
                      {customer.email}
                    </td>
                    <td className='px-2 sm:px-4 py-2 border'>
                      {customer.phone}
                    </td>
                    <td className='px-2 sm:px-4 py-2 border'>
                      {customer.address}
                    </td>
                    <td className='px-2 sm:px-4 py-2 border'>
                      <button
                        className='text-blue-500 hover:text-blue-700 mr-2'
                        onClick={() => handleViewCustomer(customer)}
                      >
                        <FiEye className='inline-block w-5 h-5' />
                      </button>
                      <button
                        className='text-red-500 hover:text-red-700'
                        onClick={() => handleDeleteCustomer(customer._id)}
                      >
                        <FiTrash className='inline-block w-5 h-5' />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {showModal && selectedCustomer && (
          <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-y-auto'>
            <div className='bg-white p-5 rounded-lg shadow-lg w-full max-w-4xl mx-4 sm:w-3/4 md:w-2/3 lg:w-1/2 max-h-screen overflow-y-auto'>
              <h2 className='text-xl font-bold mb-4'>Customer Details</h2>
              <p>
                <strong>Name:</strong> {selectedCustomer.name}
              </p>
              <p>
                <strong>Email:</strong> {selectedCustomer.email}
              </p>
              <p>
                <strong>Phone:</strong> {selectedCustomer.phone}
              </p>
              <p>
                <strong>Address:</strong> {selectedCustomer.address}
              </p>
              <div className='flex flex-col sm:flex-row justify-end mt-4'>
                <button
                  className='bg-red-500 text-white px-4 py-2 rounded-md mb-2 sm:mb-0 sm:mr-2'
                  onClick={closeModal}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Customer;
