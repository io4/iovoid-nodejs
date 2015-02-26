//BEGIN OF FILE
var JS=$("#insertjshere").html()
$("#insertjshere").html(JS+"<script type="text/javascript" src="javscripts/cookies.js"></script>"+"<script>
if(location.pathname=="/"){
if(readCookie("lang")=="en"){
} else {
if(confirm("Deseas ver la versión en español?/nDo you want to see the spanish version?")){
createCookie("lang", "sp");
location.href="/spanish";
} else {
createCookie("lang", "en");
}
}
} else {
if(readCookie("lang")=="sp"){
location.href="/spanish";
}
}
</script>")
//END OF FILE