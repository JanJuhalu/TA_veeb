//function dateNowFormattedET(){
exports.dateNowFormattedET = function(){

    const timeNow = new Date();
    const monthNamesET = ["jaanuar", "veebruar", "märts", "aprill", "mai", "juuni", "juuli", "august", "september", "oktoober", "november", "detsember"];
    //return dateNow + "." + (monthNow + 1) + "." + yearNow;
    return timeNow.getDate() + ". " + monthNamesET[timeNow.getMonth()] + " " + timeNow.getYear();
}