//API Connection
//Writes the lists from the database

var socket = io();

let listSubText = document.getElementById("listsSubText");

function loadLists(){

  const listsList = document.getElementById("listsList");

  $.getJSON('/lists/all', function(datos) {

    listsList.replaceChildren();

    datos = datos['lists']

      // Manipula los datos en JavaScript
    for (let i = 0; i < datos.length; i++) {
      //console.log(i)
        
      let lists = datos[i];
      //console.log(lists)

      let list = lists['name'];
      let amountItems = lists['amount_items'];
      let listId = lists['id'];
      let listNameId = lists['list_id']
      let created = lists['created']
      let updated = lists['updated']

      addLists(list, amountItems, listId, listNameId, created, updated);
    }
    listSubText.innerHTML=datos.length; 
  });
}

$(document).ready(function() {

  loadLists();

  socket.on('connect', function() {
    //console.log('Connected to the SocketIO server!');
  });

  socket.on("reloadList", function(data){
    //console.log(data);
    loadLists();
  });

});


//Load lists from db

function writeLists(lists){
  for (x in lists){
    let list = lists[x]
    addLists(list,true);
  }
}


function listOnLocal(list, listNameId){
  localStorage.setItem('list', list);
  localStorage.setItem('listNameId', listNameId);
}

//Check special chars

function checkSpecialChars(element){
  //const specialChars = /[`(),.!@#$%^&*_+\-=\[\]{};':"\\|<>\/?~áéíóúÁÉÍÓÚ]/;
  //return specialChars.test(element);

  const regex = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?áéíóúÁÉÍÓÚ ]/;
  return regex.test(element);

}


function serializeDatee(date){
  const utcDate = new Date(date);
  console.log(utcDate)
  const clientOffsetMinutes = -new Date().getTimezoneOffset();
  const adjustedUtcTime = utcDate.getTime() + clientOffsetMinutes * 60000;
  const adjustedDate = new Date(adjustedUtcTime);

  const formattedDate = new Intl.DateTimeFormat('en-US', {
    hour: 'numeric',
    minute: 'numeric',
    timeZone: 'UTC'
  }).format(adjustedDate);


  const formattedText = new Intl.DateTimeFormat('en-US', {
    weekday: 'short', // Display short weekday name (e.g., Thu)
    day: 'numeric',   // Display day of the month (e.g., 17)
    hour: 'numeric',
    minute: 'numeric',
    hour12: false
  }).format(adjustedDate);

  return formattedText
}


function serializeDate(date) {
  const utcDate = new Date(date);
  const clientOffsetMinutes = -new Date().getTimezoneOffset();
  const adjustedUtcTime = utcDate.getTime() + clientOffsetMinutes * 60000;
  const adjustedDate = new Date(adjustedUtcTime);

  const currentDate = new Date();

  if (adjustedDate.getDate() === currentDate.getDate()) {
    // Return formattedDate if the day is the same as the user's browser day
    const formattedDate = new Intl.DateTimeFormat('en-US', {
      hour: 'numeric',
      minute: 'numeric',
      timeZone: 'UTC',
      hour12:false
    }).format(adjustedDate);

    return formattedDate;
  } else {

    // Return formattedText in the desired format (day/month)
    const day = adjustedDate.getDate();
    const month = adjustedDate.getMonth() + 1; // Months are 0-indexed

    return `${day}/${month}`;
  }
}


//-----------------Add lists---------------

function addLists(
    listName, 
    amountItems,
    listId,
    listNameId,
    created,
    updated
  )



  {

    if (updated == null) {

      var dateText = `Created at: ${serializeDate(created)}`
      
    }
    else{
      var dateText = `Updated: ${serializeDate(updated)}`
    }

      //console.log(checkSpecialChars(listName));
    
      //console.log(element);
      completeList = document.querySelector(".lists-list");
      let newList = document.createElement("DIV");

      if (amountItems==1){
        elementText = `${amountItems} item`;
      }
      else if (amountItems == undefined){
        elementText = `0 items`;
      }
      else{
        elementText = `${amountItems} items`;
      }
      
    
      //console.log(elementId);
    
      //newList.classList.add("col-sm-6", "mb-3", "mb-sm-0");
      newList.classList.add("col");
      newList.id = `list-${listId}`
      newList.innerHTML = `
    <div class="card h-100" id="test">
      <div class="card-body">
        <h5 class="card-title">${listName}</h5>
        <p class="card-text">${elementText}</p>
      </div>
      <div class="card-footer d-flex align-items-center justify-content-between">
        <p class="m-0">${dateText}</p>
        <a href="${listUrl}/${listNameId}" class="btn btn-outline-primary" onclick=listOnLocal('${listId}','${listNameId}')>See list</a>
      </div>
    </div>
`;
//<a href="../templates/list.html" class="btn btn-primary" onclick=listOnLocal('${listName}')>See list</a>
//<p class="card-text">X elements</p>
    
      completeList.appendChild(newList);
      //showtoast

}




//------------------Toast------------------


const toastAddedItem = document.getElementById('liveToast');

function showToast(text){
  document.getElementById("toastBodyText").innerHTML = text;
  const toastAdded = bootstrap.Toast.getOrCreateInstance(toastAddedItem);
  toastAdded.show();
}


function addInputLists(listName){
  let jsonValues = {name: listName};

  $.ajax({
    url: '/lists/create',
    type: 'POST',
    data: JSON.stringify(jsonValues),
    contentType: 'application/json',
    success: function(response) {
      //console.log(response)
        // Recibe la respuesta del servidor
        if (response['message'] == "True"){
          showToast(`List ${listName} added`)
          //console.log("RECIBIDO")
          socket.emit("listChanges");
        }
    },
    error: function(error) {
        // Ocurrió un error al enviar los datos
        console.log(error);
        showToast(`Error ${error} adding list`)
    }
  });

}

//------------------Buttons listeners---------------------

let addListBtn = document.getElementById('button-addon');
var listsInput = document.getElementById('add-lists-input');

//Add list button
addListBtn.addEventListener('click',()=>{
  
  if (listsInput.value == ""){
    showToast("Can't add an empty list!");
    listsInput.value="";
  }
  else{
    addInputLists(listsInput.value);
    //clear the input
    listsInput.value="";
  }
})

//add list with enter key

listsInput.addEventListener("keypress", function(event) {

  // If the user presses the "Enter" key on the keyboard
  if (event.key === "Enter") {
    // Cancel the default action
    event.preventDefault();
    // Trigger the button element with a click

    if (listsInput.value == ""){
      showToast("Can't add an empty list!");
      listsInput.value="";
    }
    else{
      addInputLists(listsInput.value);
      //clear the input
      listsInput.value="";
    }
  }
});