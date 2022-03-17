const express = require("express");
const app = express();
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
const cors = require("cors");

const mongoose = require("mongoose");

const authRoute = require("./routes/auth");
const userRoute = require("./routes/users");
const itemRoute = require("./routes/items");

//file upload
const multer = require("multer");
const { GridFsStorage } = require("multer-gridfs-storage");
const Grid = require("gridfs-stream");

//for connecting to public folder
const path = require("path");

dotenv.config();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(cors());
app.use(express.json());
app.use("/images", express.static(path.join(__dirname, "/images")));

mongoose
	.connect(process.env.MONGO_URL, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
	})
	.then(console.log("connected to mongoDB"))
	.catch((err) => console.log(err));

let gfs;
const conn = mongoose.connection;
conn.once("open", () => {
	gridfsBucket = new mongoose.mongo.GridFSBucket(conn.db, {
		bucketName: "photos",
	});
	gfs = Grid(conn.db, mongoose.mongo);
	gfs.collection("photos");
});

//storage engine
const storage = new GridFsStorage({
	url: process.env.MONGO_URL,
	options: { useNewUrlParser: true },
	file: (req, file) => {
		const match = ["image/png", "image/jpeg", "image/jpg"];
		if (match.indexOf(file.mimetype) === -1) {
			const filename = `${file.originalname}`;
			return filename;
		}
		return {
			bucketName: "photos",
			filename: `${file.originalname}`,
		};
	},
});

const upload = multer({ storage: storage });

app.post(
	"/api/upload",
	upload.single("file", (req, res) => {
		const imgUrl = `http://localhost:5000/api/file/${req.file.filename}`;
		return res.send(imgUrl);
	})
);
app.get("/api/image/:filename", (req, res) => {
	gfs.files.findOne({ filename: req.params.filename }, (err, file) => {
		console.log(file);
		if (!file || file.length === 0) {
			return res.status(404).json({
				err: "No file exist",
			});
		}
		if (
			file.contentType === "image/jpeg" ||
			file.contentType === "image/png" ||
			file.contentType === "image/jpg"
		) {
			const readstream = gridfsBucket.openDownloadStream(file._id);
			readstream.pipe(res);
		} else {
			res.status(404).json({ err: "Not an image" });
		}
	});
});

app.delete("/api/image/:filename", async (req, res) => {
	try {
		await gfs.files.deleteOne({ filename: req.params.filename });
		res.send("success");
	} catch (error) {
		console.log(error);
		res.send("An error occured.");
	}
});

app.use("/api/auth", authRoute);
app.use("/api/users", userRoute);
app.use("/api/items", itemRoute);

app.listen(process.env.PORT || 5000, () => {
	console.log("Server is running");
});

module.exports = upload;
