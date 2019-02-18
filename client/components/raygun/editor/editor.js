window.dimBeingEdited = null;
window.inDeleteMode = false;

function resetEditor(){
  //Make sure the editor screens are all in the right place
  $('.prototype').css({
    display : "none",
    transform : "perspective(500px) translate3d(0px, -2000px, -5000px)"
  })
  $('.editorIdeas').css({
    transform : "perspective(500px) translate3d(0px, 0px, 0px)"
  })
  $('.editorDimension').css({
    transform : "perspective(500px) translate3d(0px, 0px, 0px)"
  })
  $('.editorThings').css({
    transform : "perspective(500px) translate3d(0px, 0px, 0px)"
  })
  $('.editIdeaContainer').css({
    display : "none",
    transform : "translate3d(-750px, 0px, 0px)"
  })
  $('.editIdeaName').text("");
  $('.editIdeaCreator').text("");
  $('.editIdeaDesc').text("");
  $('.editorIdeasList').css({
    display : "flex",
    transform : "translate3d(0px, 0px, 0px)"
  })
}

$(document).ready(() => {


  $(window).on("keydown", (e) => {
    if(currentRaygunScreen == 'editor' && e.keyCode == 192){
      console.log("Ay")
      enterDimensionInEditor();
    }
    else if(e.keyCode == 192 && currentRaygunScreen == 'dimension'){
      raygun.get(`dimension/${currentDimension.id}`).get('editors').map().once((editorId) => {
        if(thisUserId == editorId){
          escapeDimensionToRaygun();
        }
      })
    }else if(currentRaygunScreen == 'editor' && e.keyCode == 70){
      inDeleteMode = true;
      $('.ideaBtn').css({
        borderColor : "#c76a6a",
        color : "#c76a6a"
      })
      $('.thingOptionBtn').css({
        borderColor : "#c76a6a",
        color : "#c76a6a"
      })
    }
  })

  $(window).on("keyup", (e) => {
    if(currentRaygunScreen == 'editor' && e.keyCode == 70){
      inDeleteMode = false;
      $('.ideaBtn').css({
        borderColor : "#3ea26e",
        color : "#2ed17c"
      })
      $('.thingOptionBtn').css({
        borderColor : "#3ea26e",
        color : "#2ed17c"
      })
    }
  })

})
