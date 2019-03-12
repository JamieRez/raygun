function enterDimensionInEditor(){
  currentRaygunScreen = 'dimension';
  currentDimension = dimBeingEdited || currentDimension;
  $('#' + currentDimension.id).css({
    transform : "perspective(500px) translate3d(0px, 0px, 0px)"
  });
}

function escapeDimensionToRaygun(){
  currentRaygunScreen = 'editor';
  currentDimension = dimBeingEdited || currentDimension;
  $('body').css({
    background: 'url("/components/body-bg.gif")'
  })
  $('.raygun').css({
    display : 'flex'
  })
  $('#' + currentDimension.id).css({
    transform : "perspective(500px) translate3d(575px, -100px, -500px)",
    boxShadow : "0px 0px 3px 3px #2ed17c"
  })
}

$(document).ready(() => {

  $('.goToDimBtn').on("click", () => {
    enterDimensionInEditor();
  })

})
