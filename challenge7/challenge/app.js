require("./instrument.js");
const express = require("express");
const app = express();
const port = process.env.PORT || 3000;
const routes = require("./routes/userRoutes");
const { Server } = require("socket.io");

const Sentry = require("@sentry/node");

app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");

// app.use(session({
//     secret: "secret",
//     resave: false,
//     saveUninitialized: true
// }))

app.get("/", (req, res) => {
  res.send("tes");
});

Sentry.setupExpressErrorHandler(app);

app.get("/error", (req, res) => {
  throw new Error("This is an error");
});
app.use((err, req, res, next) => {
  Sentry.captureException(err);

  res.status(err.status || 500).json({
    message: err.message || "Terjadi kesalahan pada server",
  });
});
app.use(routes);

const server = app.listen(port, () => {
  console.log(`Listening to port ${port}`);
});

const io = new Server(server);

io.on("connection", (socket) => {
  socket.on("sendNotification", (data) => {
    io.emit("notification", data);
  });
});
