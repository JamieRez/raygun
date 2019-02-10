let gun = Gun([`${window.location.href}gun`])
window.raygun = gun.user()

$(document).ready(() => {

  let username = $('#username').text();
  let userHash = $('#userHash').text();

  if(username.length > 0 && userHash.length > 0){

    raygun.auth(username, userHash);

  }

})
