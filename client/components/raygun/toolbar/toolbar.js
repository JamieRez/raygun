function switchToDashboard(){
  currentRaygunScreen = "dashboard";
  $('.editor').css({
    display : "none"
  })
  $('.dashboard').css({
    display : "flex"
  })
  $('.toolbarLabel').text("Dashboard");
  $('.toolbarLabel')[0].contentEditable = false;
  $('.toolbarLabel').css({
    border : "0px solid #2ed17c",
    borderRadius : "0px",
    padding : "0px"
  })
}

function changeToolbarColorsForIdeaBuilder(){
  $('.raygunToolbar').css({
    backgroundColor : "#221019",
    borderColor: "#fc70bf"
  })
  $('.raygunLabel').css({
    color : "#fc70bf"
  })
  $('.toolbarLabel').css({
    color : "#fc70bf",
    borderColor : "#fc70bf"
  })
  //change raygunIcon color
  $('.raygunIcon')[0].getSVGDocument().getElementById('raygunLogo').setAttribute("fill", "#fc70bf");
  //change profileIcon color
  $('.raygunProfileIcon')[0].getSVGDocument().querySelector('.profileIcon').setAttribute("fill", "#fc70bf");
}

function changeToolbarColorsToDefault(){
  $('.raygunToolbar').css({
    backgroundColor : "#f0f0f0",
    borderColor: "#3ea26e"
  })
  $('.raygunLabel').css({
    color : "#2ed17c"
  })
  $('.toolbarLabel').css({
    color : "#2ed17c",
    borderColor : "#3ea26e"
  })
  //change raygunIcon color
  $('.raygunIcon')[0].getSVGDocument().getElementById('raygunLogo').setAttribute("fill", "#2ed17c");
  //change profileIcon color
  $('.raygunProfileIcon')[0].getSVGDocument().querySelector('.profileIcon').setAttribute("fill", "#2ed17c");
}

$(document).ready(() => {

  $('.raygunToolbarDashBtn').on("click", (e) => {
    switchToDashboard();
    changeToolbarColorsToDefault();
    resetEditor()
  })

  $('.raygunProfileIcon').on("click", (e) => {
    switchToDashboard();
    changeToolbarColorsToDefault();
    resetEditor();
  })

  $('.toolbarLabel').on("blur", () => {
    //Toolbar label is dimension name if in dimenion editor
    if(currentRaygunScreen == "editor"){
      let newDimName = $('.toolbarLabel').text();
      if(newDimName.length > 0){
        dimBeingEdited.name = newDimName;
        let dimSaveData = dimBeingEdited;
        dimSaveData.ideas = Object.keys(dimBeingEdited.ideas);
        dimSaveData.things = Object.keys(dimBeingEdited.things);
        axios.post('/api/dimension/' + dimBeingEdited._id, dimBeingEdited).then((res) => {
          let dim = res.data;
          $('#dashDimOption-' + dim._id).find('.dashDimOptionLabel').text(dim.name);
        });
      }
    }else if(currentRaygunScreen == "prototype"){
      let newIdeaName = $('.toolbarLabel').text();
      if(newIdeaName.length > 0){
        ideaBeingEdited.name = newIdeaName;
        axios.post('/api/idea/' + ideaBeingEdited._id, ideaBeingEdited).then((res) => {
          let idea = res.data;
          $('#ideaBtn-' + idea._id).find('.ideaBtnLabel').text(idea.name);
        });
      }
    }
  })

})
