window.currentRaygunScreen = 'dashboard';
window.userDims;

let gun;
if(window.location.href == 'http://localhost:3000/'){
  gun = Gun([`${window.location.href}gun`])
}else{
  gun = Gun([`${window.location.href}gun`, `https://www.raygun.live/gun`])
}
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
