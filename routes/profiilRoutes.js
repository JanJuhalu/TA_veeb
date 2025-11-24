const express = require("express");
const loginCheck = require("../src/checklogin");


const router = express.Router();
//kõigile marsuutidele lisan vahevara sisselogimise kontrollimiseks
router.use(loginCheck.isLogin);


//kontrollerid
const {profiilHome,
       profiilPage
} = require("../controllers/profiilGalleryController");

router.route("/").get(profiilHome);

router.route("/:page").get(profiilPage); //uued marsuudid mida tahaks lisada lehele, siis peaks need panema kirja kaldkriipus järele
//selge sõnaga autori välja mõledud

module.exports = router;