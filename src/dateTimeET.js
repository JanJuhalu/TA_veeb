//function dateNowFormattedET(){
const dateNowFormattedET = function(){

    const timeNow = new Date();
    const monthNamesET = ["jaanuar", "veebruar", "märts", "aprill", "mai", "juuni", "juuli", "august", "september", "oktoober", "november", "detsember"];
    //return dateNow + "." + (monthNow + 1) + "." + yearNow;
    return timeNow.getDate() + ". " + monthNamesET[timeNow.getMonth()] + " " + timeNow.getYear();
}

const timeNowFormattedET = function(){
    let timeNow = new Date();
    return timeNow.getHours() + ":" + timeNow.getMinutes() + ":" + timeNow.getSeconds();
}

const weekDayET = function(){
    const weekDayNames = ["pühapäev", "esmaspäev", "teisipäev", "kolmapäev", "neljapäev", "reede", "laupäev"];
    let timeNow = new Date();
    return weekDayNames[timeNow.getDay()];
}

const partOfDay = function(){
    let dayPart = "suvaline aeg";
    let hourNow = new Date().getHours();
    if (hourNow <= 6){
        dayPart = "varahommik";   
    } else if (hourNow < 12){
        dayPart = "hommik";
    } else if (hourNow ==12){
        dayPart = "keskpäev";
    }
    return dayPart;

}

module.exports = {fullDate: dateNowFormattedET, fullTime: timeNowFormattedET, weekDay: weekDayET, partOfDay: partOfDay};