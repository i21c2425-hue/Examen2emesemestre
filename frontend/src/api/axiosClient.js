import axios from 'axios';

// client axios centralise, comme ca je change l'URL du backend a un seul endroit
const axiosClient = axios.create({
  baseURL: 'http://localhost:5000/api'
});

export default axiosClient;
