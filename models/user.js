const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

//User schema
const UserSchema = mongoose.Schema({
	name: {
		type: String,
		required: true,
	},
	email: {
		type: String,
		required: true,
	},
	username: {
		type: String,
		default: function () {
			return this.name;
		},
	},
	password: {
		type: String,
		required: true,
	},
});

const User = (module.exports = mongoose.model("User", UserSchema));

module.exports.getUserById = async function (id) {
	try {
		const result = await User.findById(id);
		return result;
	} catch (error) {
		console.log("Error searching for user by id");
		console.error(error);
		return null;
	}
};

module.exports.getUserByUsername = async function (username) {
	const query = { username: username };
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

module.exports.deleteUser = async function (id) {
	const query = { _id: id };
	try {
		const result = await User.deleteOne(query);
		return result;
	} catch (error) {
		console.log("Error deleting user");
		console.error(error);
		return null;
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

//get all users
module.exports.getUsers = async function () {
	try {
		const users = await User.find();
		return users;
	} catch (error) {
		console.log("Error getting users");
		console.error(error);
		return null;
	}
};
