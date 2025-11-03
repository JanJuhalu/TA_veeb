const mysql = require("mysql2/promise");
const fs = require("fs").promises;
const sharp = require("sharp");
const dbInfo = require("../../../vp2025config");

const dbConf = {
    host: dbInfo.configData.host,
    user: dbInfo.configData.user,
    password: dbInfo.configData.passWord,
    database: dbInfo.configData.dataBase
}

//@desc home page for uploading gallery photos
//@route GET /galleryphotoupload
//@access public 


//app.get("/eestiFilm", (req, res)=>{
    const photouploadPage = (req, res)=>{
    res.render("foto_upload"); 

};



//@desc page for uploading potos to gallery
//@route GET /galleryphotouploads
//@access public 

//app.get("/eestiFilm/filmiinimesed_add", (req, res)=>{
    const photouploadPagePost = async (req, res)=>{
    let conn;
    console.log(req.body);
    console.log(req.file);
    try {
        const fileName = "vp_" + Date.now() + ".jpg";
        console.log(fileName);
        await fs.rename(req.file.path, req.file.destination + fileName);
        //loon normaalsuuruse 800X600
        await sharp(req.file.destination + fileName).resize(800,600).jpeg({quality: 90}).toFile("./public/gallery/normal/" + fileName);
        //loon thumbnail pildi 100X100 px
        await sharp(req.file.destination + fileName).resize(100,100).jpeg({quality: 90}).toFile("./public/gallery/thumbs/" + fileName);
        conn = await mysql.createConnection(dbConf);
        let sqlReq = "INSERT INTO uus (file_name, origname, alttext, privacy, user_id) VALUES (?,?,?,?,?)";
        //kuna kasutaja kontosid veel ei ole, siis määrame userid = 1
        const userid = 1
        const [result] = await conn.execute(sqlReq, [fileName, req.file.originalname, req.body.altInput, req.body.privacyInput, userid]);
        console.log("Salvestati kirjet: " + result.insertId);
        res.render("foto_upload");
    }
    catch(err) {
        console.log(err);
        res.render("foto_upload")
    }
    finally{
        if(conn) {
            await conn.end();
            console.log("Andmebaasiühendus on suletud!");
        }
    }
};


module.exports = {
    photouploadPage,
    photouploadPagePost
}