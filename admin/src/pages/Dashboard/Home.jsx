import React, { useEffect, useState } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import axios from 'axios';

const Home = () => {
  const [metrics, setMetrics] = useState({
    totalOrders: 0,
    totalRevenue: 0,
    totalCustomers: 0,
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Fetch metrics
        const metricsResponse = await axios.get(
          'http://localhost:8000/api/v1/orders/dashboard/metrics'
        );

        // Fetch recent orders
        const ordersResponse = await axios.get(
          'http://localhost:8000/api/v1/orders/recent'
        );

        // Fetch products
        const productsResponse = await axios.get(
          'http://localhost:8000/api/v1/products/get-all'
        );

        console.log('Products API Response:', productsResponse.data);

        // If the response is wrapped in an object, extract the products array
        setMetrics(metricsResponse.data);
        setRecentOrders(ordersResponse.data);
        setProducts(productsResponse.data.products || []);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError('Failed to fetch dashboard data');
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <DashboardLayout activeMenu='Dashboard'>
      <div className='bg-gray-100/80 my-5 p-5 rounded-lg mx-auto'>
        <h2 className='text-2xl font-bold mb-4'>Dashboard</h2>

        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p className='text-red-500'>{error}</p>
        ) : (
          <>
            {/* Metrics Section */}
            <div className='grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6'>
              <div className='bg-white p-4 rounded-lg shadow-md'>
                <h3 className='text-lg font-bold'>Total Orders</h3>
                <p className='text-2xl font-semibold'>{metrics.totalOrders}</p>
              </div>
              <div className='bg-white p-4 rounded-lg shadow-md'>
                <h3 className='text-lg font-bold'>Total Revenue</h3>
                <p className='text-2xl font-semibold'>
                  {metrics.totalRevenue.toFixed(2)}
                </p>
              </div>
              <div className='bg-white p-4 rounded-lg shadow-md'>
                <h3 className='text-lg font-bold'>Total Customers</h3>
                <p className='text-2xl font-semibold'>
                  {metrics.totalCustomers}
                </p>
              </div>
            </div>

            {/* Recent Orders Section */}
            <div className='bg-white p-4 rounded-lg shadow-md mb-6'>
              <h3 className='text-lg font-bold mb-4'>Recent Orders</h3>
              <div className='overflow-x-auto'>
                <table className='min-w-full bg-white border border-gray-200'>
                  <thead>
                    <tr>
                      <th className='px-4 py-2 border'>Customer</th>
                      <th className='px-4 py-2 border'>Total</th>
                      <th className='px-4 py-2 border'>Status</th>
                      <th className='px-4 py-2 border'>Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentOrders.map((order) => (
                      <tr
                        key={order._id}
                        className='hover:bg-gray-100 text-center'
                      >
                        <td className='px-4 py-2 border'>
                          {order.customer?.name || 'N/A'}
                        </td>
                        <td className='px-4 py-2 border'>
                          {order.totalAmount}
                        </td>
                        <td className='px-4 py-2 border'>{order.status}</td>
                        <td className='px-4 py-2 border'>
                          {new Date(order.createdAt).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Product Information Section */}
            <div className='bg-white p-4 rounded-lg shadow-md'>
              <h3 className='text-lg font-bold mb-4'>Product Information</h3>
              <div className='overflow-x-auto'>
                <table className='min-w-full bg-white border border-gray-200'>
                  <thead>
                    <tr>
                      <th className='px-4 py-2 border'>Name</th>
                      <th className='px-4 py-2 border'>SKU</th>
                      <th className='px-4 py-2 border'>Price</th>
                      <th className='px-4 py-2 border'>Stock</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Array.isArray(products) &&
                      products.map((product) => (
                        <tr
                          key={product._id}
                          className='hover:bg-gray-100 text-center'
                        >
                          <td className='px-4 py-2 border'>{product.name}</td>
                          <td className='px-4 py-2 border'>{product.sku}</td>
                          <td className='px-4 py-2 border'>{product.price}</td>
                          <td className='px-4 py-2 border'>{product.stock}</td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Home;
