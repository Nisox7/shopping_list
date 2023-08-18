//------------------Theme------------------

function toggleTheme(theme){
    document.documentElement.setAttribute('data-bs-theme',theme);
  }



let localTheme = localStorage.getItem('theme');
  
if (localTheme == null){
  console.log("Theme not saved on localStorage");
  const darkThemeMq = window.matchMedia("(prefers-color-scheme: dark)");
  if (darkThemeMq['matches'] === true){
    toggleTheme("dark");
  }
}
else{
  toggleTheme(localTheme);
}

document.addEventListener("DOMContentLoaded", function () {
  
  document.getElementById('switchThemeLight').addEventListener('click',()=>{
    toggleTheme('light');
    localStorage.setItem('theme', 'light');
  })
    
  document.getElementById('switchThemeDark').addEventListener('click',()=>{
    toggleTheme('dark');
    localStorage.setItem('theme', 'dark');
  })
  
});

