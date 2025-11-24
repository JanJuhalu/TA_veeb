const mysql = require("mysql2/promise");
const argon2 = require("argon2");
const session = require("express-session");
const dbInfo = require("../../../vp2025config");

const dbConf = {
    host: dbInfo.configData.host,
    user: dbInfo.configData.user,
    password: dbInfo.configData.passWord,
    database: dbInfo.configData.dataBase
}

const signinPage = (req, res) => {
	res.render("signin", {notice: "Ootan andmeid"});
};

//@desc

const signinPagePost = async (req, res)=>{
	let conn;
	console.log(req.body);
	//andmete valideerimine
	if(
		!req.body.emailInput ||
		!req.body.passwordInput 
	) {
		let notice = "Sisselogimiseandmed on puudulikud või miski on vigane!";
		console.log(notice);
		return res.render("signin", {notice: notice});
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
        let sqlReq = "SELECT id, password FROM users WHERE email = ?";
		//kandilised sulud sest on list?
		const [users] = await conn.execute(sqlReq, [req.body.emailInput]);
		//kas sellise emailiga kasutaja leiti
		if (users.lenght === 0 ){
			return res.render("signin", {notice: "Kasutajatunnus ja/või parool on vale!"});
		}

		const user = users[0];

		//parooli kontrollimine
		const match = await argon2.verify(user.password, req.body.passwordInput);
		if (match){
			//logisime sisse 
			//return res.render("signin", {notice: "Oled sisse loginud!"});
			//paneme sessiooni käima ja määrame sessiooni ühe muutuja
			req.session.userId = user.id; //sessiooni muutuja
			sqlReq = "SELECT first_name, last_name FROM users WHERE id = ?";
			const [users] = await conn.execute(sqlReq, [req.session.userId]);
			req.session.firstName = users[0].first_name;
			req.session.lastName = users[0].last_name;
			return res.redirect ("/home");
		} else{
			//parool oli vale 
			console.log("vale parool")
			return res.render("signin", {notice: "Kasutajatunnus ja/või parool on vale!"});
		}

        // const [result] = await conn.execute(sqlReq, [req.body.firstNameInput, req.body.lastNameInput,
        //      req.body.birthDateInput, req.body.genderInput, req.body.emailInput, pwdHash]);
        // res.render("signin", {notice: "Sisse logitud"}); 
    } catch (error) {
        console.log(error);
        res.render("signin", {notice: "Tekkis viga"});
    } finally {
      if (conn) {
        await conn.end();
      }  
    }
    
};

module.exports = {
    signinPage,
	signinPagePost
}