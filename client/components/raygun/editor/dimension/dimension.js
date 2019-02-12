function enterDimensionInEditor(){
  currentRaygunScreen = 'dimension';
  $(dimBeingEdited.element).css({
    transform : "perspective(500px) translate3d(0px, 0px, 0px)"
  })
}

function escapeDimensionToRaygun(){
  currentRaygunScreen = 'editor';
  $(dimBeingEdited.element).css({
    transform : "perspective(500px) translate3d(575px, -100px, -500px)",
    boxShadow : "0px 0px 3px 3px #2ed17c"
  })
}

$(document).ready(() => {

  $('.goToDimBtn').on("click", () => {
    enterDimensionInEditor();
  })

  //Tilde to go to dimension
  $(window).on("keydown", (e) => {
    if(currentRaygunScreen == 'editor' && e.keyCode == 192){
      enterDimensionInEditor();
    }
    else if(e.keyCode == 192 && currentRaygunScreen == 'dimension'
         && dimBeingEdited.editors.includes($('#userId').text())
    ){
      escapeDimensionToRaygun();
    }
  })

})
