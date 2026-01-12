let mainhome = document.querySelectorAll(".mainhome");
if (localStorage.getItem("theme") === "lighter-mode") {
    mainhome.forEach(function (element) {
        element.classList.add("lighter-mode");

    });
}else{
      mainhome.forEach(function (element) {
        element.classList.remove("lighter-mode");

    }); 
}