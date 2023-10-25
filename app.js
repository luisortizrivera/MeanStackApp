const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const cors = require("cors");
const passport = require("passport");
const mongoose = require("mongoose");

const app = express();
const PORT = 3000;
const users = require("./routes/users");

//Allow outside domain calls
app.use(cors());

//Body parser middleware
app.use(bodyParser.json());

app.get("/", (req, res) => {
	res.send("<h1>Hello world!</h1>");
});

app.use("/users", users);

//Server init in PORT
app.listen(PORT, () => {
	console.log("Server started on port " + PORT);
});
