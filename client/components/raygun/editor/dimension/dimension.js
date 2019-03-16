function enterDimensionInEditor(){
  currentRaygunScreen = 'dimension';
  currentDimension = dimBeingEdited || currentDimension;
  currentDimension.pos = {
    left : $(currentDimension.element).css('left'),
    top : $(currentDimension.element).css('top')
  }
  $(currentDimension.element).css({
    transform : "perspective(500px) translate3d(0px, 0px, 0px)",
    top : "0px",
    left : "0px",
    zIndex : "1"
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
  $(currentDimension.element).css({
    transform : "perspective(500px) translate3d(0px, 0px, -500px)",
    top : currentDimension.pos.top,
    left : currentDimension.pos.left,
    boxShadow : "0px 0px 3px 3px #2ed17c"
  })
}

$(document).ready(() => {

  $('.goToDimBtn').on("click", () => {
    enterDimensionInEditor();
  })

})
