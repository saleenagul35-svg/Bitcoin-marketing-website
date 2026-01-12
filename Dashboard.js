let mainset = document.querySelectorAll(".mainset");
if (localStorage.getItem("theme") === "lighter-mode") {
    mainset.forEach(function (element) {
        element.classList.add("lighter-mode");

    });
}else{
      mainset.forEach(function (element) {
        element.classList.remove("lighter-mode");

    }); 
}