//const chest = document.getElementById("chest");

//chest.addEventListener("click", () => {
  //window.location.href = "main.html";
//});
chest.addEventListener("click", () => {
  chest.style.filter = "brightness(3) white-balance(20%)"; // Quick flash
  setTimeout(() => {
    window.location.href = "main.html";
  }, 200); 
});