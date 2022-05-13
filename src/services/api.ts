import axios from "axios";
const token = process.env.NEXT_PUBLIC_STRAPI_TOKEN;

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_URL_SERVER,
  headers: {'Authorization': `Bearer ${token}`}
}
);