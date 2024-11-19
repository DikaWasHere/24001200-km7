const express = require("express");
const UserControllers = require("../controllers/userControllers");
const router = express.Router();

router.get("/register", (req, res) => {
  res.render("register");
});

router.get("/login", (req, res) => {
  res.render("login");
});

router.get("/forgetPassword", (req, res) => {
  res.render("forgetPassword");
});

router.get("/reset-password", (req, res) => {
  const token = req.query.token;
  if (!token) {
    return res.status(400).send("Token tidak valid atau kadaluarsa");
  }
  res.render("resetPassword", { token });
});

router.post("/register", UserControllers.register);
router.post("/login", UserControllers.login);
router.post("/forgetPassword", UserControllers.forgetPassword);
router.post("/reset-password", UserControllers.resetPassword);

module.exports = router;
