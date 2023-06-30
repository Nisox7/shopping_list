let userRegisterButton = document.getElementById("registersInput");

const toastAddedItem = document.getElementById('liveToast');

function showToast(text){
  document.getElementById("toastBodyText").innerHTML = text;
  const toastAdded = bootstrap.Toast.getOrCreateInstance(toastAddedItem);
  toastAdded.show();
}


//change the state of the button (from the backend)
function toggleRegisterButton(){
  let actualStatus = userRegisterButton.getAttribute("data-register-status");
  if (actualStatus == "False"){
    userRegisterButton.checked=false;
  }
  else if (actualStatus == "True"){
    userRegisterButton.checked=true;
  }
}



function userRegisterBtnClicked(){
  let buttonStatus = userRegisterButton.checked;

  let jsonValues = {"buttonStatus":buttonStatus};
  console.log(buttonStatus);

  $.ajax({
    url: '/admin/newUsersRegister',
    type: 'POST',
    data: JSON.stringify(jsonValues),
    contentType: 'application/json',
    success: function(response) {
        // Recibe la respuesta del servidor
        showToast(`Changed register status to <b>${response}</b>`);
        
    },
    error: function(error) {
        // Ocurrió un error al enviar los datos
        console.log(error);
    }
  });
}




toggleRegisterButton();