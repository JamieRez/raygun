function addDimOption(dim){
  //Create a Dimension Option on the dashboard
  let newDimElem = document.createElement('div');
  newDimElem.classList.add('dashDimOption');
  newDimElem.id = 'dashDimOption-' + dim._id;
  $('.dashboardCreations').append(newDimElem);
  let newDimElemLabel = document.createElement('div');
  newDimElemLabel.classList.add('dashDimOptionLabel');
  newDimElemLabel.textContent = dim.name;
  $(newDimElem).append(newDimElemLabel);

  //Clicking on Dimension option brings you the to editor
  $(newDimElem).on("click", (e) => {
    changeToEditor(dim);
  })

}

function recieveDimensionsOfUser(){
  let thisUserId = $('#userId').text();
  $.get('/api/user/' + thisUserId + '/dimensions', (dims) => {
    if(dims){
      dims.forEach((dim) => {
        addDimOption(dim);
      })
    }
  })
}

function changeToEditor(dim){
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
  dimBeingEdited = new Dimension(dim);
  dimBeingEdited.ideas = {};
  dimBeingEdited.things = {};
  $('.ideaBtn').remove();
  $('.thingOptionBtn').remove();
  $('.editorDimPreview').empty();
  dimBeingEdited.renderAt($('.editorDimPreview')[0]);
  loadDimensionIdeas();
  loadDimensionThings();
}

$(document).ready(()=> {
  recieveDimensionsOfUser();

  $('.dashNewDimensionBtn').on("click", (e) => {
    $.post('/api/dimension/new', (data) => {
      changeToEditor(data);
      addDimOption(data);
    })
  })

})
