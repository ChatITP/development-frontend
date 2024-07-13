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
      }
    } else {
      // redirect to login
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
