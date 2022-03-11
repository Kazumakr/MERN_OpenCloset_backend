const router = require("express").Router();
const Item = require("../models/Item");
const mongoose = require("mongoose");

//get items by category or user or SearchTerm, or all items
router.get("/filteritem/:id", async (req, res) => {
	const username = req.query.user;
	const categoryName = req.query.category;
	const subcategoryName = req.query.subcategory;
	const color = req.query.color;
	const searchTerm = req.query.search;
	try {
		let items;
		if (username) {
			items = await Item.find({ username });
		} else if (categoryName) {
			items = await Item.find({
				category: {
					$in: [categoryName],
				},
			});
		} else if (subcategoryName) {
			items = await Item.find({
				subcategory: {
					$in: [subcategoryName],
				},
			});
		} else if (color) {
			items = await Item.find({ color });
		} else if (searchTerm) {
			items = await Item.find({
				$or: [
					{ name: { $regex: searchTerm, $options: "$i" } },
					{ brand: { $regex: searchTerm, $options: "$i" } },
				],
			});
		} else {
			items = await Item.find({ userId: req.params.id });
		}
		res.status(200).json(items);
	} catch (err) {
		res.status(500).json(err);
	}
});
//get single item
router.get("/:id", async (req, res) => {
	try {
		const item = await Item.findById(req.params.id);
		res.status(200).json(item);
	} catch (err) {
		res.status(500).json(err);
	}
});

//add new item
router.post("/", async (req, res) => {
	const newItem = new Item(req.body);
	try {
		const savedItem = await newItem.save();
		res.status(200).json(savedItem);
	} catch (err) {
		res.status(500).json(err);
	}
});
//update item
router.put("/:id", async (req, res) => {
	try {
		const item = await Item.findById(req.params.id);
		if (item.username === req.body.username) {
			try {
				const updatedItem = await Item.findByIdAndUpdate(
					req.params.id,
					{
						$set: req.body,
					},
					{ new: true }
				);
				res.status(200).json(updatedItem);
			} catch (err) {
				res.status(500).json(err);
			}
		} else {
			res.status(401).json("You can update only your item");
		}
	} catch (err) {
		res.status(500).json(err);
	}
});
//delete item
router.delete("/:id", async (req, res) => {
	try {
		const item = await Item.findById(req.params.id);

		if (item.username === req.body.username) {
			try {
				await item.delete();
				res.status(200).json("Item has been deleted");
			} catch (err) {
				res.status(500).json(err);
			}
		} else {
			res.status(401).json("You can delete only your item");
		}
	} catch (err) {
		res.status(500).json(err);
	}
});

//comment
router.put("/:id/comments", (req, res) => {
	const comment = {
		comment: req.body.comment,
		postedByName: req.body.username,
		postedById: req.body.userId,
	};
	Item.findByIdAndUpdate(
		req.params.id,
		{
			$push: { comments: comment },
		},
		{ new: true }
	).exec((err, result) => {
		if (err) {
			return res.status(422).json({ error: err });
		} else {
			res.json(result);
		}
	});
});
//like, unlike
router.put("/:id/likes", (req, res) => {
	Item.findByIdAndUpdate(
		req.params.id,
		{
			$push: { likes: req.body.userId },
		},
		{ new: true }
	).exec((err, result) => {
		if (err) {
			return res.status(422).json({ error: err });
		} else {
			res.json(result);
		}
	});
});
router.put("/:id/unlikes", (req, res) => {
	Item.findByIdAndUpdate(
		req.params.id,
		{
			$pull: { likes: req.body.userId },
		},
		{ new: true }
	).exec((err, result) => {
		if (err) {
			return res.status(422).json({ error: err });
		} else {
			res.json(result);
		}
	});
});

module.exports = router;
