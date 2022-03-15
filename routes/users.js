const router = require("express").Router();
const User = require("../models/User");
const Item = require("../models/Item");
const bcrypt = require("bcrypt");

//get all users
router.get("/", async (req, res) => {
	try {
		const users = await User.find();
		const usersRes = [];
		users.map((user, index) => {
			const { password, ...others } = user._doc;
			usersRes.push(others);
		});
		res.status(200).json(usersRes);
	} catch (err) {
		res.status(500).json(err);
	}
});
//get user by id
router.get("/:id", async (req, res) => {
	await User.findById(req.params.id)
		.populate("following")
		.populate("followers")
		.exec((err, user) => {
			if (err) {
				return res.status(500).json(err);
			}
			const { password, ...others } = user._doc;
			res.status(200).json(others);
		});
});
//update
router.put("/:id", async (req, res) => {
	if (req.body.userId === req.params.id) {
		if (req.body.password) {
			//hash password
			const salt = await bcrypt.genSalt(10);
			req.body.password = await bcrypt.hash(req.body.password, salt);
		}
		try {
			const updatedUser = await User.findByIdAndUpdate(
				req.params.id,
				{
					$set: req.body,
				},
				{ new: true }
			);
			res.status(200).json(updatedUser);
		} catch (err) {
			res.status(500).json(err);
		}
	} else {
		res.status(401).json("you can update only your account");
	}
});

//delete
router.delete("/:id", async (req, res) => {
	if (req.body.userId === req.params.id) {
		try {
			const user = await User.findById(req.params.id);
			try {
				await Item.deleteMany({
					username: user.username,
				});
				await User.findByIdAndDelete(req.params.id);
				res.status(200).json("User has been deleted");
			} catch (err) {
				res.status(500).json(err);
			}
		} catch (err) {
			res.status(404).json("User not found");
		}
	} else {
		res.status(401).json("You can delete only your account");
	}
});

//follow
router.post("/:id/follow", (req, res) => {
	//find user by id (to whom user is going to follow)
	User.findById(req.params.id).then((user) => {
		user.followers.push(req.body.userId);
		const followedUser = user._id;
		user.save();
		// res.status(200).json(user);

		// find current user
		User.findById(req.body.userId)
			.then((user) => {
				//push followed user
				user.following.push(followedUser);
				user.save();
				res.status(200).json(user);
			})
			.catch((err) => {
				console.log(err);
			});
	});
});

//unfollow
router.post("/:id/unfollow", (req, res) => {
	//find user by id (to whom user is going to follow)
	User.findById(req.params.id).then((user) => {
		user.followers.pull(req.body.userId);
		const unfollowedUser = user._id;
		user.save();

		// find current user
		User.findById(req.body.userId)
			.then((user) => {
				//push followed user
				user.following.pull(unfollowedUser);
				user.save();
				res.status(200).json(user);
			})
			.catch((err) => {
				console.log(err);
			});
	});
});

module.exports = router;
