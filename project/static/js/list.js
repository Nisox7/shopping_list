let localList = localStorage.getItem('list');
//console.log(localList);

let listNameText = document.getElementById("listNameText");
listNameText.innerText=localList;

let amountItems = 0;
let textAmountItems = document.getElementById("amount-items");


//API Connection
//Get elements

let jsonValues = {list: localList};

$.ajax({
  url: '/items/list',
  type: 'POST',
  data: JSON.stringify(jsonValues),
  contentType: 'application/json',
  success: function(response) {
      // Recibe la respuesta del servidor
      //console.log(response);
      if (response['message'] == "True"){

        for (let i = 0; i < response.elements.length; i++) {
          let elements = response.elements[i];
          //console.log(elements); // Imprime cada elemento en la consola
            
          addElementsToList(elements,true);
        }
      }
  },
  error: function(error) {
      // Ocurrió un error al enviar los datos
      console.log(error);
      showToast(`Error: ${error}`);
  }
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



function loadItem(element,elementId,amountItems){
  let jsonValues = {item: element, item_id: `id-${elementId}`, amount_items: amountItems, list: localList};


  $.ajax({
    url: '/items/create',
    type: 'POST',
    data: JSON.stringify(jsonValues),
    contentType: 'application/json',
    success: function(response) {
        // Recibe la respuesta del servidor
        if (response['message'] == "True"){
          showToast(`Added item: ${element}`)
        }
    },
    error: function(error) {
        // Ocurrió un error al enviar los datos
        console.log(error);
        showToast(`Error ${error} adding item`)
    }
});
}


function deleteItem(elementId,localList){
  
  let jsonValues = {item_id: elementId, list: localList};


  $.ajax({
    url: '/items/delete',
    type: 'POST',
    data: JSON.stringify(jsonValues),
    contentType: 'application/json',
    success: function(response) {
        // Recibe la respuesta del servidor
        console.log(response);
        if (response['message'] == "True"){
        }
    },
    error: function(error) {
        // Ocurrió un error al enviar los datos
        console.log(error);
    }
});
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

      //console.log(checkSpecialChars(element));
    
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
        amountItems++;
        loadItem(element,elementId,amountItems);
        textAmountItems.innerText=`${amountItems} items`
        //console.log(amountItems);
      }
      else{
        amountItems++;
        textAmountItems.innerText=`${amountItems} items`
        //console.log(amountItems);
      }

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

      deleteItem(checkBoxes.id,localList);

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

    $.ajax({
      url: '/lists/delete',
      type: 'POST',
      data: JSON.stringify(jsonValues),
      contentType: 'application/json',
      success: function(response) {
          // Recibe la respuesta del servidor
          //console.log(response);
          if (response['message'] == "True"){
         showToast("List deleted. Backing home...")
         setTimeout(function() {
            location.href=indexUrl;
            }, 2000);
          }
      },
      error: function(error) {
          // Ocurrió un error al enviar los datos
          console.log(error);
          showToast(`Error: ${error}`);
      }
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