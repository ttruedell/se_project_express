require("dotenv").config();

const express = require("express");

const mongoose = require("mongoose");

const cors = require("cors");

const { errors } = require("celebrate");

const routes = require("./routes/index");

const app = express();
const { PORT = 3001 } = process.env;

const errorHandler = require("./middlewares/error-handler");

const { requestLogger, errorLogger } = require("./middlewares/logger");

mongoose.set("strictQuery", true);

mongoose
  .connect("mongodb://127.0.0.1:27017/wtwr_db", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to DB");
  })
  .catch(console.error);

app.use(cors());

app.use(express.json());

app.use(requestLogger);
app.get("/crash-test", () => {
  setTimeout(() => {
    throw new Error("Server will crash now");
  }, 0);
});

app.use("/", routes);

app.use(errorLogger);

app.use(errors());

app.use(errorHandler);

app
  .listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  })
  .on("error", (error) => {
    console.error("Server failed to start:", error.message);
  });

// mongoose.set("strictQuery", true);
