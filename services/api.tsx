import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

// Function to retrieve the token from localStorage
const getToken = () => {
  return localStorage.getItem('token'); // Replace with your token storage mechanism
};

// Function to create headers with the Authorization token
const getHeaders = () => {
  const token = getToken();
  return {
    Authorization: `Bearer ${token}`,
  };
};

export const fetchDashboard = async () => {
  const response = await axios.get(`${API_URL}/dashboard`, {
    headers: getHeaders(),
  });
  return response.data;
};

export const fetchPromotions = async () => {
  const response = await axios.get(`${API_URL}/api/promotions?populate=File&sort=id:desc`, {
    headers: getHeaders(),
  });
  return response.data;
};

export const fetchTransfers = async () => {
  const response = await axios.get(`${API_URL}/api/transfers?populate=File&sort=id:desc`, {
    headers: getHeaders(),
  });
  return response.data;
};

export const fetchSeniorities = async () => {
  const response = await axios.get(`${API_URL}/api/seniorities?populate=File&sort=id:desc`, {
    headers: getHeaders(),
  });
  return response.data;
};

export const fetchCirculars = async () => {
  const response = await axios.get(`${API_URL}/api/circulars?populate=File&sort=id:desc`, {
    headers: getHeaders(),
  });
  return response.data;
};

export const fetchVigilance = async () => {
  const response = await axios.get(`${API_URL}/api/vigilances?populate[File1][populate]=*&populate[File2][populate]=*&sort=id:desc`, {
    headers: getHeaders(),
  });
  return response.data;
};

export const fetchTraining = async () => {
  const response = await axios.get(`${API_URL}/api/trainings?populate=File&sort=id:desc`, {
    headers: getHeaders(),
  });
  return response.data;
};

export const fetchIncrement = async () => {
  const response = await axios.get(`${API_URL}/api/increments?populate=File&sort=id:desc`, {
    headers: getHeaders(),
  });
  return response.data;
};

export const fetchScaleBenefit = async () => {
  const response = await axios.get(`${API_URL}/api/scale-benefits?populate=File&sort=id:desc`, {
    headers: getHeaders(),
  });
  return response.data;
};

export const fetchForms = async () => {
  const response = await axios.get(`${API_URL}/api/forms?populate=File&sort=id:desc`, {
    headers: getHeaders(),
  });
  return response.data;
};
