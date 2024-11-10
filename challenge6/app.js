if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

require("dotenv").config();

const express = require("express");
const router = require("./routes/imageRouter");
const app = express();
const port = process.env.PORT || 3000;

app.use("/", router);

app.listen(port, (req, res) => {
  console.log(`Port ${port} sedang berjalan`);
});
