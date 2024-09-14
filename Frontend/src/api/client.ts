import axios from "axios";

const baseURL = import.meta.env.VITE_BASEURL!;

const client = axios.create({ baseURL });

export default client;
