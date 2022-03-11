const mongoose = require("mongoose");

const SubcategorySchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: true,
		},
	},
	{ timestamps: true }
);

module.exports = mongoose.model("Subcategory", SubcategorySchema);
