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

router.post("/register", UserControllers.register);
router.post("/login", UserControllers.login);
router.post("/forgetPassword", UserControllers.forgetPassword);

module.exports = router;
