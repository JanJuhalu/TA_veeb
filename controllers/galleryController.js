const mysql = require("mysql2/promise");
const dbpool = reuire("../src/dbpool");
const dbInfo = require("../../../vp2025config");

/* const dbConf = {
    host: dbInfo.configData.host,
    user: dbInfo.configData.user,
    password: dbInfo.configData.passWord,
    database: dbInfo.configData.dataBase
} */

const galleryHome = async (req, res)=>{

res.redirect("/photogallery/1")};



const galleryPage = async (req, res)=>{
	//let conn;
	const photoLimit = 3;
	const privacy = 2;
	let page = parseInt(req.params.page); //PARAMEETRID
	//let skip = (page - 1) * photoLimit;
	let skip = 0;

	try {
		//kontrollime, et poleks liiga väike lehekülg
		if(page < 1 || isNaN(page)){
			page = 1;
		};
		//conn = await mysql.createConnection(dbConf);
		//vaatame palju üldse fotosid on
		let sqlReq = "SELECT COUNT(id) AS photos FROM uus WHERE privacy >= ? AND deleteit IS NULL";
		const [countResult] = await pool.execute(sqlReq, [privacy]);
		const photoCount = countResult[0].photos;
		console.log(photoCount);
		//parandame leheküljenumbri, kui see on valitud liiga suur
		if ((page - 1) * photoLimit >= photoCount){
			page = Math.max(1, Math.ceil(photoCount / photoLimit));
		}
		skip = (page - 1) * photoLimit;
		//navigatsioonilinkide loomine
		if(page === 1){
			//&nbsp; laseb tekitada üikad tühikud jõuga
			galleryLinks = "Eelmine leht &nbsp;&nbsp;&nbsp; | &nbsp;&nbsp;&nbsp;";
		} else {
			galleryLinks = `<a href="/photogallery/${page - 1}"> Eelmine leht</a> &nbsp;&nbsp;&nbsp; | &nbsp;&nbsp;&nbsp;`;

		}
		if(page * photoLimit >= photoCount){
			galleryLinks +="Järgmine leht";
		} else {
			galleryLinks += `<a href="/photogallery/${page + 1}">Järgmine leht</a>`;
		}


		sqlReq = "SELECT file_name, alttext FROM uus WHERE privacy >= ? AND deleteit IS NULL LIMIT ?, ?";
		const [rows, fields] = await pool.execute(sqlReq, [privacy, skip, photoLimit]);
		console.log(rows);
		let listData = [];
		for (let i = 0; i < rows.length; i ++){
			let altText = "Galeriipilt";
			if(rows[i].alttext != "") {
				altText = rows[i].alttext;
				
			}
			listData.push({src: rows[i].file_name, alt: altText});
			
		}
		res.render("gallery", {galleryData: listData, imagehref: "/gallery/thumbs/", links: galleryLinks});
	}
	catch(err){
		console.log(err);
		res.render("gallery", {galleryData: [], links: ""});
	}
	/* finally {
	  if(conn){
	    await conn.end();
	  }
	} */
};

module.exports = {
    galleryHome,
	galleryPage
}