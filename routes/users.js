const express = require("express");
const router = express.Router();
const User = require("../models/user");
const passport = require("passport");
const jwt = require("jsonwebtoken");

//Register
router.post("/register", (req, res, next) => {
	let newUser = new User({
		name: req.body.name,
		email: req.body.email,
		surname: req.body.surname,
		password: req.body.password,
	});

	User.addUser(newUser, (err, user) => {
		if (err) {
			if (err.name === "ValidationError")
				return res.status(400).json({ message: err.message });
			return res.json({ success: false, msg: "Failed to register user" });
		} else return res.json({ success: true, msg: "User registered", user });
	});
});

//Authenticate
router.post("/authenticate", (req, res, next) => {
	res.send("<h1>AUTHENTICATE</h1>");
});

//Profile
router.get("/profile", (req, res, next) => {
	res.send("<h1>PROFILE</h1>");
});

module.exports = router;
