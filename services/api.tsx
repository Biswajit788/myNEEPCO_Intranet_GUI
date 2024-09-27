import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

//Function to register new user to Strapi
export const registerUser = async (userData: {
  firstname: string;
  lastname: string;
  username: string;
  dob: string;
  email: string;
  password: string;
}) => {
  try {
    const response = await axios.post(`${API_URL}/api/auth/local/register`, {
      username: userData.username,
      email: userData.email,
      password: userData.password,
      firstname: userData.firstname,
      lastname: userData.lastname,
      dob: userData.dob,
    }, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    return response.data;
  } catch (error: any) {
    if (error.response && error.response.data && error.response.data.error) {
      const errorMessage = error.response.data.error.message || 'Registration failed';
      throw new Error(errorMessage);
    } else {
      throw new Error('An unknown error occurred during registration.');
    }
  }
};

const getToken = () => {
  return localStorage.getItem('token');
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

export const fetchAccolades = async () => {
  const response = await axios.get(`${API_URL}/api/accolades?populate=File&sort=id:desc`, {
    headers: getHeaders(),
  });
  return response.data;
};

export const fetchUpdates = async () => {
  const response = await axios.get(`${API_URL}/api/updates?populate=File&sort=id:desc`, {
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

export const fetchDailyGenerationReport = async (date: string) => {
  try {
    const response = await axios.get(`${API_URL}/api/daily-generations`, {
      params: { date },
      headers: getHeaders(),
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error;
  }
};

export const fetchMonthlyGenerationReport = async (month: string, year: string) => {
  try {
    const response = await axios.get(`${API_URL}/api/monthly-generations`, {
      params: { month, year },
      headers: getHeaders(),
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error;
  }
};

export const fetchAnnualGenerationReport = async (year: string) => {
  try {
    const response = await axios.get(`${API_URL}/api/annual-generations`, {
      params: { year },
      headers: getHeaders(),
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error;
  }
};

export const fetchIsoPdf = async () => {
  const response = await fetch(`${API_URL}/api/isos?populate=File`, {
    headers: getHeaders(),
  });
  const data = await response.json();
  return data;
};

export const fetchDopRules = async () => {
  try {
    const response = await axios.get(`${API_URL}/api/dop-rules?populate[0]=File&populate[1]=File1`, {
      headers: getHeaders(),
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching DoP rules:', error);
    throw error;
  }
};

export const fetchDisposalRules = async () => {
  try {
    const response = await axios.get(`${API_URL}/api/disposal-rules?populate[0]=File&populate[1]=File1`, {
      headers: getHeaders(),
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching DoP rules:', error);
    throw error;
  }
};

export const fetchCpRules = async () => {
  try {
    const response = await axios.get(`${API_URL}/api/cp-rules?populate[0]=File&populate[1]=File1`, {
      headers: getHeaders(),
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching DoP rules:', error);
    throw error;
  }
};
