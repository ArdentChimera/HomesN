import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
	{
		username: {
			type: String,
			required: true,
			unique: true,
		},
		email: {
			type: String,
			required: true,
			unique: true,
		},
		password: {
			type: String,
			required: true,
		},
		avatar: {
			type: String,
			default:
				"https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.istockphoto.com%2Fphotos%2Fempty-profile-picture&psig=AOvVaw0s1gxlxaxbgQh-D47_Y8cW&ust=1712911020497000&source=images&cd=vfe&opi=89978449&ved=0CBIQjRxqFwoTCMC45vnguYUDFQAAAAAdAAAAABAE",
		},
	},
	{ timestamps: true }
);

const User = mongoose.model("User", userSchema);

export default User;
