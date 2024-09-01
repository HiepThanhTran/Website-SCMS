import axios from 'axios';
import cookie from 'react-cookies';

const SERVER_CONTEXT = '/harmony';
const SERVER = 'http://localhost:8080';

export const endpoints = {
   login: `${SERVER_CONTEXT}/api/users/login`,
   register: `${SERVER_CONTEXT}/api/users/register`,
   confirm: `${SERVER_CONTEXT}/api/users/confirm`,
   roles: `${SERVER_CONTEXT}/api/users/roles`,
   profileUser: `${SERVER_CONTEXT}/api/users/profile`,
   updateProfileUser: `${SERVER_CONTEXT}/api/users/profile/update`,
   deleteProfileUser: `${SERVER_CONTEXT}/api/users/profile/delete`,

   getCart: `${SERVER_CONTEXT}/api/cart`,
   addProductToCart: `${SERVER_CONTEXT}/api/cart/product/add`,
   updateProductInCart: (productId) => `${SERVER_CONTEXT}/api/cart/product/${productId}/update`,
   removeProductFromCart: (productId) => `${SERVER_CONTEXT}/api/cart/product/${productId}/remove`,
   clearCart: `${SERVER_CONTEXT}/api/cart/product/clear`,

   customers: `${SERVER_CONTEXT}/api/customers`,
   getCustomer: (customerId) => `${SERVER_CONTEXT}/api/customers/${customerId}`,
   profileCustomer: `${SERVER_CONTEXT}/api/customers/profile`,
   updateProfileCustomer: `${SERVER_CONTEXT}/api/customers/profile/update`,

   suppliers: `${SERVER_CONTEXT}/api/suppliers`,
   getSupplier: (supplierId) => `${SERVER_CONTEXT}/api/suppliers/${supplierId}`,
   profileSupplier: `${SERVER_CONTEXT}/api/suppliers/profile`,
   updateProfileSupplier: `${SERVER_CONTEXT}/api/suppliers/profile/update`,
   getRatingsOfSupplier: (supplierId) => `${SERVER_CONTEXT}/api/suppliers/${supplierId}/ratings`,
   addRatingForSupplier: (supplierId) => `${SERVER_CONTEXT}/api/suppliers/${supplierId}/rating/add`,

   shippers: `${SERVER_CONTEXT}/api/shippers`,
   getShipper: (shipperId) => `${SERVER_CONTEXT}/api/shippers/${shipperId}`,
   profileShipper: `${SERVER_CONTEXT}/api/shippers/profile`,
   updateProfileShipper: `${SERVER_CONTEXT}/api/shippers/profile/update`,

   products: `${SERVER_CONTEXT}/api/products`,
   getProduct: (productId) => `${SERVER_CONTEXT}/api/products/${productId}`,
   categories: `${SERVER_CONTEXT}/api/categories`,
   tags: `${SERVER_CONTEXT}/api/tags`,
   taxes: `${SERVER_CONTEXT}/api/taxes`,
   units: `${SERVER_CONTEXT}/api/units`,
   ratings: `${SERVER_CONTEXT}/api/ratings`,
   getRating: (ratingId) => `${SERVER_CONTEXT}/api/ratings/${ratingId}`,

   invoices: `${SERVER_CONTEXT}/api/invoices`,
   orders: `${SERVER_CONTEXT}/api/orders`,
   checkout: `${SERVER_CONTEXT}/api/orders/checkout`,
   checkin: `${SERVER_CONTEXT}/api/orders/checkin`,
   cancelOrder: (orderId) => `${SERVER_CONTEXT}/api/orders/${orderId}/cancel`,
   updateStatusOrder: (orderId) => `${SERVER_CONTEXT}/api/orders/${orderId}/status`,
};

export default axios.create({
   baseURL: SERVER,
});

export const authAPI = () => {
   return axios.create({
      baseURL: SERVER,
      headers: {
         Authorization: cookie.load('token'),
      },
   });
};
