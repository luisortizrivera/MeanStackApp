const express = require("express");
const router = express.Router();
const User = require("../models/user");
const jwt = require("jsonwebtoken");
const dbConfig = require("../config/database");

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
router.post("/authenticate", async (req, res, next) => {
	const username = req.body.username;
	const password = req.body.password;
	try {
		const user = await User.getUserByUsername(username);
		if (!user) return res.json({ success: false, msg: "User not found" });
		User.comparePassword(password, user.password, (err, isMatch) => {
			if (err) throw err;
			if (isMatch) {
				const token = jwt.sign({ data: user }, dbConfig.secret, {
					expiresIn: 604800,
				});
				res.json({
					success: true,
					token: "JWT " + token,
					user: {
						id: user._id,
						name: user.name,
						username: user.username,
						email: user.email,
					},
				});
			} else return res.json({ success: false, msg: "Wrong password" });
		});
	} catch (error) {
		console.error(error);
		throw error;
	}
});

//Profile
router.get("/profile", (req, res, next) => {
	res.send("<h1>PROFILE</h1>");
});

module.exports = router;
