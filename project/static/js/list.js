var socket = io();

function getListFromURL () {
  var url = window.location.href;
  var parts = url.split("/");
  var filteredWord = parts[parts.length - 1];

  return filteredWord;
}

let listNameText = document.getElementById("listNameText");

let amountItems = 0;
let textAmountItems = document.getElementById("amount-items");

let saveCheckDebounceTimer;
//retraso a la hora de escribr en la bbdd


//API Connection
//Get elements

const localListId = getListFromURL();

function loadItems(addedFromInput){

  amountItems = 0;

  const itemsList = document.getElementById("itemsList");

  $.ajax({
    url: `/items/${localListId}`,
    type: 'GET',
    contentType: 'application/json',
    success: function(response) {
      itemsList.replaceChildren();
  
      listNameText.innerText=(response['list_name'])
  
        for (let i = 0; i < response['items'].length; i++) {
          let items = response['items'][i];
          //console.log(items);
  
          let elementsText = items['name'];
          let elementsChecked = items['is_checked'];
          let elementId = items['id'];
  
          addElementsToList(elementsText,elementId,elementsChecked);
        }
    },
    error: function(error) {
        // Ocurrió un error al enviar los datos
        console.log(error);
        showToast(`Error: ${error}`);
    }
  });
}


$(document).ready(function() {

  loadItems();

  socket.on('connect', function() {
    console.log('Connected to the SocketIO server!');
  });

  socket.on("reloadItems", function(data){
    console.log(data);
    loadItems();
  });

});


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



function createItem(item){
  let jsonValues = {item: item, listId: localListId, amount: 0};


  $.ajax({
    url: '/items/create',
    type: 'POST',
    data: JSON.stringify(jsonValues),
    contentType: 'application/json',
    success: function(response) {
        // Recibe la respuesta del servidor
        if (response['message'] == "True"){
          showToast(`Added item: ${item}`)
          socket.emit("itemChanges");
        }
    },
    error: function(error) {
        // Ocurrió un error al enviar los datos
        console.log(error);
        showToast(`Error ${error} adding item`)
    }
});
}


function deleteItem(elementId){
  
  let jsonValues = {id: elementId, listId: localListId};


  $.ajax({
    url: '/items/delete',
    type: 'POST',
    data: JSON.stringify(jsonValues),
    contentType: 'application/json',
    success: function(response) {
        // Recibe la respuesta del servidor
        console.log(response);
        if (response['message'] == "True"){
          socket.emit("itemChanges");
        }
    },
    error: function(error) {
        // Ocurrió un error al enviar los datos
        console.log(error);
    }
  });
}


//--------------------Add elements to the list----------------------

function addElementsToList(element,elementId,checked,addedFromInput){

  //console.log(checkSpecialChars(element));
    
  //console.log(element);
  completeList = document.querySelector(".list-group");
  let newItem = document.createElement("LI");
    
  //console.log(elementId);
  newItem.classList.add(`list-group-item`,`class-id-${elementId}`);

  if (checked==0){

    newItem.innerHTML = `

    <input
      class="form-check-input me-1 checkbox-input"
      type="checkbox"
      value=""
      elementValue="${element}"
      id="${elementId}"
      onchange="checkCheckedButtons()"
    >
    
    <label
      class="form-check-label"
      for="${elementId}"
      id="element-id-${elementId}"
      >${element}
    </label>
    `;
  }

  else if (checked==1){

    newItem.innerHTML = `
  <input
    class="form-check-input me-1 checkbox-input"
    type="checkbox"
    value=""
    elementValue="${element}"
    id="${elementId}"
    onchange="checkCheckedButtons()"
    checked
  >
  
  <label
    class="form-check-label"
    for="${elementId}"
    id="element-id-${elementId}">
    <s>${element}</s>
  </label>
    `;
  }

    
  completeList.appendChild(newItem);
  //showtoast

  amountItems++;
      
  textAmountItems.innerText=`${amountItems} items` 
  //console.log(amountItems);

  if (addedFromInput==false){
    showToast(`Added ${element} to the list`);
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

let changes = {};

function checkCheckedButtons() {
  
  let checkBoxesList = document.querySelectorAll(".checkbox-input");

  for (let checkBox of checkBoxesList) {
    var elementId = checkBox.id;
    var actualElement = document.getElementById(`element-id-${elementId}`);

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
  saveCheckDebounceTimer = setTimeout(writeChangesToDatabase, 250);
  //writeChangesToDatabase(); // Escribir los cambios en la base de datos
}



function writeChangesToDatabase() {
  // Aquí puedes implementar la lógica para escribir los cambios en la base de datos
  // Recorre el objeto "changes" y envía los cambios a la base de datos
  //for (let elementId in changes) {
    // Aquí puedes usar AJAX, fetch o cualquier método adecuado para enviar los cambios a la base de datos
    //console.log(`Escribir en la base de datos: ${elementId}`);
  //}
  saveButton("saving");


  $.ajax({
    url: '/items/checked',
    type: 'POST',
    data: JSON.stringify(changes),
    contentType: 'application/json',
    success: function(response) {
        // Recibe la respuesta del servidor
        console.log(response);
        if (response['message'] == "True"){
          saveButton("save");
          socket.emit("itemChanges");
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

  changes={}

}



//------------------Remove checked boxes---------------------


function removeCheckedBoxes(){
  let amount = 0;
  let checkBoxesList = document.querySelectorAll(".checkbox-input");
  let forDelete = []

  for (let checkBoxes of checkBoxesList){
    if (checkBoxes.checked == true){

      //console.log(checkBoxes)

      let elementId = checkBoxes.id;
      forDelete.push(elementId);

      console.log(elementId)

      //console.log("PRESIONADO:")
      //console.log(checkBoxes.id);
      let classForRemove = document.querySelector(`.class-id-${checkBoxes.id}`);
      classForRemove.remove();

      amountItems --;
      textAmountItems.innerText=`${amountItems} items`
      amount++;
    }
    else{
      //console.log(checkBoxes);
    }
  }

  console.log(forDelete);

  if (amount == 0){
    showToast("Select an item for delete!");
  }
  else if (amount ==1){
    showToast(`Deleted ${amount} item`);
    deleteButton();
    deleteItem(forDelete);
  }
  else{
    showToast(`Deleted ${amount} items`);
    deleteButton();
    deleteItem(forDelete);
  } 

  //console.log(checkBoxesList);
}



function deleteList(){
    let jsonValues = {list: localListId};

    $.ajax({
      url: '/lists/delete',
      type: 'POST',
      data: JSON.stringify(jsonValues),
      contentType: 'application/json',
      success: function(response) {
          // Recibe la respuesta del servidor
          //console.log(response);
          if (response['message'] == "True"){
            socket.emit("listChanges");
            showToast("List deleted. Backing home...")
            setTimeout(function() {
                location.href=indexUrl;
                }, 1200);
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

//Add item button
let addItemBtn = document.getElementById('button-addon');
var itemsInput = document.getElementById('add-items-input');

//Add item button
addItemBtn.addEventListener('click',()=>{

  if (itemsInput.value == ""){
    showToast("Can't add an empty item!");
    itemsInput.value="";
  }
  else{
    createItem(itemsInput.value);
    //clear the input
    itemsInput.value="";
  }
})

//Enter key
itemsInput.addEventListener("keypress", function(event) {

  // If the user presses the "Enter" key on the keyboard
  if (event.key === "Enter") {
    // Cancel the default action
    event.preventDefault();
    // Trigger the button element with a click

    if (itemsInput.value == ""){
      showToast("Can't add an empty item!");
      itemsInput.value="";
    }
    else{
      createItem(itemsInput.value);
      //clear the input
      itemsInput.value="";
    }
  }
});



//Delete button
document.getElementById('buttons-delete').addEventListener('click',()=>{
  removeCheckedBoxes();
})

let clickCount=0;

const deleteListButton = document.getElementById("buttons-list-delete");

deleteListButton.addEventListener('click',()=>{

  deleteList();

});

//Save button button

document.getElementById('save-button').addEventListener('click',()=>{
  writeChangesToDatabase();
})
