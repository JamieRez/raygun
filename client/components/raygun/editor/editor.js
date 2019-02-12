window.dimBeingEdited = null;

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

  
})
