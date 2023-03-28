import axios from 'axios';
import { showAlert } from './alerts';

export const bookTour = async (tourId) => {
  const stripe = Stripe(
    'pk_test_51MqdlzDJChTnZRe4OUICjJj138YpEIExKO0v1ffiD6ZI8muBxwQLwepkGwQ1uaDh3mn9GAjizhQ9AZWv6L2hK8vC00uBnR5fgQ'
  );
  try {
    // 1) Get checkout session from API
    const session = await axios(
      `http://127.0.0.1:3000/api/v1/bookings//checkout-session/${tourId}`
    );
    // 2) Create checkout form + charge credit card
    await stripe.redirectToCheckout({
      sessionId: session.data.session.id,
    });
  } catch (error) {
    console.log(err);
    showAlert('error', err);
  }
};
