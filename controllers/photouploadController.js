const mysql = require("mysql2/promise");
const fs = require("fs").promises;
const sharp = require("sharp");
const dbpool = reuire("../src/dbpool");
const watermarkFile = ("./public/image/vp_logo_small.png");

/* const dbConf = {
    host: dbInfo.configData.host,
    user: dbInfo.configData.user,
    password: dbInfo.configData.passWord,
    database: dbInfo.configData.dataBase
} */

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
    //let conn;
    console.log(req.body);
    console.log(req.file);
    try {
        const fileName = "vp_" + Date.now() + ".jpg";
        console.log(fileName);
        await fs.rename(req.file.path, req.file.destination + fileName);
        //kontrollin, kas vesimÃ¤rgi fail on olemas
		const watermarkSettings = [{
            input: watermarkFile,
            gravity: "southeast"
        }];
		if (!await fs.access(watermarkFile).then(() => true).catch(() => false)) {
             console.log("VesimÃ¤rgi faili ei leitud!");
             // TÃ¼hjendame seaded, et vesimÃ¤rki ei proovitaks lisada
             watermarkSettings.length = 0; 
        }
		console.log("Muudan suurust: 800X600");
		//loon normaalmÃµÃµdus foto (800X600)
		//await sharp(req.file.destination + fileName).resize(800,600).jpeg({quality: 90}).toFile("./public/gallery/normal/" + fileName);
		 let normalImageProcessor = await sharp(req.file.destination + fileName).resize(800, 600).jpeg({quality: 90});
        console.log("Lisan vesimÃ¤rgi" + watermarkSettings.length);    
        if (watermarkSettings.length > 0) {
            normalImageProcessor = await normalImageProcessor.composite(watermarkSettings);
        }
		await normalImageProcessor.toFile("./public/gallery/normal/" + fileName);
	  //loon thumbnail pildi 100X100
	  await sharp(req.file.destination + fileName).resize(100,100).jpeg({quality: 90}).toFile("./public/gallery/thumbs/" + fileName);
	  //conn = await mysql.createConnection(dbConf);
	  let sqlReq = "INSERT INTO uus (file_name, origname, alttext, privacy, user_id) VALUES(?,?,?,?,?)";
	  //kuna kasutajakontosid veel ei ole, siis mÃ¤Ã¤rame userid = 1
	  const userId = req.session.userId;
	  const [result] = await pool.execute(sqlReq, [fileName, req.file.originalname, req.body.altInput, req.body.privacyInput, userId]);
	  console.log("Salvestati kirje: " + result.insertId);
	  res.render("foto_upload");
	}
	catch(err) {
	  console.log(err);
	  res.render("foto_upload");
	}
	/* finally {
	  if(conn){
	  await conn.end();
	    console.log("AndmebaasiÃ¼hendus on suletud!");
	  }
	} */
};


module.exports = {
    photouploadPage,
    photouploadPagePost
}