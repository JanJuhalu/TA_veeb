const express = require("express");
const router = express.Router();



const {
    eestifilm,
    filmiinimesed,
    filmiinimesedAdd,
    inimesedAddPost,
    positionAddPost,
    filmAddPost,
    relationsAddPost,
    filmAddPage,
    relationsAddPage,
    relationsByPerson,
    position
} = require ("../controllers/eestifilmController");

router.route("/").get(eestifilm);
router.route("/filmiinimesed").get(filmiinimesed);
router.route("/filmiinimesed_add").get(filmiinimesedAdd);
router.route("/filmiinimesed_add").post(inimesedAddPost);
router.route("/position").get(position);
router.route("/position_add").get(positionAddPost);
router.route("/position_add").post(positionAddPost);
router.route("/position_add").post(filmAddPost);
router.route("/position_add").post(relationsAddPost);
router.route("/film_add").get(filmAddPage);
router.route("/relations_add").get(relationsAddPage);
router.route("/relations_by_person").get(relationsByPerson);

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