const express = require("express");

const mongoose = require("mongoose");

const routes = require("./routes/index");
const { createUser } = require("./controllers/users");

const app = express();
const { PORT = 3001 } = process.env;

mongoose
  .connect("mongodb://127.0.0.1:27017/wtwr_db", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to DB");
  })
  .catch(console.error);

app.use(express.json());

// app.use((req, res, next) => {
//   req.user = {
//     _id: "6718a6038b82c033ac9ab404",
//   };
//   next();
// });

app.use("/", routes);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

mongoose.set("strictQuery", true);
