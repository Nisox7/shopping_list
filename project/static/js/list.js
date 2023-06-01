//API Connection
//Get elements

//const apiServerUrl = "http://192.168.0.186:10510";
//const apiServerUrl = "https://testing_api.linea21.store"; //TESTING
const apiServerUrl = "https://apimain.linea21.store"; //MAIN

let localList = localStorage.getItem('list');
console.log(localList);

let listNameText = document.getElementById("listNameText");
listNameText.innerText=localList;

let amountItems = 0;
let textAmountItems = document.getElementById("amount-items");

//GET METHOD

//fetch(`${apiServerUrl}/items`)
//  .then(res=>res.json())
//  //.then(res=>console.log(res))
//  .then(res=>writeElements(res))  

//POST METHOD

let jsonValues = {list: localList};
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
fetch(`${apiServerUrl}/items`, requestOptions)
    .then(response => response.json())
    .then(data => {
      if (data.message == "Received"){ // Manejar la respuesta del servidor
        console.log("Recibido")
        for (let i = 0; i < data.elements.length; i++) {
            let elements = data.elements[i];
            //console.log(elements); // Imprime cada elemento en la consola
            
            addElementsToList(elements,true);
          }
          
      }
    })
    .catch(error => {
      console.error('Error:', error);
      showToast(`Error: ${error}`);
    });

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


//------------------Toast------------------


const toastAddedItem = document.getElementById('liveToast');

function showToast(text){
  document.getElementById("toastBodyText").innerHTML = text;
  const toastAdded = bootstrap.Toast.getOrCreateInstance(toastAddedItem);
  toastAdded.show();
}



function replaceSpecialCharId(element){

  let elementId = element.replaceAll(" ","");
  elementId=elementId.replace("'",'"')

  //let regex = /[^\w ]/g;
  let regex = /[^0-9a-zA-Z]/g;
  let resultId = elementId.replace(regex, "-");

  //console.log(resultId);

  //return resultId;

}


function checkSpecialChars(element){
  const specialChars = /[`@#$%^&*_+\-=\[\]{};':"\\|<>\/?~]/;
  //quitados para prueba: . () ,  !
  return specialChars.test(element);
}


//--------------------Add elements to the list----------------------

function addElementsToList(element,addedFromDb){

  if (checkSpecialChars(element) == true){
    showToast("Can't add special characters!");
  }
  else{
  
      let elementId = element.replaceAll(" ",""); //reemplaza los espacios por nada
      elementId = elementId.replaceAll(".","-");
      elementId = elementId.replaceAll("(","-");
      elementId = elementId.replaceAll(")","-");
      elementId = elementId.replaceAll(",","-");
      elementId = elementId.replaceAll("!","-");

      console.log(checkSpecialChars(element));
    
      //console.log(element);
      completeList = document.querySelector(".list-group");
      let newItem = document.createElement("LI");
    
      //console.log(elementId);
    
      newItem.classList.add(`list-group-item`,`class-id-${elementId}`);
      newItem.innerHTML = `
    <input class="form-check-input me-1 checkbox-input" type="checkbox" value="" id="id-${elementId}" onClick="deleteButton(true)">
    <label class="form-check-label" for="element-${elementId}" id="element-id-${elementId}">${element}</label>
      `;
    
      completeList.appendChild(newItem);
      //showtoast
    
      if (addedFromDb != true){
        console.log("Cargando desde el input")
    
        let jsonValues = {item: element, item_id: `id-${elementId}`, list: localList};
    
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
    
    
        fetch(`${apiServerUrl}/send`, requestOptions)
          .then(response => response.json())
          .then(data => {
            if (data.message == "Received"){ // Manejar la respuesta del servidor
              showToast(`Added item: ${element}`);
            }
          })
          .catch(error => {
            console.error('Error:', error);
            showToast(`Error: ${error}`);
          });
      }

      amountItems++;
      
      textAmountItems.innerText=`${amountItems} items` 
      //console.log(amountItems);

  }


  

}


function deleteButton(state){
  let deleteButton = document.getElementById("buttons-delete");
  if (state == true){
    deleteButton.removeAttribute("hidden");
  }
  else{
    deleteButton.setAttribute("hidden","true");
  }
}

//------------------Remove checked boxes---------------------


function removeCheckedBoxes(){
  let amount = 0;
  let checkBoxesList = document.querySelectorAll(".checkbox-input");

  for (let checkBoxes of checkBoxesList){
    if (checkBoxes.checked == true){


      let jsonValues = {item_id: checkBoxes.id, list: localList};

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
  
  
      fetch(`${apiServerUrl}/delete`, requestOptions)
        .then(response => response.json())
        .then(data => {
          if (data.message == "Received"){ // Manejar la respuesta del servidor
            console.log("Recibido")
          }
        })
        .catch(error => {
          console.error('Error:', error);
          showToast(`Error: ${error}`);
        });



      //console.log("PRESIONADO:")
      //console.log(checkBoxes.id);
      let classForRemove = document.querySelector(`.class-${checkBoxes.id}`);
      classForRemove.remove();
      amount++;
    }
    else{
      //console.log(checkBoxes);
    }

    if (amount == 0){
      showToast("Select an item for delete!");
    }
    else if (amount ==1){
      showToast(`Deleted ${amount} item`);
      deleteButton();
      amountItems --;
      textAmountItems.innerText=`${amountItems} items` 
    }
    else{
      showToast(`Deleted ${amount} items`);
      deleteButton();
      amountItems --;
      textAmountItems.innerText=`${amountItems} items` 
    }
    
    
    
  }
  //console.log(checkBoxesList);
}



function deleteList(){
    let jsonValues = {list: localList};
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
fetch(`${apiServerUrl}/lists/delete`, requestOptions)
    .then(response => response.json())
    .then(data => {
      if (data.message == "Received"){ // Manejar la respuesta del servidor
        console.log("Recibido");
        showToast("List deleted. Backing home...")
        setTimeout(function() {
            location.href=indexUrl;
        }, 2000);
        
          
      }
    })
    .catch(error => {
      console.error('Error:', error);
      showToast(`Error: ${error}`);
    });


}



//------------------Buttons listeners---------------------

document.getElementById('button-addon').addEventListener('click',()=>{
  var itemsInput = document.getElementById('add-items-input');

  if (itemsInput.value == ""){
    showToast("Can't add an empty item!");
    itemsInput.value="";
  }
  else{
    addElementsToList(itemsInput.value);
    //clear the input
    itemsInput.value="";
  }
})

document.getElementById('buttons-delete').addEventListener('click',()=>{
  removeCheckedBoxes();
})

let clickCount=0;

const deleteListButton = document.getElementById("buttons-list-delete");

deleteListButton.addEventListener('click',()=>{
    clickCount++;
  
    if (clickCount === 1) {
      //deleteListButton.disabled = true;
      deleteListButton.value = "Are you sure?";
    } else if (clickCount === 2) {
      // Ejecutar la acción deseada aquí
      deleteList();
      
      // Restablecer el contador y el estado del botón
      clickCount = 0;
      deleteListButton.disabled = false;
      deleteListButton.textContent = "Presionar dos veces";
    }
});