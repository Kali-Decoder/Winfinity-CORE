const express = require("express");
const app = express();
const dotenv = require("dotenv");
dotenv.config();
const PORT = process.env.PORT || 5000;
const cors = require("cors");
const { getOrCreateUser } = require("./services/index.js");
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: false }));
require("./db/connection.js");


app.use(async (req, res, next) => {
    const userAddress = req.headers['x-user-address'];
    
    if (!userAddress) {
      return res.status(401).json({ error: 'Authentication required' });
    }
    // In a real app, you would verify signatures here
    console.log(userAddress,"USERaDDRESS");
    await getOrCreateUser(userAddress);
    req.body.userAddress = userAddress;
    next();
  });
  
app.use("/winfinity",require("./routes"));
app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});