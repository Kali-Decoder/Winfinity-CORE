// Controller: userController.js
const Game = require("../models/game.model.js");
const User = require("../models/user.model.js");
const { createUser } = require("../services/index.js");

// Register User
const registerUser = async (req, res) => {
  try {
    const { userAddress } = req.body;
    const user = await createUser(userAddress);
    res.status(201).json({ message: "User registered successfully", user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getUser = async (req,res)=>{
  try {
    const { userAddress } = req.body;
    const user = await User.findOne({ wallet_address: userAddress });
    res.status(200).json(user)
  } catch (error) {
    console.log(error)
    res.status(500).json({
      error:"Not fetching user details"
    })
  }
}

// Deposit Amount
const depositAmount = async (req, res) => {
  try {
    const { userAddress,amount } = req.body;
    const user = await User.findOne({ wallet_address: userAddress });
    if (!user) return res.status(404).json({ message: "User not found" });

    user.total_deposit += Number(amount);
    user.total_staked += Number(amount);
    await user.save();

    res.json({
      message: "Deposit successful",
      total_deposit: user.total_deposit,
      total_staked: user.total_staked,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get Leaderboard
const getLeaderboard = async (req, res) => {
  try {
    const leaderboard = await User.find()
      .sort({ total_rewards_earned: -1 })
      .select("username wallet_address total_rewards_earned");
    res.json(leaderboard);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Withdraw Amount
const withdrawAmount = async (req, res) => {
  try {
    const { userAddress,amount } = req.body;
    const user = await User.findOne({ wallet_address:userAddress });
    if (!user) return res.status(404).json({ message: "User not found" });
    if (user.total_deposit < amount)
      return res.status(400).json({ message: "Insufficient balance" });
    user.total_deposit -= Number(amount);
    user.total_staked -= Number(amount);
    await user.save();
    res.json({
      message: "Withdrawal successful",
      remaining_balance: user.total_deposit,
      remaining_stake:user.total_staked
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get All Games
const getAllGames = async (req, res) => {
  try {
    const games = await Game.find();
    res.json(games);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Add Game
const addGame = async (req, res) => {
  try {
    const { name, description, deposit_amount } = req.body;
    const game = new Game({ name, description, deposit_amount });
    await game.save();
    res.status(201).json({ message: "Game added successfully", game });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  registerUser,
  depositAmount,
  getLeaderboard,
  withdrawAmount,
  getAllGames,
  addGame,
  getUser
};
