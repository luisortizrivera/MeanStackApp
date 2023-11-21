const express = require("express");
const router = express.Router();
const User = require("../models/user");
const jwt = require("jsonwebtoken");
const dbConfig = require("../config/database");
const passport = require("passport");

//Register
router.post("/register", (req, res, next) => {
	let newUser = new User({
		name: req.body.name,
		email: req.body.email,
		username: req.body.username,
		password: req.body.password,
	});

	User.addUser(newUser, (err, user) => {
		if (err) {
			if (err.name === "ValidationError")
				return res.status(400).json({ message: err.message });
			return res.json({
				success: false,
				msg: "Failed to register user",
				err: err,
			});
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
		res.json({ success: false, message: error.message });
	}
});

//Profile
router.get(
	"/profile",
	passport.authenticate("jwt", { session: false }),
	(req, res, next) => {
		res.json({ user: req.user });
	}
);

router.delete(
	"/delete",
	passport.authenticate("jwt", { session: false }),
	async (req, res, next) => {
		try {
			const user = await User.deleteUser(req.query.id);
			if (user) res.json({ msg: "User deleted successfully", User: user });
			else res.json({ msg: "User not found" });
		} catch (error) {
			console.error(error);
			res.json({ success: false, message: error.message });
		}
	}
);

router.get(
	"/list",
	passport.authenticate("jwt", { session: false }),
	async (req, res, next) => {
		try {
			const users = await User.getUsers();
			if (users && users.length > 0)
				res.json({ msg: "Users listed successfully", Users: users });
			else res.json({ msg: "No users found" });
		} catch (error) {
			console.error(error);
			res.json({ success: false, message: error.message });
		}
	}
);

module.exports = router;
