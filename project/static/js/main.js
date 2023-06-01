//API Connection
//Get elements

const apiServerUrl = "http://192.168.0.186:10510";
//const apiServerUrl = "https://testing_api.linea21.store"; //TESTING
//const apiServerUrl = "https://apimain.linea21.store"; //MAIN

//Load lists from db

function writeLists(lists){
  for (x in lists){
    let list = lists[x]
    addLists(list,true);
  }
}

fetch(`${apiServerUrl}/lists/list`)
  .then(res=>res.json())
  //.then(res=>console.log(res))
  .then(res=>writeLists(res))


function listOnLocal(list){
  localStorage.setItem('list', list);
}

//------------------Theme------------------

function toggleTheme(theme){
  document.documentElement.setAttribute('data-bs-theme',theme);
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

//Check special chars

function checkSpecialChars(element){
  //const specialChars = /[`(),.!@#$%^&*_+\-=\[\]{};':"\\|<>\/?~áéíóúÁÉÍÓÚ]/;
  //return specialChars.test(element);

  const regex = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?áéíóúÁÉÍÓÚ ]/;
  return regex.test(element);

}

//-----------------Add lists---------------

function addLists(listName, addedFromDb){

  if (checkSpecialChars(listName) == true){
    showToast("Can't add a list with special characters or spaces!");
  }
  else{
  
      //console.log(checkSpecialChars(listName));
    
      //console.log(element);
      completeList = document.querySelector(".lists-list");
      let newList = document.createElement("DIV");
    
      //console.log(elementId);
    
      newList.classList.add("col-sm-6", "mb-3", "mb-sm-0", `id${listName}`);
      newList.innerHTML = `
    <div class="card">
      <div class="card-body">
        <h5 class="card-title">${listName}</h5>
        <p class="card-text"></p>
        <a href="${listUrl}" class="btn btn-primary" onclick=listOnLocal('${listName}')>See list</a>
      </div>
    </div>
`;
//<a href="../templates/list.html" class="btn btn-primary" onclick=listOnLocal('${listName}')>See list</a>
//<p class="card-text">X elements</p>
    
      completeList.appendChild(newList);
      //showtoast
    
      if (addedFromDb != true){
        console.log("Cargando desde el input")
    
        let jsonValues = {list: listName};
    
        jsonBody = JSON.stringify(jsonValues);
    
    
        // Objeto de configuración de la solicitud
        var requestOptions = {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: jsonBody
    
        };
    
        // Realizar la solicitud
    
    
        fetch(`${apiServerUrl}/lists/create`, requestOptions)
          .then(response => response.json())
          .then(data => {
            if (data.message == "Received"){ // Manejar la respuesta del servidor
              showToast(`Added list: ${listName}`);
            }
          })
          .catch(error => {
            console.error('Error:', error);
            showToast(`Error: ${error}`);
          });
      }

  }

}




//------------------Toast------------------


const toastAddedItem = document.getElementById('liveToast');

function showToast(text){
  document.getElementById("toastBodyText").innerHTML = text;
  const toastAdded = bootstrap.Toast.getOrCreateInstance(toastAddedItem);
  toastAdded.show();
}



//------------------Buttons listeners---------------------

document.getElementById('button-addon').addEventListener('click',()=>{
  var listsInput = document.getElementById('add-lists-input');

  if (listsInput.value == ""){
    showToast("Can't add an empty list!");
    listsInput.value="";
  }
  else{
    addLists(listsInput.value);
    //clear the input
    listsInput.value="";
  }
})