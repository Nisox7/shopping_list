let localList = localStorage.getItem('list');
//console.log(localList);

let listNameText = document.getElementById("listNameText");
listNameText.innerText=localList;

let amountItems = 0;
let textAmountItems = document.getElementById("amount-items");

let saveCheckDebounceTimer;
//retraso a la hora de escribr en la bbdd


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
          console.log(elements); // Imprime cada elemento en la consola
          let elementsText = elements[0];
          let elementsChecked = elements[1];

          addElementsToList(elementsText,true,elementsChecked);
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



function loadItem(element,elementId){
  let jsonValues = {item: element, item_id: `id-${elementId}`, list: localList};


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

function addElementsToList(element,addedFromDb,checked){

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

      if (checked==0){

      newItem.innerHTML = `
    <input class="form-check-input me-1 checkbox-input" type="checkbox" value="" elementValue="${element}" id="id-${elementId}" onchange="checkCheckedButtons()">
    <label class="form-check-label" for="element-${elementId}" id="element-id-${elementId}">${element}</label>
      `;
      }

      else if (checked==1){

        newItem.innerHTML = `
      <input class="form-check-input me-1 checkbox-input" type="checkbox" value="" elementValue="${element}" id="id-${elementId}" onchange="checkCheckedButtons()" checked>
      <label class="form-check-label" for="element-${elementId}" id="element-id-${elementId}"><s>${element}</s></label>
        `;
      }
      
      else{
        newItem.innerHTML = `
        <input class="form-check-input me-1 checkbox-input" type="checkbox" value="" elementValue="${element}" id="id-${elementId}" onchange="checkCheckedButtons()">
        <label class="form-check-label" for="element-${elementId}" id="element-id-${elementId}">${element}</label>
          `
      }

    
      completeList.appendChild(newItem);
      //showtoast
    
      if (addedFromDb != true){
        console.log("Cargando desde el input")
        loadItem(element,elementId);
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


function saveButton(state){

  let savingButton = document.getElementById("save-button");

  if (state == "saving"){
    savingButton.setAttribute("disabled","true");
    savingButton.innerHTML=`
    <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
            Saving...
    `
  }

  else if (state == "save"){
    savingButton.innerHTML=`<i class="bi bi-save"></i>`
    savingButton.removeAttribute("disabled");
  }

  else if (state == "failed"){
    savingButton.removeAttribute("disabled");
    savingButton.innerHTML=`
            Failed to save
    `
  }

}

// Objeto para almacenar los cambios en el estado de los elementos
let changes = {};

function checkCheckedButtons() {
  let checkBoxesList = document.querySelectorAll(".checkbox-input");

  for (let checkBox of checkBoxesList) {
    var elementId = checkBox.id;
    var actualElement = document.getElementById(`element-${elementId}`);
    var actualElementValue = actualElement.textContent;

    if (checkBox.checked) {
      changes[elementId] = true; // Elemento marcado para tachar
      actualElement.innerHTML = "<s>" + actualElementValue + "</s>";
      //console.log(`checked: ${actualElementValue}`);
    } else {
      changes[elementId] = false; // Elemento desmarcado, eliminar el cambio
      actualElement.innerHTML = actualElementValue;
      //console.log(`unchecked: ${actualElement.textContent}`);
    }
  }

  deleteButton(true);

  //console.log("-------------------------");
  clearTimeout(saveCheckDebounceTimer);

  // Configurar un nuevo temporizador de 3 segundos
  saveCheckDebounceTimer = setTimeout(writeChangesToDatabase, 2000);
  //writeChangesToDatabase(); // Escribir los cambios en la base de datos
}



function writeChangesToDatabase() {
  // Aquí puedes implementar la lógica para escribir los cambios en la base de datos
  // Recorre el objeto "changes" y envía los cambios a la base de datos
  //for (let elementId in changes) {
    // Aquí puedes usar AJAX, fetch o cualquier método adecuado para enviar los cambios a la base de datos
    //console.log(`Escribir en la base de datos: ${elementId}`);
  //}

  let list_changes = {list: localList, changes};

  console.log(list_changes);

  saveButton("saving");

  $.ajax({
    url: '/items/checked',
    type: 'POST',
    data: JSON.stringify(list_changes),
    contentType: 'application/json',
    success: function(response) {
        // Recibe la respuesta del servidor
        console.log(response);
        if (response['message'] == "True"){
          saveButton("save");
        }
        else if (response['message'] == "False"){
          saveButton("failed");
        }
    },
    error: function(error) {
        // Ocurrió un error al enviar los datos
        console.log(error);
        saveButton("failed");
    }
  });

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
      amountItems --;
      textAmountItems.innerText=`${amountItems} items`
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
    }
    else{
      showToast(`Deleted ${amount} items`);
      deleteButton();
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

  deleteList();

});


document.getElementById('save-button').addEventListener('click',()=>{
  writeChangesToDatabase();
})