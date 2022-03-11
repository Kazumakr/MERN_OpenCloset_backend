const router = require("express").Router();
const Subcategory = require("../models/Subcategory");

//create new category
router.post("/", async (req, res) => {
	const newSubcategory = new Subcategory(req.body);
	try {
		const savedSubCategory = await newSubcategory.save();
		res.status(200).json(savedSubcategory);
	} catch (err) {
		res.status(500).json(err);
	}
});

//get all categories
router.get("/", async (req, res) => {
	try {
		const subcategories = await Subcategory.find();
		res.status(200).json(subcategories);
	} catch (err) {
		res.status(500).json(err);
	}
});

module.exports = router;
