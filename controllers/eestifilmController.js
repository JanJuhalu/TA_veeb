const mysql = require("mysql2/promise");
const dbpool = reuire("../src/dbpool");
const dbInfo = require("../../../vp2025config");

/* const dbConf = {
    host: dbInfo.configData.host,
    user: dbInfo.configData.user,
    password: dbInfo.configData.passWord,
    database: dbInfo.configData.dataBase
} */

//@desc home page for Estonian Film section
//@route GET /eestiFilm
//@access public 


//app.get("/eestiFilm", (req, res)=>{
    const eestifilm = (req, res)=>{
    res.render("eestiFilm"); 

};

//@desc page for people involved in Estonian Film Industry
//@route GET /eestiFilm/filmiinimesed(või inimesed??)
//@access public 

//app.get("/eestiFilm/filmiinimesed", async (req, res)=>{
    const filmiinimesed = async (req, res)=>{
    //let conn;
    const sqlReq = "SELECT * FROM person";
    try {
        //conn = await mysql.createConnection(dbConf);
        console.log("Andmebaasi ühenuds loodud");
        const [rows, fields] = await pool.execute(sqlReq);

        //vormindan kuupäevad ilusaks
        rows.forEach(r => {
            if (r.born) r.born = DataTransferItem.givenDateFormattedET(r.born);
            if (r.deceased) r.deceased = DataTransferItem.givenDateFormattedET(r.deceased);
        });
        res.render("filmiinimesed", {personList: rows});
    }
    catch(err) {
        console.log("Viga!" + err);
        res.render("filmiinimesed", {personList: []});
    }
   /*  finally{
        //paneme ühenduse kinni
        if(conn EHK onnection){
            await conn.end();
                console.log("Andmebaasi ühenuds on suletud");
        }
    } */
};

//@desc page fo adding involved in Estonian Film Industry
//@route GET /eestiFilm/filmiinimesed_add
//@access public 

//app.get("/eestiFilm/filmiinimesed_add", (req, res)=>{
    const filmiinimesedAdd = (req, res)=>{
    res.render("filmiinimesed_add", {notice: "Ootan sisestust"}); 

};

//@desc page for adding people involved in Estonian Film Industry
//@route GET /eestiFilm/filmiinimesed_add(või inimesed??)
//@access public 

//app.post("/eestiFilm/filmiinimesed_add", async (req, res)=> {
    const inimesedAddPost = async (req, res)=>{
    //let conn;
    let sqlReq = "INSERT INTO person (first_name, last_name, born, deceased) VALUES (?,?,?,?)";
    
    if(!req.body.firstNameInput || !req.body.lastNameInput || !req.body.bornInput || req.body.deceasedInput >= new Date ()){
        res.render("filmiinimesed_add", {notice:"Osa andmeid olipuudu või ebakorrektsed"});
    }
    else {
        try {
            //conn = await mysql.createConnection(dbConf);
            console.log("Andmebaasi ühenuds loodud");
            let deceasedDate = null;
            if (req.body.deceasedInput != ""){
                deceasedDate = req.body.deceasedInput;
            }
            const [result] = await pool.execute(sqlReq, [
                req.body.firstNameInput, 
                req.body.lastNameInput, 
                req.body.bornInput, 
                deceasedDate
            ]);
            console.log("Salvestati kirje: " + result.insertId);//saame teada äsja lisatud kirje id
            res.render("filmiinimesed_add", {notice:"Andmed salvestatud"});
        }
        catch(err) {
            console.log("Viga!" + err);
            res.render("filmiinimesed_add", {notice: " Inimese lisamine ebaõnestus"});
        }
        /* finally {
            if(conn){
            await conn.end();
                console.log("Andmebaasi ühenuds on suletud");
            }
        } */
    }
};

//app.get("/eestiFilm/position", (req, res)=>{ 
    const position = async (req, res) => {
    //let conn;
    const sqlReq = "SELECT * FROM position";
    try {
        //conn = await mysql.createConnection(dbConf);
        const [rows] = await pool.execute(sqlReq);
        res.render("position", { positionList: rows, notice: "" });
    } catch (err) {
        console.log(err);
        res.render("position", { positionList: [], notice: "Ametite laadimine ebaõnnestus" });
     } /*finally {
        if (conn) await conn.end();
    } */
};

const positionAddPost = async (req, res) => {
    //let conn;
    if (!req.body.positionNameInput) {
        return res.render("position_add", { notice: "Ametinimetus puudub" });
    }

    try {
        //conn = await mysql.createConnection(dbConf);
        await pool.execute("INSERT INTO position (position_name) VALUES (?)", [req.body.positionNameInput]);
        res.render("position_add", { notice: "Amet lisatud!" });
    } catch (err) {
        console.log(err);
        res.render("position_add", { notice: "Lisamine ebaõnnestus" });
    } /* finally {
        if (conn) await conn.end();
    } */
};

//------------------------------------------------------------
// 5. Filmide lisamine
//------------------------------------------------------------
const filmAddPage = (req, res) => {
    res.render("film_add", { notice: "Lisa uus film" });
};

const filmAddPost = async (req, res) => {
    //let conn;
    const sqlReq = "INSERT INTO film (title, production_year, duration, description) VALUES (?,?,?,?)";

    if (!req.body.titleInput || !req.body.yearInput) {
        return res.render("film_add", { notice: "Filmi nimi ja aasta on kohustuslikud" });
    }

    try {
        //conn = await mysql.createConnection(dbConf);
        await pool.execute(sqlReq, [
            req.body.titleInput,
            req.body.yearInput,
            req.body.durationInput || null,
            req.body.descriptionInput || null
        ]);
        res.render("film_add", { notice: "Film lisatud!" });
    } catch (err) {
        console.log(err);
        res.render("film_add", { notice: "Filmi lisamine ebaõnnestus" });
    } /* finally {
        if (conn) await conn.end();
    } */
};

//------------------------------------------------------------
// 6. Isik–film–amet seoste lisamine ja kuvamine
//------------------------------------------------------------
const relationsAddPage = async (req, res) => {
    //let conn;
    try {
        //conn = await mysql.createConnection(dbConf);

        const [people] = await pool.execute("SELECT id, first_name, last_name FROM person");
        const [films] = await pool.execute("SELECT id, title FROM film");
        const [positions] = await pool.execute("SELECT id, position_name FROM position");

        res.render("relations_add", {
            people,
            films,
            positions,
            notice: "Loo seos"
        });
    } catch (err) {
        console.log(err);
        res.render("relations_add", { people: [], films: [], positions: [], notice: "Viga andmete laadimisel" });
    } /* finally {
        if (conn) await conn.end();
    } */
};

const relationsAddPost = async (req, res) => {
    //let conn;
    const sqlReq = "INSERT INTO person_in_film (person_id, film_id, position_id, role) VALUES (?,?,?,?)";
    try {
        //conn = await mysql.createConnection(dbConf);
        await pool.execute(sqlReq, [
            req.body.personSelect,
            req.body.filmSelect,
            req.body.positionSelect,
            req.body.roleInput || null
        ]);
        res.render("relations_add", { notice: "Seos lisatud!" });
    } catch (err) {
        console.log(err);
        res.render("relations_add", { notice: "Seose lisamine ebaõnnestus" });
    } /* finally {
        if (conn) await conn.end();
    } */
};

const relationsByPerson = async (req, res) => {
    //let conn;
    const sqlReq = `
        SELECT p.first_name, p.last_name, f.title, pos.position_name, pf.role
        FROM person_in_film pf
        JOIN person p ON pf.person_id = p.id
        JOIN film f ON pf.film_id = f.id
        JOIN position pos ON pf.position_id = pos.id
        ORDER BY p.last_name, p.first_name;
    `;
    try {
        //conn = await mysql.createConnection(dbConf);
        const [rows] = await pool.execute(sqlReq);
        res.render("relations_by_person", { relations: rows });
    } catch (err) {
        console.log(err);
        res.render("relations_by_person", { relations: [] });
    } /* finally {
        if (conn) await conn.end();
    }*/
}; 

//------------------------------------------------------------
module.exports = {
    eestifilm,
    filmiinimesed,
    filmiinimesedAdd,
    inimesedAddPost,
    position,
    positionAddPost,
    filmAddPage,
    filmAddPost,
    relationsAddPage,
    relationsAddPost,
    relationsByPerson
};