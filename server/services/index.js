const User = require("../models/user.model");

const createUser = async (address) => {
  const existingUser = await User.findOne({ wallet_address: address });
  if (existingUser) return existingUser;

  const user = new User({ wallet_address: address });
  return await user.save();
};

const getUserByAddress = async (address) => {
  return await User.findOne({ wallet_address: address });
};

const getOrCreateUser = async (address) => {
  const user = await getUserByAddress(address);
  if (user) return user;
  return await createUser(address);
};

module.exports = { createUser, getUserByAddress, getOrCreateUser };
