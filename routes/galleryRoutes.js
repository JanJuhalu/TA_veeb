const express = require("express");

const router = express.Router();

//kontrollerid
const {galleryHome} = require("../controllers/galleryController");

router.route("/").get(galleryHome);

module.exports = router;