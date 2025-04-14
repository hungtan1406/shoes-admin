import React, { useEffect, useState } from 'react';
import axios from 'axios';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { FiTrash } from 'react-icons/fi';
import { toast } from 'react-toastify';
const Reviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await axios.get(
          'http://localhost:8000/api/v1/products/reviews'
        ); // Gọi API
        console.log('API Response:', response.data); // Log dữ liệu trả về
        setReviews(Array.isArray(response.data) ? response.data : []); // Đảm bảo reviews là mảng
        setLoading(false);
      } catch (err) {
        setError(err.message || 'Failed to fetch reviews');
        setLoading(false);
      }
    };

    fetchReviews();
  }, []);

  const deleteReview = async (productId, reviewId) => {
    if (window.confirm('Are you sure you want to delete this review?')) {
      try {
        await axios.delete(
          `http://localhost:8000/api/v1/products/${productId}/reviews/${reviewId}`
        );
        setReviews((prevReviews) =>
          prevReviews.filter((review) => review._id !== reviewId)
        );
        toast.success('Review deleted successfully!');
      } catch (err) {
        console.error('Error deleting review:', err);
        toast.error('Failed to delete review.');
      }
    }
  };

  return (
    <DashboardLayout activeMenu='Reviews'>
      <div className='bg-gray-100/80 my-5 p-5 rounded-lg mx-auto'>
        <h2 className='text-2xl font-bold mb-4'>Product Reviews</h2>

        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p className='text-red-500'>{error}</p>
        ) : reviews.length === 0 ? (
          <p>No reviews found.</p>
        ) : (
          <div className='overflow-x-auto'>
            <table className='min-w-full bg-white border border-gray-200 text-sm sm:text-base'>
              <thead>
                <tr>
                  <th className='px-2 sm:px-4 py-2 border'>Product Name</th>
                  <th className='px-2 sm:px-4 py-2 border'>Customer Name</th>
                  <th className='px-2 sm:px-4 py-2 border'>Rating</th>
                  <th className='px-2 sm:px-4 py-2 border'>Comment</th>
                  <th className='px-2 sm:px-4 py-2 border'>Date</th>
                  <th className='px-2 sm:px-4 py-2 border'>Actions</th>
                </tr>
              </thead>
              <tbody>
                {reviews.map((review) => (
                  <tr
                    key={review._id}
                    className='hover:bg-gray-100 text-center'
                  >
                    <td className='px-2 sm:px-4 py-2 border'>
                      {review.productName}
                    </td>
                    <td className='px-2 sm:px-4 py-2 border'>{review.name}</td>
                    <td className='px-2 sm:px-4 py-2 border'>
                      {review.rating} / 5
                    </td>
                    <td className='px-2 sm:px-4 py-2 border'>
                      {review.comment}
                    </td>
                    <td className='px-2 sm:px-4 py-2 border'>
                      {new Date(review.createdAt).toLocaleDateString()}
                    </td>
                    <td className='px-2 sm:px-4 py-2 border'>
                      <button
                        onClick={() =>
                          deleteReview(review.productId, review._id)
                        }
                        className='bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600'
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
      </div>
    </DashboardLayout>
  );
};

export default Reviews;
