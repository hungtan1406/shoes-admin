import React, { useEffect, useState } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import axios from 'axios';
import { toast } from 'react-toastify';
import { FiEye, FiTrash } from 'react-icons/fi';
import { CiSearch } from 'react-icons/ci';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [status, setStatus] = useState('');
  const [searchEmail, setSearchEmail] = useState(''); // State cho tìm kiếm email
  const [sortOrder, setSortOrder] = useState('asc'); // State cho chế độ sắp xếp

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/v1/orders');
        setOrders(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching orders:', err);
        setError('Failed to fetch orders');
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const handleViewOrder = (order) => {
    setSelectedOrder(order);
    setStatus(order.status);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedOrder(null);
  };

  const handleDeleteOrder = async (orderId) => {
    if (window.confirm('Are you sure you want to delete this order?')) {
      try {
        await axios.delete(`http://localhost:8000/api/v1/orders/${orderId}`);
        setOrders(orders.filter((order) => order._id !== orderId));
        toast.success('Order deleted successfully!');
      } catch (err) {
        console.error('Error deleting order:', err);
        toast.error('Failed to delete order.');
      }
    }
  };

  const handleUpdateStatus = async () => {
    if (!selectedOrder) return;

    try {
      const response = await axios.put(
        `http://localhost:8000/api/v1/orders/${selectedOrder._id}`,
        { status }
      );
      const updatedOrder = response.data.order;

      // Update the orders state with the updated order
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order._id === updatedOrder._id ? updatedOrder : order
        )
      );

      toast.success('Order status updated successfully!');
      closeModal();
    } catch (err) {
      console.error('Error updating order status:', err);
      toast.error('Failed to update order status.');
    }
  };

  // Hàm chuẩn hóa giá trị tiền tệ
  const normalizeAmount = (value) => {
    if (!value) return 0; // Trả về 0 nếu giá trị không tồn tại
    return parseInt(value.replace(/[^\d]/g, ''), 10); // Loại bỏ ký tự không phải số
  };

  // Hàm định dạng giá trị tiền tệ
  const formatCurrency = (value) => {
    if (!value || isNaN(value)) {
      return 'N/A'; // Trả về "N/A" nếu giá trị không hợp lệ
    }
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(value);
  };

  // Lọc danh sách đơn hàng dựa trên email
  const filteredOrders = orders.filter((order) =>
    order.customer?.email.toLowerCase().includes(searchEmail.toLowerCase())
  );

  // Hàm sắp xếp danh sách đơn hàng
  const sortOrders = (orders, order) => {
    return [...orders].sort((a, b) => {
      const totalA = normalizeAmount(a.totalAmount);
      const totalB = normalizeAmount(b.totalAmount);

      if (order === 'asc') {
        return totalA - totalB; // Sắp xếp tăng dần
      } else {
        return totalB - totalA; // Sắp xếp giảm dần
      }
    });
  };

  // Danh sách đơn hàng đã sắp xếp
  const sortedOrders = sortOrders(filteredOrders, sortOrder);

  return (
    <DashboardLayout activeMenu='Orders'>
      <div className='bg-gray-100/80 my-5 p-5 rounded-lg mx-auto'>
        <div className='flex justify-between items-center w-full'>
          <h2 className='text-2xl font-bold mb-4'>Orders</h2>

          <div className='flex gap-2'>
            {/* Thanh tìm kiếm */}
            <div className='flex items-center bg-white px-2 py-3 mb-4 text-black rounded-lg'>
              <input
                type='text'
                placeholder='Search by email'
                value={searchEmail}
                onChange={(e) => setSearchEmail(e.target.value)}
                className='w-full outline-none bg-transparent'
              />
              <CiSearch className='text-xl' />
            </div>
            {/* Select sắp xếp */}
            <div className='flex justify-end mb-4'>
              <select
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
                className=' text-gray-400 px-3 py-3 rounded-md'
              >
                <option value=''>Sort by Total</option>
                <option value='asc'>Ascending</option>
                <option value='desc'>Descending</option>
              </select>
            </div>
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
                  <th className='px-2 sm:px-4 py-2 border'>Customer</th>
                  <th className='px-2 sm:px-4 py-2 border'>Email</th>
                  <th className='px-2 sm:px-4 py-2 border'>Phone</th>
                  <th className='px-2 sm:px-4 py-2 border'>Total</th>
                  <th className='px-2 sm:px-4 py-2 border'>Status</th>
                  <th className='px-2 sm:px-4 py-2 border'>Actions</th>
                </tr>
              </thead>
              <tbody>
                {sortedOrders.map((order) => (
                  <tr key={order._id} className='hover:bg-gray-100 text-center'>
                    <td className='px-2 sm:px-4 py-2 border'>
                      {order.customer?.name || 'Customer details unavailable'}
                    </td>
                    <td className='px-2 sm:px-4 py-2 border'>
                      {order.customer?.email || 'N/A'}
                    </td>
                    <td className='px-2 sm:px-4 py-2 border'>
                      {order.customer?.phone || 'N/A'}
                    </td>
                    <td className='px-2 sm:px-4 py-2 border'>
                      {formatCurrency(normalizeAmount(order.totalAmount))}
                    </td>
                    <td className='px-2 sm:px-4 py-2 border'>{order.status}</td>
                    <td className='px-2 sm:px-4 py-2 border'>
                      <button
                        className='text-blue-500 hover:text-blue-700 mr-2'
                        onClick={() => handleViewOrder(order)}
                      >
                        <FiEye className='inline-block w-5 h-5' />
                      </button>
                      <button
                        className='text-red-500 hover:text-red-700'
                        onClick={() => handleDeleteOrder(order._id)}
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

        {showModal && selectedOrder && (
          <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-y-auto'>
            <div className='bg-white p-5 rounded-lg shadow-lg w-full max-w-4xl mx-4 sm:w-3/4 md:w-2/3 lg:w-1/2 max-h-screen overflow-y-auto'>
              <h2 className='text-xl font-bold mb-4'>Order Details</h2>
              <p>
                <strong>Customer:</strong> {selectedOrder.customer.name}
              </p>
              <p>
                <strong>Email:</strong> {selectedOrder.customer.email}
              </p>
              <p>
                <strong>Phone:</strong> {selectedOrder.customer.phone}
              </p>
              <p>
                <strong>Address:</strong> {selectedOrder.customer.address}
              </p>
              <p>
                <strong>Total Amount:</strong> ${selectedOrder.totalAmount}
              </p>
              <p>
                <strong>Status:</strong>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className='ml-2 p-1 border rounded-md'
                >
                  <option value='Pending'>Pending</option>
                  <option value='Processing'>Processing</option>
                  <option value='Shipped'>Shipped</option>
                  <option value='Delivered'>Delivered</option>
                  <option value='Cancelled'>Cancelled</option>
                </select>
              </p>
              <h3 className='text-lg font-bold mt-4'>Order Items</h3>
              <ul className='list-disc pl-5'>
                {selectedOrder.orderItems.map((item, index) => (
                  <li key={index}>
                    {item.product
                      ? `${item.product.name} - ${item.quantity} x ${item.price}`
                      : 'Product details unavailable'}
                  </li>
                ))}
              </ul>
              <div className='flex flex-col sm:flex-row justify-end mt-4'>
                <button
                  className='bg-red-500 text-white px-4 py-2 rounded-md mb-2 sm:mb-0 sm:mr-2'
                  onClick={closeModal}
                >
                  Close
                </button>
                <button
                  className='bg-blue-500 text-white px-4 py-2 rounded-md'
                  onClick={handleUpdateStatus}
                >
                  Update Status
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Orders;
