window.currentRaygunScreen = 'dashboard';
let gun = Gun([`${window.location.href}gun`])
window.raygun = gun.get('raygun');
window.hostName = window.location.host;
window.currentDimension = null;
window.userIsTyping = false;



$(document).ready(() => {

  window.thisUsername = $('#username').text();
  window.thisUserId = $('#userId').text();
  window.thisUserHash = $('#userHash').text()
  window.usergun = raygun.user()
  if(thisUserId.length > 0 && thisUserHash.length > 0){
    usergun.auth(thisUserId, thisUserHash);
  }

  $(window).on('keydown', (e) => {
    if(e.metaKey && e.keyCode == 83 || e.ctrlKey && e.keyCode == 83) {
      e.preventDefault();
    }
  })

})
