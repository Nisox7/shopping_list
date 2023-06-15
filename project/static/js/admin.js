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
    url: '/admin/register',
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

document.addEventListener('DOMContentLoaded', function() {

  let editLinks = document.querySelectorAll('.editLink');
  let deleteLinks = document.querySelectorAll('.deleteLink');

    //---------Edit modal---------
    editLinks.forEach(function(link) {
      link.addEventListener('click', function(event) {
        event.preventDefault();
        
        var modal = new bootstrap.Modal(document.getElementById('changeUserModal'));

        var userId = this.dataset.userId;
        var userAdmin = this.dataset.userAdmin;
        var userName = this.dataset.userName;
        var userEmail = this.dataset.userEmail;

        // Set the value of the input field in the modal
        var userIdInput = document.getElementById('userIdInput');
        userIdInput.value = userId;

        var userNameInput = document.getElementById("nameInput");
        userNameInput.value = userName;

        var userEmailInput = document.getElementById("emailInput");
        userEmailInput.value = userEmail;

        var adminInput = document.getElementById("adminInput");

        if (userAdmin === "True"){
            adminInput.checked = true;
        } else if (userAdmin === "False"){
            adminInput.checked = false;
        }
  
        // Open the modal
        modal.show();
  
      });
    });
    

    //---------Delete modal---------
    deleteLinks.forEach(function(deleteLink) {
      deleteLink.addEventListener('click', function(event) {
        event.preventDefault();
        
        var deleteModal = new bootstrap.Modal(document.getElementById('deleteUserModal'));


        var deleteUserId = this.dataset.userId;
        var deleteUserEmail = this.dataset.userEmail;
        
        var deleteUserIdInput = document.getElementById('deleteUserIdInput');
        deleteUserIdInput.value = deleteUserId;

        var modalUserText = document.getElementById("modalUserText");
        modalUserText.innerHTML=`<b>${deleteUserEmail}</b>`;
        

        deleteModal.show();
        })
    })
});