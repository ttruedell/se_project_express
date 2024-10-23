const express = require("express");

const mongoose = require("mongoose");

// const routes = require("./routes");
const userRouter = require("./routes/users");
const clothingItemRouter = require("./routes/clothingItems");

const app = express();
const { PORT = 3001 } = process.env;

app.use(express.json());

mongoose
  .connect("mongodb://127.0.0.1:27017/wtwr_db", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to DB");
  })
  .catch(console.error);

app.use("/", userRouter);
app.use("/", clothingItemRouter);

// 6718a6038b82c033ac9ab404
app.use((req, res, next) => {
  req.user = {
    _id: "6718a6038b82c033ac9ab404",
  };
  next();
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

mongoose.set("strictQuery", true);

module.exports.createClothingItem = (req, res) => {
  console.log(req.user._id); // _id will become accessible
};
