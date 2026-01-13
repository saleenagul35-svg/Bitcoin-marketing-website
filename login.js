let form = document.getElementById("animation");

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

document.getElementById("email").oninput=function(){
let EmailInput = this.value
sessionStorage.setItem("email",EmailInput);
}
document.getElementById("password").oninput=function(){
let passwordInput = this.value;
sessionStorage.setItem("password",passwordInput);
}
document.getElementById("passwordRepeat").oninput=function(){
    let passwordRepeatInput = this.value;
    sessionStorage.setItem("passwordRepeat", passwordRepeatInput)
}

let signupbtn = document.getElementsByClassName("signupbtn");
signupbtn[0].onclick = function(){
if(sessionStorage.getItem("email")&&sessionStorage.getItem("password")&&sessionStorage.getItem("passwordRepeat")){

    form.style.display="none";
    alert("Congrats you are successfully Logged in");
    

}else{
    alert("kindly fill the form to Log In / Sign Up")
}

}

form.addEventListener("submit",function(event){
    form.style.display="none";
    event.preventDefault();
})


