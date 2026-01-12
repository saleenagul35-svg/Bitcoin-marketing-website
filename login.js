let mainlog = document.querySelectorAll(".mainlog");
if (localStorage.getItem("theme") === "lighter-mode") {
    mainlog.forEach(function (element) {
        element.classList.add("lighter-mode");

    });
}else{
      mainlog.forEach(function (element) {
        element.classList.remove("lighter-mode");

    }); 
}