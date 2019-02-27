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
    if(!inDeleteMode){
      //Load the whole dimension
      raygun.get(`dimension/${dim.id}`).load((dim) => {
        let thisDim = new Dimension(dim);
        changeToEditor(thisDim);
      })
    }else{
      raygun.get(`dimension/${dim.id}`).get('exists').put(false);
      $(newDimElem).remove();
    }
  })

  $(newDimElem).on('mouseenter', (e) => {
    if(inDeleteMode){
      $(newDimElem).css({
        backgroundColor : '#ffeeee'
      })
    }else{
      $(newDimElem).css({
        backgroundColor : '#d9fae9'
      })
    }
  })

  $(newDimElem).on('mouseleave', (e) => {
    $(newDimElem).css({
      backgroundColor : '#f0f0f0'
    })
  })

  //Updates for this dim name affect the option box
  raygun.get('dimension/' + dim.id).get('name').on((name) => {
    newDimElemLabel.textContent = name;
  })

}

gun.on('auth', () => {
  usergun.get('dimension').map().once((dim) => {
    if(dim && dim.exists){
      let thisDim = new Dimension(dim);
      addDimOption(thisDim)
    }
  })
})

function changeToEditor(dim){
  dimBeingEdited = dim;
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
  $('.thingDataValuesList').empty();
  $('.editorThingsEditor').css('display', 'none');
  $('.editorThingsList').css('display', 'flex');
  dim.renderAt('body');
  $(dim.element).css({
    transform : "perspective(500px) translate3d(575px, -100px, -500px)",
    boxShadow : "0px 0px 3px 3px #2ed17c"
  })
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
    if(!inDeleteMode){
      let newDim = new Dimension();
      let newDimGun = raygun.get('dimension/' + newDim.id).put(newDim, () => {
        newDimGun.get('editors').set(thisUserId);
        usergun.get('dimension').set(newDimGun);
      });
    }
  })

})
