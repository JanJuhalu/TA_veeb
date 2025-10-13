const express = require ("express");
const fs = require ("fs");
const textRef = "public/txt/vanasõnad.txt";
const dateET = require("./src/dateTimeET");
const dbInfo = require("../../vp2025config");
//käivitan js funktsiooni ja annan talle nimeks "app"
const bodyparser = require("body-parser");
//SQL andmebaasi moodul
//const mysql = require("mysql2");
//kuna kasutame asünkroonsust, siis importime mysql2/promise mooduli
const mysql = require("mysql2/promise");
const { hostname } = require("os");
const app = express();
//määran veebilehtede mallide renderdamise mootori
app.set("view engine", "ejs");
//määran ühe päris kataloogi kättesaadavaks
app.use(express.static("public"));
//parsime oäringu URL-i, lipp false, kui ainult tekst ja true, kui muid andmeid ka 
app.use(bodyparser.urlencoded({extended: false}));

//loon andmebaasi ühenduse
/*const conn = mysql.createConnection({
    host: dbInfo.configData.host,
    user: dbInfo.configData.user,
    password: dbInfo.configData.passWord,
    database: dbInfo.configData.dataBase
});*/



app.get("/", (req, res)=>{
    //res.send("Express.js läks käima ja serveerib veebi");
    res.render("index");
});

app.get("/timenow", (req, res)=>{
    const weekDayNow = dateET.weekDayET();
    const dateNow = dateET.fullDate();
    res.render("timenow", {weekDayNow: weekDayNow, dateNow: dateNow});

});

app.get("/vanasonad", (req, res)=>{
    let folkWisdom = [];
    fs.readFile(textRef, "utf8", (err, data)=>{
        if (err){
            //kui tuleb viga siis ikka väljastame veebilehe, lihtsalt vanasõnu pole ühtegi
            res.render("genericlist", {heading: "Vanasõnad", listData: ["Ei leidnud ühtegi vanasõna!"]});

        }
        else {
            folkWisdom = data.split(";");
            res.render("genericlist", {heading: "Vanasõnad", listData: folkWisdom});
        }

    });
    });

app.get("/regvisit", (req, res)=>{
    

    res.render("regvisit");
});

app.post("/regvisit", (req, res)=>{
    console.log(req.body);
    //avan tekstifaili kirjutamiseks sellisel moel, et kui teda pole, luuakse
    //parameeter "a", mis ütleb et kui seda pole siis teeme ära
    fs. open("public/txt/visitlog.txt", "a", (err, file)=>{
        if(err){
            throw(err);
        }
        else {
            //faili senisele sisule lisamine 
            fs.appendFile("public/txt/visitlog.txt", req.body.nameInput + ", " + req.body.lastNameInput + ", " + dateET.fullDate() + " kell " + dateET.fullTime() + ";", (err)=>{
				if(err){
					throw(err);
				}
				else {
					console.log("Salvestatud!");
					res.render("regvisit", {visitor: req.body.firstNameInput + " " + req.body.lastNameInput});
				}
			});
		}
	});
});

app.get("/visitlog", (req, res)=>{
	let listData = [];
	fs.readFile("public/txt/visitlog.txt", "utf8", (err, data)=>{
		if(err){
			//kui tuleb viga, siis ikka vÃ¤ljastame veebilehe, liuhtsalt vanasÃµnu pole Ã¼htegi
			res.render("genericlist", {heading: "Registreeritud kÃ¼lastused", listData: ["Ei leidnud Ã¼htegi kÃ¼lastust!"]});
		}
		else {
			listData = data.split(";");
			let correctListData = [];
			for(let i = 0; i < listData.length - 1; i ++){
				correctListData.push(listData[i]);
			}
			res.render("genericlist", {heading: "registreeritud kÃ¼lastused", listData: correctListData});
		}
	});
});

app.get("/eestiFilm", (req, res)=>{
    res.render("eestiFilm"); 

});

app.get("/eestiFilm/filmiinimesed", async (req, res)=>{
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
});


app.get("/eestiFilm/filmiinimesed_add", (req, res)=>{
    res.render("filmiinimesed_add", {notice: "Ootan sisestust"}); 

});

app.post("/eestiFilm/filmiinimesed_add", async (req, res)=> {
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
            if(conn/*connection*/){
            await conn.end();
                console.log("Andmebaasi ühenuds on suletud");
            }
        }
    }
});

//Esti filmi marsuudid
const eestifilmRouter = require("./routes/eestifilmRoutes");
app.use("/eestiFilm", eestifilmRouter);

/*app.post("/eestiFilm/filmiinimesed_add", (req, res)=>{ //POST ON SEE KUHU ANDMED TULEVAD
    console.log(req.body);
    //kas andmed on olemas
    if(!req.body.firstNameInput || !req.body.lastNameInput || !req.body.bornInput || req.body.deceasedInput >= new Date ()){
        res.render("filmiinimesed_add", {notice:"Osa andmeid olipuudu või ebakorrektsed"});
    }
    else {
        let sqlReq = "INSERT INTO person (first_name, last_name, born, deceased) VALUES (?,?,?,?)";
        conn.execute(sqlReq, [req.body.firstNameInput, req.body.lastNameInput, req.body.bornInput, deceasedDate], (err, sqlres)=>{
            if(err){
                res.render("filmiinimesed_add", {notice: " Inimese lisamine ebaõnestus"});
            }
            else {
                res.render("filmiinimesed_add", {notice:"Andmed salvestatud"});
            }
        });
    }
    res.render("filmiinimesed_add"); 

});*/



app.listen(5119);