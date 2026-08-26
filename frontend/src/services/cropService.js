import api from "./api";


const handleApiError = (error) => {

  console.error(
    "API Error:",
    error
  );


  if (error.response) {

    throw new Error(
      `Server Error: ${error.response.status}`
    );

  }


  if (error.request) {

    throw new Error(
      "Backend server is not reachable"
    );

  }


  throw new Error(
    "Something went wrong"
  );

};



export const getAllCrops = async () => {

  try {

    const response = await api.get(
      "crops/"
    );

    return response.data;


  } catch(error) {

    handleApiError(error);

  }

};



export const getStateSummary = async () => {

  try {

    const response = await api.get(
      "state-summary/"
    );

    return response.data;


  } catch(error) {

    handleApiError(error);

  }

};



export const getLeaderboards = async () => {

  try {

    const response = await api.get(
      "leaderboards/"
    );

    return response.data;


  } catch(error) {

    handleApiError(error);

  }

};



export const getDiversity = async () => {

  try {

    const response = await api.get(
      "diversity/"
    );

    return response.data;


  } catch(error) {

    handleApiError(error);

  }

};



export const getAlerts = async () => {

  try {

    const response = await api.get(
      "alerts/"
    );

    return response.data;


  } catch(error) {

    handleApiError(error);

  }

};
// ==========================================
// DATASET B — CROP PRODUCTION DATA
// ==========================================

export const getProductionData = async () => {

  try {

    const response = await api.get(
      "production/"
    );

    return response.data;

  } catch(error) {

    handleApiError(error);

  }

};


export const getProductionSummary = async () => {

  try {

    const response = await api.get(
      "production-summary/"
    );

    return response.data;

  } catch(error) {

    handleApiError(error);

  }

};