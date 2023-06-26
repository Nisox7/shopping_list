
//------------------Theme------------------

document.addEventListener("DOMContentLoaded", function () {

    var theme = localTheme;

    if (theme=="light"){
        document.body.style.backgroundColor = "#f8f9fa"//"#e2e8f0";
        const cards = document.querySelectorAll(".card");
        
        cards.forEach(card => {
            card.style.backgroundColor="#ffffff";
        });
      }
    else if (theme=="dark"){
        document.body.style.backgroundColor = "#212529";
        const cards = document.querySelectorAll(".card");
        
        cards.forEach(card => {
            card.style.backgroundColor="#2b3035";
        });
        
  }
});