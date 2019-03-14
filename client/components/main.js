window.currentRaygunScreen = 'dashboard';
window.loadedIdeas = {};
window.loadedThings = {};
window.userPubKey = null;

let gun;
if(window.location.href == 'http://localhost:3000/'){
  gun = Gun([`${window.location.origin}/gun`])
}else{
  gun = Gun([`${window.location.origin}/gun`, `https://www.raygun.live/gun`])
}
window.hostName = window.location.host;
window.currentDimension = null;
window.userIsTyping = false;

$(document).ready(() => {

  window.raygunPublicKey = $('#raygunPublicKey').text();
  window.thisUsername = $('#username').text();
  window.thisUserId = $('#userId').text();
  window.thisUserHash = $('#userHash').text()
  window.raygun = gun.user()
  window.maingun = gun.user(raygunPublicKey);
  if(thisUserId.length > 0 && thisUserHash.length > 0){
    raygun.auth(thisUserId, thisUserHash);
  }

  $(window).on('keydown', (e) => {
    if(e.metaKey && e.keyCode == 83 || e.ctrlKey && e.keyCode == 83) {
      e.preventDefault();
    }
  })

})
