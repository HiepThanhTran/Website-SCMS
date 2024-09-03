import { CardElement, Elements, useElements, useStripe } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import React, { useState } from 'react';
import { authAPI, endpoints } from '../../configs/APIs';

const stripePromise = loadStripe(
   'pk_test_51O41qGBy1BulLKF8k8qu0rqhO2HoDtOLogY9Yh757QmeFJvjTrj5o96LDJpJ4GWR6CNtEWe6K8aO0SrdV5P5UdfZ00mPyk9MSy',
);

const CheckoutForm = () => {
   const stripe = useStripe();
   const elements = useElements();
   const [amount, setAmount] = useState('');
   const [error, setError] = useState(null);

   const handleSubmit = async (event) => {
      event.preventDefault();

      if (!stripe || !elements) {
         return;
      }

      try {
         const form = new FormData();
         form.append('amount', amount);
         const response = await authAPI().post(endpoints.charge, form);
         const { clientSecret, error: serverError } = await response.data;

         if (serverError) {
            setError(serverError);
            return;
         }

         const { error: stripeError } = await stripe.confirmCardPayment(clientSecret, {
            payment_method: {
               card: elements.getElement(CardElement),
               billing_details: {
                  name: 'Customer Name',
               },
            },
         });

         if (stripeError) {
            setError(stripeError.message);
         } else {
            // Thanh toán thành công
         }
      } catch (error) {
         setError('An error occurred: ' + error.message);
      }
   };

   return (
      <form onSubmit={handleSubmit} style={{ marginTop: '120px', padding: '30px' }}>
         <div>
            <label>
               Amount (USD):
               <input type="text" value={amount} onChange={(e) => setAmount(e.target.value)} />
            </label>
         </div>
         <div>
            <CardElement />
         </div>
         <button type="submit" disabled={!stripe}>
            Submit
         </button>
         {error && <div>{error}</div>}
      </form>
   );
};

const Checkout = () => (
   <Elements
      stripe={stripePromise}
      options={{ clientSecret: 'pi_3PucQ3By1BulLKF80MN4qRpO_secret_TT8pnPEC7TI2yW5PzBnD2cJnu' }}
   >
      <CheckoutForm />
   </Elements>
);

export default Checkout;
