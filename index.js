// ================= LOAD ENV =================
require("dotenv").config();

// ================= IMPORTS =================
const { faker } = require("@faker-js/faker");
const mysql = require("mysql2");
const express = require("express");
const path = require("path");
const methodOverride = require("method-override");

// ================= APP INIT =================
const app = express();
const port = process.env.PORT || 8080;

// ================= MIDDLEWARE =================
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));

// ================= DATABASE =================
const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

// 🔥 DB CONNECT CHECK
connection.connect((err) => {
  if (err) {
    console.log("❌ DB Connection Failed:", err.message);
    return;
  }
  console.log("✅ MySQL Connected Successfully");
});

// ================= ROUTES =================

// HOME
app.get("/", (req, res) => {
  const Q = "SELECT COUNT(*) AS total FROM usersW";
  connection.query(Q, (err, result) => {
    if (err) return res.send("❌ DB Error");
    res.render("home", { countt: result[0].total });
  });
});

// SHOW USERS
app.get("/user", (req, res) => {
  const Q = "SELECT id, username, email, COLLEGE_NAME FROM usersW";
  connection.query(Q, (err, userss) => {
    if (err) return res.send("❌ DB Error");
    res.render("show-users", { userss });
  });
});

// ADD USER FORM
app.get("/user/new", (req, res) => {
  res.render("add-user");
});

// ADD USER POST
app.post("/user", (req, res) => {
  const { username, email, password, COLLEGE_NAME } = req.body;

  const id = faker.string.uuid();

  const Q =
    "INSERT INTO usersW (id, username, email, password, COLLEGE_NAME) VALUES (?, ?, ?, ?, ?)";

  connection.query(
    Q,
    [id, username, email, password, COLLEGE_NAME || ""],
    (err) => {
      if (err) {
        console.log("Insert Error:", err);
        return res.send("❌ Insert failed (maybe duplicate email)");
      }
      res.redirect("/user");
    }
  );
});

// EDIT USER
app.get("/user/:id/edit", (req, res) => {
  const { id } = req.params;

  const Q = "SELECT * FROM usersW WHERE id = ?";

  connection.query(Q, [id], (err, result) => {
    if (err || result.length === 0)
      return res.send("❌ User not found");
    res.render("edit", { usrr: result[0] });
  });
});

// UPDATE USER (PASSWORD CHECK)
app.patch("/user/:id", (req, res) => {
  const { id } = req.params;
  const { username, email, password, COLLEGE_NAME } = req.body;

  const checkQ = "SELECT password FROM usersW WHERE id = ?";

  connection.query(checkQ, [id], (err, result) => {
    if (err || result.length === 0)
      return res.send("❌ User not found");

    if (result[0].password !== password)
      return res.send("❌ Wrong password");

    const updateQ =
      "UPDATE usersW SET username = ?, email = ?, COLLEGE_NAME = ? WHERE id = ?";

    connection.query(
      updateQ,
      [username, email, COLLEGE_NAME || "", id],
      (err) => {
        if (err) return res.send("❌ Update failed");
        res.redirect("/user");
      }
    );
  });
});

// DELETE USER
app.delete("/user/:id", (req, res) => {
  const { id } = req.params;
  const { email, password } = req.body;

  const checkQ = "SELECT email, password FROM usersW WHERE id = ?";

  connection.query(checkQ, [id], (err, result) => {
    if (err || result.length === 0)
      return res.send("❌ User not found");

    if (
      result[0].email !== email ||
      result[0].password !== password
    ) {
      return res.send("❌ Email or password wrong");
    }

    const delQ = "DELETE FROM usersW WHERE id = ?";

    connection.query(delQ, [id], (err) => {
      if (err) return res.send("❌ Delete failed");
      res.redirect("/user");
    });
  });
});

// ================= SERVER =================
app.listen(port, () => {
  console.log(`🚀 Server running on http://localhost:${port}`);
});