const mysql = require("mysql2/promise");
const dbInfo = require("../../../vp2025config");

const dbConf = {
    host: dbInfo.configData.host,
    user: dbInfo.configData.user,
    password: dbInfo.configData.passWord,
    database: dbInfo.configData.dataBase
}

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
        if(conn/*connection*/){
            await conn.end();
                console.log("Andmebaasi ühenuds on suletud");
        }
    }
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
};

//app.get("/eestiFilm/position", (req, res)=>{ 
    const position = async (req, res)=>{
    let conn;
    const sqlReq = "SELECT * FROM position";
    try{
        conn = await mysql.createConnection(dbConf);
            console.log("Andmebaasi ühenuds loodud");
        const [rows, fields] = await conn.execute(sqlReq);
        res.render("position", {positionList: rows});
    }
    catch(err) {
        console.log(err);
                res.render("position", {positionList: []});

    }
    finally{
        if(conn){
            await conn.end();
                console.log("Andmebaasi ühenuds on suletud");
            }
    }
    
};

module.exports = {
    eestifilm,
    filmiinimesed,
    filmiinimesedAdd,
    inimesedAddPost,
    position
}