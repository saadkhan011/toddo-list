
// module.exports = getDate;
module.exports.getDate = getDate;
function getDate(){
    let option = {
        weekday : "long",
        // year : "numeric",
        month : "long",
        day : "numeric"
    }
    const date  = new Date();
    return  date.toLocaleDateString("en-US", option);
}
module.exports.getDay = getDay;
function getDay(){
    let option = {
    weekday : "long",
}
const date  = new Date();
return date.toLocaleDateString("en-US", option);
}