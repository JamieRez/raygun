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
  $('.loadingRayGun').css('display', 'none');

  window.raygunPublicKey = $('#raygunPublicKey').text();
  window.thisUsername = $('#username').text();
  window.thisUserId = $('#userId').text();
  window.thisUserHash = $('#userHash').text()
  window.raygun = gun.user()
  window.maingun = gun.user(raygunPublicKey);
  if(thisUserId.length > 0 && thisUserHash.length > 0){
    raygun.auth(thisUserId, thisUserHash);
  }

  //Initialize RayGun if on the raygun domain or localhost
  if(window.location.hostname == 'www.raygun.live' || window.location.hostname == 'localhost'){
    $('.raygun').css("display", 'flex');
  }

  if(!thisUserId){
    $('.auth').css('display', 'flex');
    $('.raygun').css('display', 'none');
  }

  //Going to domain dimension if applicable
  if(window.location.pathname != '/'){
    maingun.get('path').get(window.location.pathname).once((dimId) => {
      if(dimId){
        maingun.get(`dimension/${dimId}`).load((dim) => {
          if(dim){
            let thisDim = new Dimension(dim);
            maingun.get(`dimension/${dimId}`).get('ideas').load((ideas) => {
              thisDim.ideas = ideas;
              maingun.get(`dimension/${dimId}`).get('things').load((things) => {
                thisDim.things = things;
                changeToEditor(thisDim);
                enterDimensionInEditor();
              })
            })
          }
        })
      }else{
        $('.raygun').css({
          display : 'flex'
        })
      }
    })
  }



  $(window).on('keydown', (e) => {
    if(e.metaKey && e.keyCode == 83 || e.ctrlKey && e.keyCode == 83) {
      e.preventDefault();
    }
  })

})
