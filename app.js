const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const cors = require("cors");
const passport = require("passport");
const mongoose = require("mongoose");

const app = express();
const PORT = 3000;
const users = require("./routes/users");
const dbConfig = require("./config/database");

// #region Database config
mongoose.connect(dbConfig.database);

mongoose.connection.on("connected", () => {
	console.log("Connected to database: " + dbConfig.database);
});

mongoose.connection.on("error", (err) => {
	console.log("Something failed while connecting to the DB: " + err);
});
// #endregion

//Allow outside domain calls
app.use(cors());

//Body parser middleware
app.use(bodyParser.json());

//Set static folder
app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
	res.send("<h1>Hello world!</h1>");
});

app.use("/users", users);

//Server init in PORT
app.listen(PORT, () => {
	console.log("Server started on port " + PORT);
});
