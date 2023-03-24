import axios from 'axios';
import { showAlert } from './alerts';

export const updateSettings = async (data, type) => {
  const path = type === 'password' ? 'updateMyPassword' : 'updateMe';

  try {
    const res = await axios({
      method: 'PATCH',
      url: `http://127.0.0.1:3000/api/v1/users/${path}`,
      data,
    });

    if (res.data.status === 'success') {
      showAlert('success', `${type.toUpperCase()} updated uccessfully!`);
    }
  } catch (error) {
    showAlert('error', error.response.data.message);
  }
};
