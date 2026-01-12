let maintran = document.querySelectorAll(".maintran");
if (localStorage.getItem("theme") === "lighter-mode") {
    maintran.forEach(function (element) {
        element.classList.add("lighter-mode");

    });
}else{
      maintran.forEach(function (element) {
        element.classList.remove("lighter-mode");

    }); 
}