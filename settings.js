let mainset = document.querySelectorAll(".mainset");
let switchBtn = document.getElementById("Switch-btn");
//  localStorage.setItem("theme","default-mode");
if(localStorage.getItem("theme")==="lighter-mode"){
    mainset.forEach(element=>
 
 element.classList.add("lighter-mode")
  );
 
    localStorage.setItem("theme","default-mode");
 
}
switchBtn.addEventListener("click", function () {
if(localStorage.getItem("theme")==="default-mode" || localStorage.length
=== 0){
    mainset.forEach(element=>
 
 element.classList.add("lighter-mode")
  );
 
    localStorage.setItem("theme","lighter-mode");
 
}
else{
    mainset.forEach(Element=>
 
 Element.classList.remove("lighter-mode")
  );
  localStorage.setItem("theme","default-mode");
}

});

