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
      changeToEditor(dim);
    }else{
      raygun.get(`dimension/${dim.id}`).put(null);
      raygun.get('dimension').get(dim.id).put(null);
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

//LOADING THE USER. THIS IS LIKE THE MOST IMPORTANT THING
gun.on('auth', () => {

  // //Going to domain dimension if applicable
  // raygun.get(`domain/${window.location.host}`).once((dimId) => {
  //   if(dimId){
  //     raygun.get(`dimension/${dimId}`).load((dim) => {
  //       let thisDim = new Dimension(dim);
  //       changeToEditor(thisDim);
  //       enterDimensionInEditor();
  //     })
  //   }else{
  //     $('body').css({
  //       background: 'url("/components/body-bg.gif")',
  //     })
  //     $('.raygun').css({
  //       display : 'flex'
  //     })
  //   }
  // })
  // $('.raygun').css({
  //   display : 'flex'
  // })
  raygun.get('dimension').load((dimensions) => {
    for(id in dimensions){
      if(dimensions[id] && dimensions[id]){
        raygun.get('dimension/' + id).load((thisDim) => {
          thisDim = new Dimension(thisDim);
          addDimOption(thisDim)
        })
      }
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
  $('.thingDataValue').remove();
  $('.editorThingsEditor').css('display', 'none');
  $('.editorThingsList').css('display', 'flex');
  dim.renderAt('body');
  $('#' + dim.id).css({
    transform : "perspective(500px) translate3d(575px, -100px, -500px)",
    boxShadow : "0px 0px 3px 3px #2ed17c"
  })
  loadDimensionIdeas();
  loadDimensionThings();
}

$(document).ready(()=> {

  $('.dashNewDimensionBtn').on("click", (e) => {
    if(!inDeleteMode){
      let newDim = new Dimension();
      newDim.save();
      addDimOption(newDim)
    }
  })

})
