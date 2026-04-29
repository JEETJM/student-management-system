// const { faker } = require("@faker-js/faker");
// const mysql = require("mysql2");
// // Create the connection to database
// const connection = mysql.createConnection({
//   host: "localhost",
//   user: "root",
//   database: "NIT__COLLEGE",
//   password: "Jeet@2004JMMJ1904",
// });
// let query_is = "SHOW TABLES";
// let insrtt_data =
//   "INSERT INTO usersW(id ,username ,email ,password ) VALUES ( ?,?,?,?) ";
// let useR = [["12", "mjejt", "jm3821@gmail2.com", "JM@122d3"],
// ["120", "jeet", "jm21@gmail2.yahoo", "JM@12"],
// []];
// try {
//   connection.query( insrtt_data, useR, (err, results) => {
//     if (err) throw err;
//     console.log(results); // results contains rows returned by server
//     console.log("The Length of the array is : ", insrtt_data.length);
//     console.log(insrtt_data); // fields contains extra meta data about results, if available  IT'S A ARRAY.
//   });
// } catch (err) {
//   console.log(err);
// }
// connection.end();//for stop the connection
// let getrandomUser = () => {
//   return {
//     Id: faker.string.uuid(),
//     username: faker.internet.username(),
//     email: faker.internet.email(),
//     // avatar: faker.image.avatar(),
//     password: faker.internet.password(),
//     // birthdate: faker.date.birthdate(),
//     // registeredAt: faker.date.past(),
//   };
// };
// // console.log(getrandomUser());

// *************************************************************************************************************
//BULK DATA .
// const { faker } = require("@faker-js/faker");
// const mysql = require("mysql2");
// // Create the connection to database
// const connection = mysql.createConnection({
//   host: "localhost",
//   user: "root",
//   database: "NIT__COLLEGE",
//   password: "Jeet@2004JMMJ1904",
// });

// let getrandomUser = () => {
//   return [
//     faker.string.uuid(),
//     faker.internet.username(),
//     faker.internet.email(),
//     // avatar: faker.image.avatar(),
//     faker.internet.password(),
//     // birthdate: faker.date.birthdate(),
//     // registeredAt: faker.date.past(),
//   ];
// };
// let query_is = "SHOW TABLES";
// let insrtt_data =
//   "INSERT INTO usersW(id ,username ,email ,password ) VALUES ?  ";
// // let useR = [
// //   ["12", "mjejt", "jm3821@gmail2.com", "JM@122d3"],
// //   ["120", "jeet", "jm21@gmail2.yahoo", "JM@12"],
// //   [],
// // ];

// let data = [];
// for (let i = 1; i <= 200; i++) {
//   data.push(getrandomUser()); //10 random data gberate
// // }

// try {
//   connection.query(insrtt_data, [data], (err, results) => {
//     if (err) throw err;
//     console.log(results); // results contains rows returned by server
//     console.log("The Length of the array is : ", insrtt_data.length);
//     console.log(insrtt_data); // fields contains extra meta data about results, if available  IT'S A ARRAY.
//   });
// } catch (err) {
//   console.log(err);
// }
// connection.end(); //for stop the connection

// console.log(getrandomUser());

// ********************************************************************************************************************************
// create a app
const { faker } = require("@faker-js/faker");
const mysql = require("mysql2");
const express = require("express");
const path = require("path");
const methodOverride = require("method-override");

const app = express();
const port = 8080;

// ================= MIDDLEWARE =================
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));

// ================= DATABASE =================
const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "Jeet@2004JMMJ1904",
  database: "NIT__COLLEGE",
});

// ================= SERVER =================
app.listen(port, () => {
  console.log("✅ Server running on http://localhost:" + port);
});

// ================= HOME =================
app.get("/", (req, res) => {
  const Q = "SELECT COUNT(*) AS total FROM usersW";
  connection.query(Q, (err, result) => {
    if (err) return res.send("DB Error");
    res.render("home", { countt: result[0].total });
  });
});

// ================= SHOW USERS =================
app.get("/user", (req, res) => {
  const Q = "SELECT id, username, email, COLLEGE_NAME FROM usersW";
  connection.query(Q, (err, userss) => {
    if (err) return res.send("DB Error");
    res.render("show-users", { userss });
  });
});

// ================= ADD USER =================
app.get("/user/new", (req, res) => {
  res.render("add-user");
});

app.post("/user", (req, res) => {
  const { username, email, password, COLLEGE_NAME } = req.body;

  // Auto-generate id
  const id = faker.string.uuid();

  const Q =
    "INSERT INTO usersW (id, username, email, password, COLLEGE_NAME) VALUES (?, ?, ?, ?, ?)";

  connection.query(Q, [id, username, email, password, COLLEGE_NAME || ''], (err) => {
    if (err) {
      console.log("Insert Error:", err);
      return res.send("❌ Insert failed. Maybe email already exists or COLLEGE_NAME missing.");
    }
    res.redirect("/user");
  });
});

// ================= EDIT USER =================
app.get("/user/:id/edit", (req, res) => {
  const { id } = req.params;
  const Q = "SELECT * FROM usersW WHERE id = ?";

  connection.query(Q, [id], (err, result) => {
    if (err || result.length === 0) return res.send("User not found");
    res.render("edit", { usrr: result[0] });
  });
});

// ================= UPDATE (PASSWORD CHECK) =================
app.patch("/user/:id", (req, res) => {
  const { id } = req.params;
  const { username, email, password, COLLEGE_NAME } = req.body;

  const checkQ = "SELECT password FROM usersW WHERE id = ?";

  connection.query(checkQ, [id], (err, result) => {
    if (err || result.length === 0) return res.send("User not found");

    if (result[0].password !== password)
      return res.send("❌ Wrong password. Update denied");

    const updateQ =
      "UPDATE usersW SET username = ?, email = ?, COLLEGE_NAME = ? WHERE id = ?";

    connection.query(updateQ, [username, email, COLLEGE_NAME || '', id], (err) => {
      if (err) return res.send("Update failed");
      res.redirect("/user");
    });
  });
});

// ================= DELETE (EMAIL + PASSWORD CHECK) =================
app.delete("/user/:id", (req, res) => {
  const { id } = req.params;
  const { email, password } = req.body;

  const checkQ = "SELECT email, password FROM usersW WHERE id = ?";

  connection.query(checkQ, [id], (err, result) => {
    if (err || result.length === 0) return res.send("User not found");

    if (result[0].email !== email || result[0].password !== password) {
      return res.send("❌ Email or Password wrong. Delete denied");
    }

    const delQ = "DELETE FROM usersW WHERE id = ?";

    connection.query(delQ, [id], (err) => {
      if (err) return res.send("Delete failed");
      res.redirect("/user");
    });
  });
});

                                                                                                                                                                                                                                                                                                                                                                                                      