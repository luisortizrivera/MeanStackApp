const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const config = require("../config/database");

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

module.exports.addUser = async function (newUser, callback) {
	const validationError = validateNewUserFields(newUser);
	if (validationError) return callback(validationError);

	try {
		const salt = await bcrypt.genSalt(10);
		const hash = await bcrypt.hash(newUser.password, salt);
		newUser.password = hash;
		await newUser.save();
		callback(null, newUser);
	} catch (err) {
		callback(err);
	}
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
