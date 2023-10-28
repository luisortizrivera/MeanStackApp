const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const config = require("../config/database");
const { ExtractJwt } = require("passport-jwt");

//User schema
const UserSchema = mongoose.Schema({
	name: {
		type: String,
	},
	email: {
		type: String,
		required: true,
	},
	username: {
		type: String,
	},
	password: {
		type: String,
		required: true,
	},
});

const User = (module.exports = mongoose.model("User", UserSchema));

module.exports.getUserById = function (id, callback) {
	User.findById(id, callback);
};

module.exports.getUserByUsername = function (username, callback) {
	const query = { username: username };
	User.findOne(query, callback);
};

module.exports.addUser = function (newUser, callback) {
	const validationError = validateNewUserFields(newUser);
	if (validationError) return callback(validationError);

	bcrypt.genSalt(10, (err, salt) => {
		if (err) return callback(err);
		bcrypt.hash(newUser.password, salt, (err, hash) => {
			if (err) return callback(err);
			newUser.password = hash;
			newUser.save(callback);
		});
	});
};

function validateNewUserFields(newUser) {
	const paths = User.schema.paths;
	const requiredFields = Object.keys(paths).filter(
		(field) => paths[field].isRequired
	);
	const missingFields = requiredFields.filter(
		(field) => !Object.keys(newUser.toObject()).includes(field)
	);
	if (missingFields.length) {
		const missingFieldsMsg = `Please fill in all required fields: ${missingFields.join(
			", "
		)}`;
		return {
			name: "ValidationError",
			message: missingFieldsMsg,
		};
	}
}

//get users
module.exports.getUsers = function (callback, limit) {
	User.find(callback).limit(limit);
};
