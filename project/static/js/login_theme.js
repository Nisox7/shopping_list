//------------------Theme------------------

function toggleTheme(theme){
    document.documentElement.setAttribute('data-bs-theme',theme);
    localStorage.setItem("theme",theme);
    if (theme == "light"){
        document.getElementById("card").style.backgroundColor="#fff";
        document.body.style.backgroundColor="#efefef";
    }
    else{
        document.getElementById("card").style.color="#fff"
        document.getElementById("card").style.backgroundColor="rgb(43,48,53)";
        document.body.style.backgroundColor="#212529";
    }
  }


let localTheme = localStorage.getItem('theme');

if (localTheme == null){
  console.log("Theme not saved on localStorage");
  const darkThemeMq = window.matchMedia("(prefers-color-scheme: dark)");
  if (darkThemeMq['matches'] === true){
    toggleTheme("dark");
    document.getElementById("card").style.color="#fff"
    document.getElementById("card").style.backgroundColor="rgb(43,48,53)"
    document.body.style.backgroundColor="#212529";
  }
  else{
    toggleTheme("light");
  }
}
else{
  toggleTheme(localTheme);
}
