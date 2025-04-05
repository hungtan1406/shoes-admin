import React, { useState, useRef } from 'react';
import axios from 'axios';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { toast } from 'react-toastify';
import { FiCamera, FiXCircle } from 'react-icons/fi';
const SHOE_SIZES = [35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46];

const MOCK_CATEGORIES = [
  { id: 1, name: 'Giày chạy bộ' },
  { id: 2, name: 'Giày thể thao' },
  { id: 3, name: 'Giày thời trang' },
  { id: 4, name: 'Giày bóng rổ' },
  { id: 5, name: 'Giày đá bóng' },
];

const MOCK_BRANDS = [
  { id: 1, name: 'Nike' },
  { id: 2, name: 'Adidas' },
  { id: 3, name: 'Puma' },
  { id: 4, name: 'New Balance' },
  { id: 5, name: 'Converse' },
  { id: 6, name: 'Vans' },
  { id: 7, name: 'Reebok' },
  { id: 8, name: 'Asics' },
  { id: 9, name: 'Under Armour' },
];

const AddProductForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    sku: '',
    price: '',
    brand: '',
    category: '',
    description: '',
  });
  const [sizeQuantities, setSizeQuantities] = useState(
    SHOE_SIZES.reduce((acc, size) => ({ ...acc, [size]: 0 }), {})
  );
  const [images, setImages] = useState([]);
  const [previewImages, setPreviewImages] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSizeChange = (e, size) => {
    const { value } = e.target;
    setSizeQuantities({ ...sizeQuantities, [size]: parseInt(value, 10) || 0 });
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
    handleImageUpload({ target: { files } });
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    setPreviewImages((prev) => [
      ...prev,
      ...files.map((file) => URL.createObjectURL(file)),
    ]);
    setImages((prev) => [...prev, ...files]);
  };

  const handleRemoveImage = (index) => {
    setPreviewImages((prev) => prev.filter((_, i) => i !== index));
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formDataToSend = new FormData();
    Object.keys(formData).forEach((key) => {
      formDataToSend.append(key, formData[key]);
    });
    formDataToSend.append('sizeQuantities', JSON.stringify(sizeQuantities));
    Array.from(images).forEach((image) => {
      formDataToSend.append('images', image);
    });

    try {
      const response = await axios.post(
        'http://localhost:8000/api/v1/products/add',
        formDataToSend,
        {
          headers: { 'Content-Type': 'multipart/form-data' },
        }
      );
      console.log(response.data);
      setFormData({
        name: '',
        sku: '',
        price: '',
        brand: '',
        category: '',
        description: '',
      });
      setSizeQuantities(
        SHOE_SIZES.reduce((acc, size) => ({ ...acc, [size]: 0 }), {})
      );
      setImages([]);
      setPreviewImages([]);
      toast.success('Product added successfully!');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error adding product');
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout activeMenu={'Add Product'}>
      <div className='bg-gray-100/80 my-3 p-5 rounded-lg mx-auto'>
        <h2 className='text-2xl font-bold mb-4'>Add New Product</h2>

        <form onSubmit={handleSubmit} className='space-y-4'>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <div>
              <label className='block text-sm font-medium'>Name</label>
              <input
                type='text'
                name='name'
                value={formData.name}
                onChange={handleInputChange}
                className='w-full mt-1 p-2 border rounded-md'
                required
              />
            </div>
            <div>
              <label className='block text-sm font-medium'>SKU</label>
              <input
                type='text'
                name='sku'
                value={formData.sku}
                onChange={handleInputChange}
                className='w-full mt-1 p-2 border rounded-md'
                required
              />
            </div>
            <div>
              <label className='block text-sm font-medium'>Price</label>
              <input
                type='number'
                name='price'
                value={formData.price}
                onChange={handleInputChange}
                className='w-full mt-1 p-2 border rounded-md'
                required
              />
            </div>
            <div>
              <label className='block text-sm font-medium'>Category</label>
              <select
                name='category'
                value={formData.category}
                onChange={handleInputChange}
                className='w-full mt-1 p-2 border rounded-md'
                required
              >
                <option value='' disabled>
                  Select a category
                </option>
                {MOCK_CATEGORIES.map((category) => (
                  <option key={category.id} value={category.name}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className='block text-sm font-medium'>Brand</label>
              <select
                name='brand'
                value={formData.brand}
                onChange={handleInputChange}
                className='w-full mt-1 p-2 border rounded-md'
                required
              >
                <option value='' disabled>
                  Select a brand
                </option>
                {MOCK_BRANDS.map((brand) => (
                  <option key={brand.id} value={brand.name}>
                    {brand.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div>
            <label className='block text-sm font-medium mb-1'>
              Sizes and Quantities
            </label>
            <div className='grid grid-cols-3 gap-4'>
              {SHOE_SIZES.map((size) => (
                <div key={size}>
                  <label className='block text-sm font-medium'>
                    Size {size}
                  </label>
                  <input
                    type='number'
                    value={sizeQuantities[size]}
                    onChange={(e) => handleSizeChange(e, size)}
                    className='w-full mt-1 p-2 border rounded-md'
                    min='0'
                  />
                </div>
              ))}
            </div>
          </div>
          <div>
            <label className='block text-sm font-medium'>Description</label>
            <textarea
              name='description'
              value={formData.description}
              onChange={handleInputChange}
              className='w-full mt-1 p-2 border rounded-md'
              rows='4'
              required
            ></textarea>
          </div>
          <div className='bg-white rounded-lg shadow p-6'>
            <h2 className='text-lg font-semibold mb-4'>Hình ảnh sản phẩm</h2>

            <div
              className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer ${
                isDragging ? 'border-primary bg-primary' : 'border-gray-300'
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
                <span className='text-sm text-gray-500'>hoặc kéo và thả</span>
              </div>
              <p className='mt-1 text-xs text-gray-500'>
                PNG, JPG, GIF tối đa 5MB (Tối đa 5 ảnh)
              </p>
            </div>

            {previewImages.length > 0 && (
              <div className='mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4'>
                {previewImages.map((preview, index) => (
                  <div key={index} className='relative group'>
                    <div className='aspect-w-1 aspect-h-1 w-full overflow-hidden rounded-lg bg-gray-100'>
                      <img
                        src={preview}
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
          <button
            type='submit'
            className='w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700'
            disabled={loading}
          >
            {loading ? 'Adding...' : 'Add Product'}
          </button>
        </form>
      </div>
    </DashboardLayout>
  );
};

export default AddProductForm;
