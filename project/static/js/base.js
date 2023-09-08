document.addEventListener('DOMContentLoaded', function() {

  //-----------Transitions between pages-----------

  window.setTimeout(function() {
    document.body.className = '';
  }, 230);

  //-----------Nav-Links - Active links-----------

    var navLinks = document.querySelectorAll('.nav-link');
    var themeToggle = document.querySelector('.theme-toggle');
  
    // Add event listener to each navigation link
    function addClickListenerToNavLinks() {
      navLinks.forEach(function(navLink) {
        navLink.addEventListener('click', function(event) {
          // Remove active class from all navigation links except the theme toggle
          if (!this.classList.contains('dropdown-toggle')) {
            navLinks.forEach(function(link) {
              link.classList.remove('active');
            });
          }
  
          // Add active class to the clicked navigation link
          this.classList.add('active');
        });
      });
    }
  
    // Check if the link's href matches the current page URL
    navLinks.forEach(function(navLink) {
      if (navLink.href === window.location.href) {
        navLink.classList.add('active');
      }
    });
  
    addClickListenerToNavLinks();
  });
