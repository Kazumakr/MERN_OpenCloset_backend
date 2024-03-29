const router = require("express").Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");

//signup
router.post("/signup", async (req, res) => {
	try {
		const salt = await bcrypt.genSalt(10);
		const hashedPassword = await bcrypt.hash(req.body.password, salt);
		const newUser = new User({
			username: req.body.username,
			email: req.body.email,
			password: hashedPassword,
		});
		const user = await newUser.save();
		res.status(200).json(user);
	} catch (err) {
		res.status(500).json(err);
	}
});

//login
router.post("/login", async (req, res) => {
	try {
		const user = await User.findOne({ email: req.body.email });
		!user && res.status(400).json("Wrong Email");
		const validate = await bcrypt.compare(req.body.password, user.password);
		!validate && res.status(400).json("Wrong Password");

		//return user data without password
		const { password, ...others } = user._doc;
		res.status(200).json(others);
	} catch (err) {
		res.status(500).json(err);
	}
});

module.exports = router;
