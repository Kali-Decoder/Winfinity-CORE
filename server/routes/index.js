const express = require("express");
const {
  registerUser,
  depositAmount,
  getLeaderboard,
  withdrawAmount,
  getAllGames,
  addGame,
} = require("../controllers/userController");

const router = express.Router();

// User Routes
router.post("/users/register", registerUser);
router.post("/users/deposit", depositAmount);
router.get("/leaderboard", getLeaderboard);
router.post("/users/withdraw", withdrawAmount);

// Game Routes
router.get("/games", getAllGames);
router.post("/games", addGame);

module.exports = router;
