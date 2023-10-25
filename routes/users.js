const express = require("express");
const router = express.Router();

//Register
router.get("/register", (req, res, next) => {
	res.send("<h1>REGISTsER</h1>");
});

//Authenticate
router.get("/authenticate", (req, res, next) => {
	res.send("<h1>AUTHENTICATE</h1>");
});

//Profile
router.get("/profile", (req, res, next) => {
	res.send("<h1>PROFILE</h1>");
});

//Validate
router.get("/validate", (req, res, next) => {
	res.send("<h1>VALIDATE</h1>");
});

module.exports = router;
