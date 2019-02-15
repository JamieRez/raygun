window.thisUsername = $('#username').text();
window.thisUserId = $('#userId').text();
window.thisUserHash = $('#userHash').text()
window.usergun = raygun.user()
if(thisUserId.length > 0 && thisUserHash.length > 0){
  usergun.auth(thisUserId, thisUserHash);
}


function addDimOption(dim){
  //Create a Dimension Option on the dashboard
  let newDimElem = document.createElement('div');
  newDimElem.classList.add('dashDimOption');
  newDimElem.id = 'dashDimOption-' + dim.id;
  $('.dashboardCreations').append(newDimElem);
  let newDimElemLabel = document.createElement('div');
  newDimElemLabel.classList.add('dashDimOptionLabel');
  newDimElemLabel.textContent = dim.name;
  $(newDimElem).append(newDimElemLabel);

  //Clicking on Dimension option brings you the to editor
  $(newDimElem).on("click", (e) => {
    changeToEditor(dim);
  })

  //Updates for this dim name affect the option box
  raygun.get('dimension/' + dim.id).get('name').on((name) => {
    newDimElemLabel.textContent = name;
  })

}

gun.on('auth', () => {
  usergun.get('dimension').map().once((dim) => {
    let thisDim = new Dimension(dim);
    addDimOption(thisDim)
  })
})

function changeToEditor(dim){
  loadedIdeas = {};
  loadedThings = {};
  currentRaygunScreen = "editor";
  //Change to Editor
  $('.dashboard').css({
    display : "none"
  })
  $('.editor').css({
    display : "flex"
  })
  $('.toolbarLabel').text(dim.name);
  $('.toolbarLabel')[0].contentEditable = true;
  $('.toolbarLabel').css({
    border : "2px solid #2ed17c",
    borderRadius : "25px",
    padding : "5px 10px",
  })
  $('.ideaBtn').remove();
  $('.thingOptionBtn').remove();
  $('.editorDimPreview').empty();
  dim.renderAt('body');
  $(dim.element).css({
    transform : "perspective(500px) translate3d(575px, -100px, -500px)",
    boxShadow : "0px 0px 3px 3px #2ed17c"
  })
  dimBeingEdited = dim;
  loadDimensionIdeas();
  loadDimensionThings();
}

$(document).ready(()=> {

  //Going to domain dimension if applicable
  raygun.get(`domain/${window.location.host}`).once((dimId) => {
    if(dimId){
      raygun.get(`dimension/${dimId}`).once((dim) => {
        let thisDim = new Dimension(dim);
        changeToEditor(thisDim);
        enterDimensionInEditor();
      })
    }else{
      $('body').css({
        background: 'url("/components/body-bg.gif")',
      })
      $('.raygun').css({
        display : 'flex'
      })
    }
  })

  $('.dashNewDimensionBtn').on("click", (e) => {
    let newDim = new Dimension();
    let newDimGun = raygun.get('dimension/' + newDim.id).put(newDim, () => {
      newDimGun.get('editors').set(thisUserId);
      raygun.get('dimension').set(newDimGun);
      usergun.get('dimension').set(newDimGun);
      changeToEditor(newDim);
    });
  })

})
