const express = require("express");
const app = express();
const port = 3000;
const routes = require('./routes/userRoutes');

app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");

// app.use(session({
//     secret: "secret",
//     resave: false,
//     saveUninitialized: true
// }))

app.get("/", (req,res) => {
    res.send("Halooooo");
});

app.use(routes);


app.listen(port, () => {
    console.log(`Listening to port ${port}`);
});