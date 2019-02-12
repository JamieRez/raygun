let gun = Gun([`${window.location.href}gun`])
window.raygun = gun.user()
window.currentRaygunScreen = null;

$(document).ready(() => {

  let username = $('#username').text();
  let userHash = $('#userHash').text();

  if(username.length > 0 && userHash.length > 0){

    raygun.auth(username, userHash);

  }

  $(window).on('keydown', (e) => {
    if(e.metaKey && e.keyCode == 83 || e.ctrlKey && e.keyCode == 83) {
      e.preventDefault();
    }
  })

})
