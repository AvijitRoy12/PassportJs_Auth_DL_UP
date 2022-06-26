const express = require("express");
const app = express();
const { connectMongoose, User } = require("./database.js");
const ejs = require("ejs");
const passport = require("passport");
const { initializingPassport, isAuthenticated } = require("./passportConfig");
const expressSession = require("express-session");
const { Router } = require("express");

//Database Connection
connectMongoose();

//Passport Authentication Enabled
initializingPassport(passport);

app.use(express.json());
app.use(
  expressSession({ secret: "secret", resave: false, saveUninitialized: false })
);
app.use(passport.initialize());
app.use(passport.session());

app.set("view engine", "ejs");

app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

//CRUD
app.get("/", (req, res) => {
  res.render("index");
});

app.get("/register", (req, res) => {
  res.render("register");
});

app.get("/login", (req, res) => {
  res.render("login");
});

app.post("/register", async (req, res) => {
  const user = await User.findOne({ username: req.body.username });
  if (user) return res.status(400).send("User already exists");

  const newUser = await User.create(req.body);

  res.status(201).render("dashboard");
});

app.post(
  "/login",
  passport.authenticate("local", {
    failureRedirect: "/register",
    successRedirect: "/dashboard",
  })
);

app.get("/dashboard", isAuthenticated, (req, res) => {
  res.render("dashboard");
});

app.get("/logout", function (req, res) {
  req.logout((err) => {
    if (err) {
      return err;
    }
    res.redirect("/");
  });
});

app.listen(4000, () => {
  console.log("Server running on http://localhost:4000");
});
