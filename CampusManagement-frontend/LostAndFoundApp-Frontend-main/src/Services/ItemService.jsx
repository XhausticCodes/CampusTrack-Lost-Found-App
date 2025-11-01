import axios from "axios";

const BASE_URL = "http://localhost:9999/lost-found";

export const getAllLostItems = () => axios.get(`${BASE_URL}/lost-items`);
export const getLostItemsByUser = () => axios.get(`${BASE_URL}/lost-items/user`);
export const getLostItemById = (id) => axios.get(`${BASE_URL}/lost-items/${id}`);
export const lostItemSubmission = (lostItem) => axios.post(`${BASE_URL}/lost-items`, lostItem);
export const deleteLostItemById = (id) => axios.delete(`${BASE_URL}/lost-items/${id}`);

export const getAllFoundItems = () => axios.get(`${BASE_URL}/found-items`);
export const getFoundItemsByUser = () => axios.get(`${BASE_URL}/found-items/user`);
export const getFoundItemById = (id) => axios.get(`${BASE_URL}/found-items/${id}`);
export const foundItemSubmission = (foundItem) => axios.post(`${BASE_URL}/found-items`, foundItem);
export const deleteFoundItemById = (id) => axios.delete(`${BASE_URL}/found-items/${id}`);

export const getMatchingFoundItems = (lostItemId, threshold = 0.7) =>
  axios.get(`${BASE_URL}/fuzzy/match/found/${lostItemId}?threshold=${threshold}`);

export const getMatchingLostItems = (foundItemId, threshold = 0.7) =>
    axios.get(`${BASE_URL}/fuzzy/match/lost/${foundItemId}?threshold=${threshold}`);

export const searchFoundItems = (query, username, threshold = 0.3) =>
  axios.get(`${BASE_URL}/fuzzy/search/found?query=${encodeURIComponent(query)}&username=${username}&threshold=${threshold}`);

export const searchLostItems = (query, username, threshold = 0.3) =>
  axios.get(`${BASE_URL}/fuzzy/search/lost?query=${encodeURIComponent(query)}&username=${username}&threshold=${threshold}`);