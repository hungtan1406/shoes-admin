import React, { useEffect, useState } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import axios from 'axios';
import { toast } from 'react-toastify';

const Customer = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [showModal, setShowModal] = useState(false);

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

  return (
    <DashboardLayout activeMenu='Customers'>
      <div className='bg-gray-100/80 my-5 p-5 rounded-lg mx-auto'>
        <h2 className='text-2xl font-bold mb-4'>Customers</h2>

        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p className='text-red-500'>{error}</p>
        ) : (
          <div className='overflow-x-auto'>
            <table className='min-w-full bg-white border border-gray-200'>
              <thead>
                <tr>
                  <th className='px-4 py-2 border'>Name</th>
                  <th className='px-4 py-2 border'>Email</th>
                  <th className='px-4 py-2 border'>Phone</th>
                  <th className='px-4 py-2 border'>Address</th>
                  <th className='px-4 py-2 border'>Actions</th>
                </tr>
              </thead>
              <tbody>
                {customers.map((customer) => (
                  <tr
                    key={customer._id}
                    className='hover:bg-gray-100 text-center'
                  >
                    <td className='px-4 py-2 border'>{customer.name}</td>
                    <td className='px-4 py-2 border'>{customer.email}</td>
                    <td className='px-4 py-2 border'>{customer.phone}</td>
                    <td className='px-4 py-2 border'>{customer.address}</td>
                    <td className='px-4 py-2 border'>
                      <button
                        className='bg-blue-500 text-white px-2 py-1 rounded-md mr-2'
                        onClick={() => handleViewCustomer(customer)}
                      >
                        View
                      </button>
                      <button
                        className='bg-red-500 text-white px-2 py-1 rounded-md'
                        onClick={() => handleDeleteCustomer(customer._id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {showModal && selectedCustomer && (
          <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
            <div className='bg-white p-5 rounded-lg shadow-lg w-1/2'>
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
              <div className='flex justify-end mt-4'>
                <button
                  className='bg-red-500 text-white px-4 py-2 rounded-md'
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
