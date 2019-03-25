window.currentRaygunScreen = 'auth';
window.loadedIdeas = {};
window.loadedThings = {};
window.userPubKey = null;

localStorage.clear();
var opt = {};
opt.store = RindexedDB(opt);

let gun;
gun = Gun([opt, window.location.origin + '/gun'])

window.hostName = window.location.host;
window.currentDimension = null;
window.userIsTyping = false;

$(document).ready(() => {
  $('.loadingRayGun').css('display', 'none');

  window.raygunPublicKey = $('#raygunPublicKey').text();
  window.thisUsername = $('#username').text();
  window.thisUserId = $('#userId').text();
  window.raygun = gun.user()
  window.maingun = gun.user(raygunPublicKey);

  //Going to path or domain dimension if applicable
  if(window.location.pathname != '/'){
    let pathArr = window.location.pathname.split('/');
    if(pathArr[1] == 'user' && pathArr[2]){
      //Loading a dim of a user
      if(pathArr[3] && pathArr[3] == 'dim' && pathArr[4]){
        $('.raygun').css('display', 'none');
        let dimGun = gun.user(pathArr[2]).get('dimension/' + pathArr[4]);
        dimGun.load((dim) => {
          let thisDim = new Dimension(dim);
          dimGun.get('ideas').load((ideas) => {
            thisDim.ideas = ideas;
            dimGun.get('things').load((things) => {
              thisDim.things = things;
              changeToEditor(thisDim);
              enterDimensionInEditor();
              $('.raygun').css('display', 'flex');
            })
          })
        })
      }
    }

  raygun.recall({sessionStorage: true})

  //Initialize RayGun if on the raygun domain or localhost
  if(window.location.hostname == 'www.raygun.live' || window.location.hostname == 'localhost'){
    //$('.raygun').css("display", 'flex');
    $('body').css('background', "url('/components/body-bg.gif')")
  }


    // maingun.get('path').get(window.location.pathname).once((dimId) => {
    //   if(dimId){
    //     maingun.get(`dimension/${dimId}`).load((dim) => {
    //       if(dim){
    //         let thisDim = new Dimension(dim);
    //         maingun.get(`dimension/${dimId}`).get('ideas').load((ideas) => {
    //           thisDim.ideas = ideas;
    //           maingun.get(`dimension/${dimId}`).get('things').load((things) => {
    //             thisDim.things = things;
    //             changeToEditor(thisDim);
    //             enterDimensionInEditor();
    //           })
    //         })
    //       }
    //     })
    //   }else{
    //     $('.raygun').css({
    //       display : 'flex'
    //     })
    //   }
    // })
  }



  $(window).on('keydown', (e) => {
    if(e.metaKey && e.keyCode == 83 || e.ctrlKey && e.keyCode == 83) {
      e.preventDefault();
    }
  })

})
