
//------------------Theme------------------

function toggleTheme(theme){
    document.documentElement.setAttribute('data-bs-theme',theme);

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
}
  
let localTheme = localStorage.getItem('theme');
  
if (localTheme == null){
    console.log("Theme not saved on localStorage");
}
else{
    toggleTheme(localTheme);
}
  
document.getElementById('switchThemeLight').addEventListener('click',()=>{
    toggleTheme('light');
    localStorage.setItem('theme', 'light');
})
  
document.getElementById('switchThemeDark').addEventListener('click',()=>{
    toggleTheme('dark');
    localStorage.setItem('theme', 'dark');
})