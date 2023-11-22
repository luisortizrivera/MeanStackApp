const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const cors = require("cors");
const passport = require("passport");
const mongoose = require("mongoose");
const session = require("express-session");
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

//Passport middleware
app.use(
	session({
		secret: "Cicada3301",
		resave: true,
		saveUninitialized: true,
	})
);
app.use(passport.initialize());
app.use(passport.session());

require("./config/passport")(passport);

//Set static folder
app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
	res.send("<h1>Only REST API</h1>");
});

app.use("/users", users);

app.get("*", (req, res) => {
	res.sendFile(path.join(__dirname, "public/index.html"));
});

//Server init in PORT
app.listen(PORT, () => {
	console.log("Server started on port " + PORT);
});
