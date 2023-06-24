const express = require("express");
const session = require("express-session");
const router = express.Router();

const users = [
  { username: "user1", password: "password1" },
  { username: "admin", password: "admin" },
];

router.get("/login", (req, res) => {
  res.render("pages/login");
});

router.post("/login", (req, res) => {
  const { username, password } = req.body;
  const user = users.find(
    (user) => user.username === username && user.password === password
  );
  if (user) {
    req.session.user = user;
    res.redirect("/");
  } else {
    res.redirect("/");
  }
});

router.get("/logout", (req, res) => {
  req.session.destroy();
  res.redirect("/");
});

module.exports = router;
