const express = require("express");
const loginCheck = require("../src/checklogin");
const multer = require("multer");
const router = express.Router();
//kõigile marsuutidele lisan vahevara sisselogimise kontrollimiseks
router.use(loginCheck.isLogin);
//seadistame vajevara fotode üleslaadimiseks kindlasse kausta
const uploader = multer({dest: "./public/gallery/orig/"});
//kontrollerid
const {
    photouploadPage,
    photouploadPagePost} = require ("../controllers/photouploadController");

router.route("/").get(photouploadPage);

router.route("/").post(uploader.single("photoInput"), photouploadPagePost);

module.exports = router;

/*app.get("/eestiFilm", (req, res)=>{
    res.render("eestiFilm"); 

});*/

/*app.get("/eestiFilm/filmiinimesed", async (req, res)=>{
    let conn;
    const sqlReq = "SELECT * FROM person";
    try {
        conn = await mysql.createConnection(dbConf);
        console.log("Andmebaasi ühenuds loodud");
        const [rows, fields] = await conn.execute(sqlReq);
        res.render("filmiinimesed", {personList: rows});
    }
    catch(err) {
        console.log("Viga!" + err);
        res.render("filmiinimesed", {personList: []});
    }
    finally{
        //paneme ühenduse kinni
        if(conn){
            await conn.end();
                console.log("Andmebaasi ühenuds on suletud");
        }
    }
});*/





/*app.post("/eestiFilm/filmiinimesed_add", async (req, res)=> {
    let conn;
    let sqlReq = "INSERT INTO person (first_name, last_name, born, deceased) VALUES (?,?,?,?)";
    
    if(!req.body.firstNameInput || !req.body.lastNameInput || !req.body.bornInput || req.body.deceasedInput >= new Date ()){
        res.render("filmiinimesed_add", {notice:"Osa andmeid olipuudu või ebakorrektsed"});
    }
    else {
        try {
            conn = await mysql.createConnection(dbConf);
            console.log("Andmebaasi ühenuds loodud");
            let deceasedDate = null;
            if (req.body.deceasedInput != ""){
                deceasedDate = req.body.deceasedInput;
            }
            const [result] = await conn.execute(sqlReq, [req.body.firstNameInput, req.body.lastNameInput, req.body.bornInput, deceasedDate]);
            console.log("Salvestati kirje: " + result.insertId);//saame teada äsja lisatud kirje id
            res.render("filmiinimesed_add", {notice:"Andmed salvestatud"});
        }
        catch(err) {
            console.log("Viga!" + err);
            res.render("filmiinimesed_add", {notice: " Inimese lisamine ebaõnestus"});
        }
        finally {
            if(conn){
            await conn.end();
                console.log("Andmebaasi ühenuds on suletud");
            }
        }
    }
});*/