const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

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

module.exports.getUserByEmail = function (email) {
	const query = { email: email };
	return User.findOne(query).exec();
};

module.exports.addUser = async function (newUser, callback) {
	try {
		const validationError = await validateNewUserFields(newUser);
		if (validationError) return callback(validationError);

		const salt = await bcrypt.genSalt(10);
		const hash = await bcrypt.hash(newUser.password, salt);
		newUser.password = hash;
		await newUser.save();
		callback(null, newUser);
	} catch (err) {
		callback(err);
	}
};

async function validateNewUserFields(newUser) {
	const paths = User.schema.paths;
	const requiredFields = Object.keys(paths).filter(
		(field) => paths[field].isRequired
	);
	const userFields = Object.keys(newUser.toObject());
	const missingFields = requiredFields.filter(
		(field) => !userFields.includes(field)
	);

	if (missingFields.length > 0) {
		return {
			name: "ValidationError",
			message: `Please fill in all required fields: ${missingFields.join(
				", "
			)}`,
		};
	}
	if (await module.exports.getUserByEmail(newUser.email)) {
		return {
			name: "ValidationError",
			message: "An user with the same email already exists",
		};
	}
	return null;
}

//get users
module.exports.getUsers = function (callback, limit) {
	User.find(callback).limit(limit);
};
