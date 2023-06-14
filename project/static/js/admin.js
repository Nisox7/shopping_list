document.addEventListener('DOMContentLoaded', function() {
    
    //---------Edit modal---------
    var editLinks = document.querySelectorAll('.editLink');
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
    var deleteLinks = document.querySelectorAll('.deleteLink');
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
  