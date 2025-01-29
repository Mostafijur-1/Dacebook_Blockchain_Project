export const fetchUserProfile = async (contract, address) => {
  return await contract.getUserProfile(address);
};

export const fetchUserPosts = async (contract, address) => {
  return await contract.getUserPosts(address);
};
