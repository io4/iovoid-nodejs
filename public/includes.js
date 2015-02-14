//begin of includes.js
(function(){
 var head= document.getElementById("head");
 head.innerHTML=head.innerHTML+'<script src="javascripts/cookies.js">'
  if(location.protocol=="http:"){ 
   if(readCookie("NO_SSL")=="true"){  
    if(confirm("You are not using SSL (security layer), Press Yes or Acept to use it.")){
      location.href="https://"+location.host+location.pathname;
    } else {
       createCookie("NO_SSL", "true")
    }
   }
  }
})()
//end of includes.js
