import axios from 'axios';

async function request(method: string, url: string, data?: any) {
  let response;
  try {
    response = await axios({
      method,
      url,
      data,
      withCredentials: true,
    });
  } catch (error) {
    if (axios.isAxiosError(error) && error?.response?.status === 403) {
      const refreshTokenRes = await refreshAccessToken();
      if (refreshTokenRes.status === 200) {
        response = await axios({
          method,
          url,
          data,
          withCredentials: true,
        });
      } else {
        // redirect to login
        throw new Error('Unauthorized');
      }
    } else if (axios.isAxiosError(error) && error?.response?.status === 401) {
      // redirect to login
      throw new Error('unauthenticated');
    } else {
      throw new Error('Unexpected error occured');
    }
  }
  return response;
}

async function refreshAccessToken() {
  return await axios.post('http://localhost:3001/user/refresh', null, {
    withCredentials: true,
  });
}
export { request };
