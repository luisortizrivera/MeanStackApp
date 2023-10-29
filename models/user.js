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

module.exports.getUserByUsername = async function (username) {
	const query = { name: username };
	try {
		const user = await User.findOne(query);
		return user || null;
	} catch (error) {
		console.log("Error getting user by username");
		console.error(error);
		return null;
	}
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

module.exports.comparePassword = function (candidatePassword, hash, callback) {
	bcrypt.compare(candidatePassword, hash, (err, isMatch) => {
		if (err) throw err;
		callback(null, isMatch);
	});
};

//get users
module.exports.getUsers = function (callback, limit) {
	User.find(callback).limit(limit);
};
