const router = require("express").Router();
const Item = require("../models/Item");
const mongoose = require("mongoose");

//get items by category or user or SearchTerm, or all items
router.get("/filteritem/:id", async (req, res) => {
	const categoryName = req.query.category;
	const subcategoryName = req.query.subcategory;
	const color = req.query.color;
	const searchTerm = req.query.search;
	const sort = req.query.sort;
	try {
		let items;
		if (categoryName) {
			items = await Item.find({
				$and: [
					{ user: req.params.id },
					{
						category: {
							$in: [categoryName],
						},
					},
				],
			});
		} else if (subcategoryName) {
			items = await Item.find({
				$and: [
					{ user: req.params.id },
					{
						subcategory: {
							$in: [subcategoryName],
						},
					},
				],
			});
		} else if (color) {
			items = await Item.find({ $and: [{ user: req.params.id }, { color }] });
		} else if (searchTerm) {
			items = await Item.find({
				$and: [
					{ user: req.params.id },
					{
						$or: [
							{ name: { $regex: searchTerm, $options: "$i" } },
							{ brand: { $regex: searchTerm, $options: "$i" } },
						],
					},
				],
			});
		} else if (sort) {
			if (sort === "newest") {
				items = await Item.find({ user: req.params.id }).sort({
					createdAt: -1,
				});
			} else if (sort === "lowest") {
				items = await Item.find({ user: req.params.id }).sort({
					price: 1,
				});
			} else if (sort === "highest") {
				items = await Item.find({ user: req.params.id }).sort({
					price: -1,
				});
			}
		} else {
			items = await Item.find({ user: req.params.id });
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

// get following user's items
router.get("/followingitems/:id", async (req, res) => {
	const items = await Item.find({ user: req.params.id }).populate("user").sort({
		createdAt: -1,
	});
	res.status(200).json(items);
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

//get liked items
router.get("/likeditems/:id", async (req, res) => {
	const categoryName = req.query.category;
	const subcategoryName = req.query.subcategory;
	const color = req.query.color;
	const searchTerm = req.query.search;
	const sort = req.query.sort;
	try {
		let items;
		if (categoryName) {
			items = await Item.find({
				$and: [
					{
						likes: {
							$in: [req.params.id],
						},
					},
					{
						category: {
							$in: [categoryName],
						},
					},
				],
			});
		} else if (subcategoryName) {
			items = await Item.find({
				$and: [
					{
						likes: {
							$in: [req.params.id],
						},
					},
					{
						subcategory: {
							$in: [subcategoryName],
						},
					},
				],
			});
		} else if (color) {
			items = await Item.find({
				$and: [
					{
						likes: {
							$in: [req.params.id],
						},
					},
					{ color },
				],
			});
		} else if (searchTerm) {
			items = await Item.find({
				$and: [
					{
						likes: {
							$in: [req.params.id],
						},
					},
					{
						$or: [
							{ name: { $regex: searchTerm, $options: "$i" } },
							{ brand: { $regex: searchTerm, $options: "$i" } },
						],
					},
				],
			});
		} else if (sort) {
			if (sort === "newest") {
				items = await Item.find({
					likes: {
						$in: [req.params.id],
					},
				}).sort({
					createdAt: -1,
				});
			} else if (sort === "lowest") {
				items = await Item.find({
					likes: {
						$in: [req.params.id],
					},
				}).sort({
					price: 1,
				});
			} else if (sort === "highest") {
				items = await Item.find({
					likes: {
						$in: [req.params.id],
					},
				}).sort({
					price: -1,
				});
			}
		} else {
			items = await Item.find({
				likes: {
					$in: [req.params.id],
				},
			});
		}
		res.status(200).json(items);
	} catch (err) {
		res.status(500).json(err);
	}
});
module.exports = router;
