const express = require("express");
const session = require('express-session');
const app = express();
const http = require("http").Server(app);
const io = require("socket.io")(http);
const port = 5000;

app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + "/public"));
app.use(express.urlencoded({ extended: true }));
app.use(session({
  secret: 'secret-key',
  resave: false,
  saveUninitialized: true
}));

app.get('/', (req, res) => {
  const user = req.session.user;
  if (user) {
    res.render("pages/dashboard", { user, title: "หน้าหลัก" });
  } else {
    res.render("pages/login");
  }
});

const clientRouter = require("./routes/client");
app.use("/client", clientRouter);

const reportRouter = require("./routes/report")(io);
app.use("/report", reportRouter);

http.listen(port, () => {
  console.log(`📦 API has been started. 🚀`);
  console.log(`📦 Started at http://localhost:${port} 🌏`);
});

module.exports = app;