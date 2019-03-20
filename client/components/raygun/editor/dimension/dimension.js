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

function copyDimLink(){
  let dimLink = `https://www.raygun.live/user/${dimBeingEdited.creatorPubKey}/dim/${dimBeingEdited.id}`
  let dimLinkEl = document.createElement('textarea');
  dimLinkEl.value = dimLink;
  dimLinkEl.style.position = "absolute";
  dimLinkEl.style.left = '-100000';
  document.body.appendChild(dimLinkEl);
  dimLinkEl.select();
  document.execCommand('copy');
  document.body.removeChild(dimLinkEl);
}

$(document).ready(() => {

  $('.goToDimBtn').on("click", () => {
    enterDimensionInEditor();
  })

  $('.shareDimBtn').on('click', () => {
    copyDimLink();
    $('.shareDimBtnLabel').text("Link Copied to Clipboard!")
    setTimeout(() => {
      $('.shareDimBtnLabel').text("Share Dimension")
    }, 1000)
  })

})
