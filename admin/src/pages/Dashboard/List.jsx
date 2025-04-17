import React, { useEffect, useState, useRef } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import axios from 'axios';
import { toast } from 'react-toastify';
import { FiCamera, FiXCircle, FiEdit, FiTrash } from 'react-icons/fi';
import { CiSearch } from 'react-icons/ci';
const List = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchName, setSearchName] = useState(''); // State cho tìm kiếm tên sản phẩm
  const [showModal, setShowModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
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
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

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

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files);
    setFormData((prev) => ({
      ...prev,
      images: [...prev.images, ...files],
    }));
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    setFormData((prev) => ({
      ...prev,
      images: [...prev.images, ...files],
    }));
  };

  const handleRemoveImage = (index) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
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

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchName.toLowerCase())
  );

  return (
    <DashboardLayout activeMenu='List Products'>
      <div className='bg-gray-100/80 my-5 p-5 rounded-lg mx-auto'>
        <div className='flex justify-between items-center w-full'>
          <h2 className='text-2xl font-bold mb-4'>Product List</h2>

          {/* Thanh tìm kiếm */}
          <div className='flex items-center bg-white p-2 mb-4 text-black rounded-lg'>
            <input
              type='text'
              placeholder='Search by product name'
              value={searchName}
              onChange={(e) => setSearchName(e.target.value)}
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
                  <th className='px-2 sm:px-4 py-2 border'>Image</th>
                  <th className='px-2 sm:px-4 py-2 border'>Name</th>
                  <th className='px-2 sm:px-4 py-2 border'>SKU</th>
                  <th className='px-2 sm:px-4 py-2 border'>Price</th>
                  <th className='px-2 sm:px-4 py-2 border'>Category</th>
                  <th className='px-2 sm:px-4 py-2 border'>Brand</th>
                  <th className='px-2 sm:px-4 py-2 border'>Stock</th>
                  <th className='px-2 sm:px-4 py-2 border'>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((product) => (
                  <tr
                    key={product._id}
                    className='hover:bg-gray-100 text-center'
                  >
                    <td className='px-2 sm:px-4 py-2 border flex justify-center'>
                      {product.images && product.images.length > 0 ? (
                        <img
                          src={`http://localhost:8000/${product.images[0].replace(
                            /\\/g,
                            '/'
                          )}`}
                          alt={product.name}
                          className='w-12 h-12 sm:w-16 sm:h-16 object-cover rounded-md'
                        />
                      ) : (
                        <span>No Image</span>
                      )}
                    </td>
                    <td className='px-2 sm:px-4 py-2 border'>{product.name}</td>
                    <td className='px-2 sm:px-4 py-2 border'>{product.sku}</td>
                    <td className='px-2 sm:px-4 py-2 border'>
                      {product.price}
                    </td>
                    <td className='px-2 sm:px-4 py-2 border'>
                      {product.category}
                    </td>
                    <td className='px-2 sm:px-4 py-2 border'>
                      {product.brand}
                    </td>
                    <td className='px-2 sm:px-4 py-2 border'>
                      {product.stock}
                    </td>
                    <td className='px-2 sm:px-4 py-2 border'>
                      <button
                        className='text-blue-500 hover:text-blue-700 mr-2'
                        onClick={() => handleUpdateClick(product)}
                      >
                        <FiEdit className='inline-block w-5 h-5' />
                      </button>
                      <button
                        className='text-red-500 hover:text-red-700'
                        onClick={() => handleDelete(product._id)}
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

        {/* Update Modal */}
        {showModal && (
          <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-y-auto'>
            <div className='bg-white p-5 rounded-lg shadow-lg w-full max-w-4xl mx-4 sm:w-3/4 md:w-2/3 lg:w-1/2 max-h-screen overflow-y-auto'>
              <h2 className='text-xl font-bold mb-4'>Update Product</h2>
              <form onSubmit={handleUpdateSubmit}>
                <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
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
                    <label className='block text-sm font-medium'>
                      Category
                    </label>
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
                  <div className='bg-white rounded-lg shadow p-6'>
                    <h2 className='text-lg font-semibold mb-4'>
                      Hình ảnh sản phẩm
                    </h2>

                    <div
                      className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer ${
                        isDragging
                          ? 'border-primary bg-primary'
                          : 'border-gray-300'
                      }`}
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      onDrop={handleDrop}
                      onClick={() => fileInputRef.current.click()}
                    >
                      <input
                        type='file'
                        multiple
                        ref={fileInputRef}
                        onChange={handleImageUpload}
                        className='hidden'
                        accept='image/*'
                      />

                      <FiCamera className='mx-auto h-12 w-12 text-gray-400' />
                      <div className='mt-2'>
                        <span className='text-sm font-medium text-black'>
                          Nhấp để tải lên
                        </span>{' '}
                        <span className='text-sm text-gray-500'>
                          hoặc kéo và thả
                        </span>
                      </div>
                      <p className='mt-1 text-xs text-gray-500'>
                        PNG, JPG, GIF tối đa 5MB (Tối đa 5 ảnh)
                      </p>
                    </div>

                    {formData.images.length > 0 && (
                      <div className='mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4'>
                        {formData.images.map((image, index) => (
                          <div key={index} className='relative group'>
                            <div className='aspect-w-1 aspect-h-1 w-full overflow-hidden rounded-lg bg-gray-100'>
                              <img
                                src={
                                  typeof image === 'string'
                                    ? `http://localhost:8000/${image.replace(
                                        /\\/g,
                                        '/'
                                      )}`
                                    : URL.createObjectURL(image)
                                }
                                alt={`Preview ${index + 1}`}
                                className='h-full w-full object-cover object-center'
                              />
                            </div>
                            <button
                              type='button'
                              onClick={() => handleRemoveImage(index)}
                              className='absolute -top-2 -right-2 bg-white rounded-full shadow'
                            >
                              <FiXCircle className='w-6 h-6 text-red-500' />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                <div className='flex justify-end'>
                  <button
                    type='button'
                    className='bg-red-500 text-white px-4 py-2 rounded-md mr-2'
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
