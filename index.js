const express = require ("express");
const fs = require ("fs");
const textRef = "public/txt/vanasõnad.txt";
const dateET = require("./src/dateTimeET");
//käivitan js funktsiooni ja annan talle nimeks "app"
const bodyparser = require("body-parser");
const app = express();
//määran veebilehtede mallide renderdamise mootori
app.set("view engine", "ejs");
//määran ühe päris kataloogi kättesaadavaks
app.use(express.static("public"));
//parsime oäringu URL-i, lipp false, kui ainult tekst ja true, kui muid andmeid ka 
app.use(bodyparser.urlencoded({extended: false}));

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
            fs.appendFile("public/txt/visitlog.txt", req.body.nameInput + "; ", (err)=>{});
            if (err){
                throw(err);

            }
            else {
                console.log("Salvestatud!");
                
            }
        }
    });    
});


app.listen(5119);