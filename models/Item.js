const mongoose = require("mongoose");

const ItemSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: true,
		},
		price: {
			type: Number,
		},
		size: {
			type: String,
		},
		brand: {
			type: String,
		},
		color: {
			type: String,
		},
		fabric: {
			type: String,
		},
		note: {
			type: String,
		},
		images: {
			type: String,
		},
		category: {
			type: String,
		},
		subcategory: {
			type: String,
		},
		username: {
			type: String,
			required: true,
		},
		user: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
		},
		likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
		comments: [
			{
				comment: String,
				postedByName: String,
				postedById: {
					type: mongoose.Schema.Types.ObjectId,
					ref: "User",
				},
			},
		],
	},
	{ timestamps: true }
);

module.exports = mongoose.model("Item", ItemSchema);
