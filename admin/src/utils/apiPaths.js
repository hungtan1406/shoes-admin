export const BASE_URL = 'http://localhost:8000';

//utils/apiPaths.js
export const API_PATHS = {
  AUTH: {
    LOGIN: '/api/v1/auth/login',
    REGISTER: '/api/v1/auth/register',
    GET_USER_INFO: '/api/v1/auth/getUser',
    UPDATE_PROFILE: '/api/v1/auth/update',
  },
  IMAGE: {
    UPLOAD_IMAGE: '/api/v1/auth/upload-image',
  },
  PRODUCTS: {
    ADD: '/api/v1/products/add',
    GET_ALL: '/api/v1/products/get-all',
  },
  CATEGORY: {
    CREATE_CATEGORY: '/api/v1/categories/create-category',
    GET_CATEGORIES: '/api/v1/categories/get-categories',
  },
  BRAND: {
    CREATE_CATEGORY: '/api/v1/brands/create-brand',
    GET_CATEGORIES: '/api/v1/brands/get-brands',
  },
  SIZE_RANGES: {
    CREATE_CATEGORY: '/api/v1/size-ranges/create-size-range',
    GET_CATEGORIES: '/api/v1/size-ranges/get-size-ranges',
  },
};
