window.currentRaygunScreen = null;
let gun = Gun([`${window.location.href}gun`])
window.raygun = gun.get('raygun');
window.hostName = window.location.host;

$(document).ready(() => {

  $(window).on('keydown', (e) => {
    if(e.metaKey && e.keyCode == 83 || e.ctrlKey && e.keyCode == 83) {
      e.preventDefault();
    }
  })

})
