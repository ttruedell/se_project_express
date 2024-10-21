const express = require("express");

const mongoose = require("mongoose");

const routes = require("./routes");

const { PORT = 3001 } = process.env;
const app = express();

app.use(express.json());
app.use("/api", routes);

mongoose
  .connect("mongodb://127.0.0.1:27017/wtwr_db")
  .then(() => {
    console.log("Connected to DB");
  })
  .catch(console.error);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

mongoose.set("strictQuery", true);
