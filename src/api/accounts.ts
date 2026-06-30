import apiClient from "./client";

export const getAccounts = async () => {
  try {
    const response = await apiClient.get(`/accounts`);
    return response.data.accounts;
  } catch (error) {
    console.error("Error fetching accounts:", error);
    throw error;
  }
};
