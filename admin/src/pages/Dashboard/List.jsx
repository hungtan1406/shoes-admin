import React, { useEffect, useState } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import axios from 'axios';
import { toast } from 'react-toastify';

const List = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false); // For toggling the modal
  const [selectedProduct, setSelectedProduct] = useState(null); // For storing the selected product
  const [formData, setFormData] = useState({
    name: '',
    sku: '',
    price: '',
    category: '',
    brand: '',
    stock: '',
    description: '',
    images: [],
  });

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(
          'http://localhost:8000/api/v1/products/get-all'
        );
        setProducts(response.data.products || response.data); // Adjust based on API response
        setLoading(false);
      } catch (err) {
        console.error('Error fetching products:', err);
        setError('Failed to fetch products');
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleUpdateClick = (product) => {
    setSelectedProduct(product); // Set the selected product
    setFormData({
      name: product.name,
      sku: product.sku,
      price: product.price,
      category: product.category,
      brand: product.brand,
      stock: product.stock,
      description: product.description || '',
      images: product.images || [],
    });
    setShowModal(true); // Show the modal
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleImageChange = (e) => {
    setFormData({ ...formData, images: Array.from(e.target.files) });
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    try {
      const formDataToSend = new FormData();
      formDataToSend.append('name', formData.name);
      formDataToSend.append('sku', formData.sku);
      formDataToSend.append('price', formData.price);
      formDataToSend.append('category', formData.category);
      formDataToSend.append('brand', formData.brand);
      formDataToSend.append('stock', formData.stock);
      formDataToSend.append('description', formData.description);
      formData.images.forEach((image) => {
        formDataToSend.append('images', image);
      });

      await axios.put(
        `http://localhost:8000/api/v1/products/update/${selectedProduct._id}`,
        formDataToSend,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      toast.success('Product updated successfully!');
      setShowModal(false);
      setProducts((prevProducts) =>
        prevProducts.map((product) =>
          product._id === selectedProduct._id
            ? { ...product, ...formData }
            : product
        )
      );
    } catch (err) {
      console.error('Error updating product:', err);
      toast.error('Failed to update product.');
    }
  };

  const handleDelete = async (productId) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await axios.delete(
          `http://localhost:8000/api/v1/products/delete/${productId}`
        );
        setProducts(products.filter((product) => product._id !== productId));
        toast.success('Product deleted successfully!');
      } catch (err) {
        console.error('Error deleting product:', err);
        toast.error('Failed to delete product.');
      }
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedProduct(null);
  };

  return (
    <DashboardLayout activeMenu='List Products'>
      <div className='bg-gray-100/80 my-5 p-5 rounded-lg mx-auto'>
        <h2 className='text-2xl font-bold mb-4'>Product List</h2>

        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p className='text-red-500'>{error}</p>
        ) : (
          <div className='overflow-x-auto'>
            <table className='min-w-full bg-white border border-gray-200'>
              <thead>
                <tr>
                  <th className='px-4 py-2 border'>Image</th>
                  <th className='px-4 py-2 border'>Name</th>
                  <th className='px-4 py-2 border'>SKU</th>
                  <th className='px-4 py-2 border'>Price</th>
                  <th className='px-4 py-2 border'>Category</th>
                  <th className='px-4 py-2 border'>Brand</th>
                  <th className='px-4 py-2 border'>Stock</th>
                  <th className='px-4 py-2 border'>Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr
                    key={product._id}
                    className='hover:bg-gray-100 text-center'
                  >
                    <td className='px-4 py-2 border flex justify-center'>
                      {product.images && product.images.length > 0 ? (
                        <img
                          src={`http://localhost:8000/${product.images[0].replace(
                            /\\/g,
                            '/'
                          )}`}
                          alt={product.name}
                          className='w-16 h-16 object-cover rounded-md'
                        />
                      ) : (
                        <span>No Image</span>
                      )}
                    </td>
                    <td className='px-4 py-2 border'>{product.name}</td>
                    <td className='px-4 py-2 border'>{product.sku}</td>
                    <td className='px-4 py-2 border'>${product.price}</td>
                    <td className='px-4 py-2 border'>{product.category}</td>
                    <td className='px-4 py-2 border'>{product.brand}</td>
                    <td className='px-4 py-2 border'>{product.stock}</td>
                    <td className='px-4 py-2 border'>
                      <button
                        className='bg-blue-500 text-white px-2 py-1 rounded-md mr-2'
                        onClick={() => handleUpdateClick(product)}
                      >
                        Update
                      </button>
                      <button
                        className='bg-red-500 text-white px-2 py-1 rounded-md'
                        onClick={() => handleDelete(product._id)}
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

        {/* Update Modal */}
        {showModal && (
          <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
            <div className='bg-white p-5 rounded-lg shadow-lg w-1/2'>
              <h2 className='text-xl font-bold mb-4'>Update Product</h2>
              <form onSubmit={handleUpdateSubmit}>
                <div className='mb-4'>
                  <label className='block text-sm font-medium'>Name</label>
                  <input
                    type='text'
                    name='name'
                    value={formData.name}
                    onChange={handleInputChange}
                    className='w-full p-2 border rounded-md'
                    required
                  />
                </div>
                <div className='mb-4'>
                  <label className='block text-sm font-medium'>SKU</label>
                  <input
                    type='text'
                    name='sku'
                    value={formData.sku}
                    onChange={handleInputChange}
                    className='w-full p-2 border rounded-md'
                    required
                  />
                </div>
                <div className='mb-4'>
                  <label className='block text-sm font-medium'>Price</label>
                  <input
                    type='number'
                    name='price'
                    value={formData.price}
                    onChange={handleInputChange}
                    className='w-full p-2 border rounded-md'
                    required
                  />
                </div>
                <div className='mb-4'>
                  <label className='block text-sm font-medium'>Category</label>
                  <input
                    type='text'
                    name='category'
                    value={formData.category}
                    onChange={handleInputChange}
                    className='w-full p-2 border rounded-md'
                    required
                  />
                </div>
                <div className='mb-4'>
                  <label className='block text-sm font-medium'>Brand</label>
                  <input
                    type='text'
                    name='brand'
                    value={formData.brand}
                    onChange={handleInputChange}
                    className='w-full p-2 border rounded-md'
                    required
                  />
                </div>
                <div className='mb-4'>
                  <label className='block text-sm font-medium'>Stock</label>
                  <input
                    type='number'
                    name='stock'
                    value={formData.stock}
                    onChange={handleInputChange}
                    className='w-full p-2 border rounded-md'
                    required
                  />
                </div>
                <div className='mb-4'>
                  <label className='block text-sm font-medium'>
                    Description
                  </label>
                  <textarea
                    name='description'
                    value={formData.description}
                    onChange={handleInputChange}
                    className='w-full p-2 border rounded-md'
                    rows='3'
                  ></textarea>
                </div>
                <div className='mb-4'>
                  <label className='block text-sm font-medium'>Images</label>
                  <input
                    type='file'
                    name='images'
                    multiple
                    onChange={handleImageChange}
                    className='w-full p-2 border rounded-md'
                  />
                </div>
                <div className='flex justify-end'>
                  <button
                    type='button'
                    className='bg-gray-500 text-white px-4 py-2 rounded-md mr-2'
                    onClick={handleCloseModal}
                  >
                    Cancel
                  </button>
                  <button
                    type='submit'
                    className='bg-blue-500 text-white px-4 py-2 rounded-md'
                  >
                    Update
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default List;
