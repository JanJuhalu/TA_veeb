const mysql = require("mysql2/promise");
const argon2 = require("argon2");
const dbInfo = require("../../../vp2025config");

const dbConf = {
    host: dbInfo.configData.host,
    user: dbInfo.configData.user,
    password: dbInfo.configData.passWord,
    database: dbInfo.configData.dataBase
}

const signupPage = (req, res) => {
	res.render("signup", {notice: "Ootan andmeid"});
};

const signupPagePost = async (req, res)=>{
	let conn;
	console.log(req.body);
	//andmete valideerimine
	if(
		!req.body.firstNameInput ||
		!req.body.lastNameInput ||
		!req.body.birthDateInput ||
		!req.body.genderInput ||
		!req.body.emailInput ||
		req.body.passwordInput.length < 8 ||
		req.body.passwordInput !== req.body.confirmPasswordInput
	) {
		let notice = "Andmeid on puudu või miski on vigane!";
		console.log(notice);
		return res.render("signup", {notice: notice});
	}
	// if(
	// 	!req.body.firstNameInput || 
	// 	!req.body.lastNameInput ||
	// 	!req.body.birthDateInput ||
	// 	!req.body.genderInupt ||
	// 	!req.body.emailInput ||
	// 	req.body.passwordInput.length < 8 ||
	// 	req.body.passwordInput !== req.body.confirmPasswordInput
	// ) {
	// 	let notice = "Andmed on puudu või miski on vigane"
	// 	console.log(notice);
	// 	return res.render("signup", {notice: notice});
	// }
	try {
		conn = await mysql.createConnection(dbConf);
		//kontrollin egea sellist kasutajat pole juba olemas
		 let sqlReq ="SELECT id from users WHERE email = ?";
		const [users] = await conn.execute(sqlReq, [req.body.emailInput]);
		if (users.length > 0){
			notice = "See kasutaja on juba olemas!";
			console.log(notice);
			return res.render("signup", {notice: notice});
		}
        //krüpteerime parooli
        const pwdHash = await argon2.hash(req.body.passwordInput);
        console.log(pwdHash);

        
        
        sqlReq = "INSERT INTO users (first_name, last_name, birth_date, gender, email, password) VALUES(?,?,?,?,?,?)"
        const [result] = await conn.execute(sqlReq, [req.body.firstNameInput, req.body.lastNameInput,
             req.body.birthDateInput, req.body.genderInput, req.body.emailInput, pwdHash]);
        res.render("signup", {notice: "Konto loodud"}); 
    } catch (error) {
        console.log(error);
        res.render("signup", {notice: "Tekkis viga"});
    } finally {
      if (conn) {
        await conn.end();
      }  
    }
    
};

module.exports = {
    signupPage,
	signupPagePost
}