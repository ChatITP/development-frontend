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
      // try refreshing the access token
      let refreshTokenRes;
      try {
        refreshTokenRes = await refreshAccessToken();
      } catch (error) {
        if (
          axios.isAxiosError(refreshTokenRes) &&
          (refreshTokenRes.status === 401 || refreshTokenRes.status === 403)
        ) {
          // redirect to login
          throw new Error('redirect to login');
        } else {
          throw error;
        }
      }
      // retry the request
      try {
        response = await axios({
          method,
          url,
          data,
          withCredentials: true,
        });
      } catch (error) {
        throw error;
      }
    } else if (axios.isAxiosError(error) && error?.response?.status === 401) {
      throw new Error('redirect to login');
    } else {
      throw error;
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
