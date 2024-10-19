const express = require("express");

const mongoose = require("mongoose");

// const userRoutes = require("./controllers/users");
// const clothingItemRoutes = require("./controllers/clothingItems");

const routes = require("./routes");

const { PORT = 3002 } = process.env;
const app = express();

app.use(express.json());
// app.use("/users", userRoutes);
// app.use("/items", clothingItemRoutes);
app.use("/api", routes);

mongoose
  .connect("mongodb://127.0.0.1:27017/wtwr_db", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => console.error(err));
