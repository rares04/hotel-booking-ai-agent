import axios from 'axios'

const axiosInstance = axios.create({
  baseURL: "https://api.liteapi.travel/v3.0",
  headers: {
    "accept": "application/json",
    "content-type": "application/json",
    "X-API-Key": process.env.LITEAPI_API_KEY
  }
});
  
export default axiosInstance;