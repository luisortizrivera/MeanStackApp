const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const cors = require("cors");
const passport = require("passport");
const mongoose = require("mongoose");

const app = express();
const PORT = 3000;

app.get("/", (req, res) => {
	res.send("<h1>Hello world!</h1>");
});

app.listen(PORT, () => {
	console.log("Server started on port " + PORT);
});
