var articleText= document.getElementById("emph");
var art = articleText.innerHTML ;
var textArea = document.querySelector("textarea");
function myFunction() {
	textArea.style.display = "block";
	textArea.style.opacity = "1";
	textArea.style.height = "60%";
	textArea.style.width = "60%";
	textArea.style.marginTop = "0"
	textArea.style.marginLeft = "auto";
 	textArea.style.marginRight = "auto";
 	textArea.value = art;
    button.style.opacity = "1";
   document.getElementById("button").style.marginLeft = "0";
    document.getElementById("buttonFunction").style.opacity = "1";
     document.getElementById("bFunction").style.display = "inline-block";
      document.getElementById("upload").style.display = "block";
       document.getElementById("uc").style.display = "block";
}

function bFunction(){
	document.getElementById("emph").innerHTML = textArea.value;
	textArea.value = ""
}

function cFunction(){
	textArea.value = ""
}