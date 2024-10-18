const express = require("express");

const mongoose = require("mongoose");

const userRoutes = require("./controllers/user");
const clothingItemRoutes = require("./controllers/clothingItem");

const { PORT = 3001 } = process.env;
const app = express();

app.use(express.json());
app.use("/", userRoutes);
app.use("/", clothingItemRoutes);

mongoose.connect("mongodb://127.0.0.1:27017/wtwr_db"),
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
    .then(() => {
      app.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}`);
      });
    })
    .catch((err) => console.error(err));
