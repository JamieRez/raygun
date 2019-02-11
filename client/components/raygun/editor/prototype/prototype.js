function prototypeToEditor(){
  //Move the prototype screen away
  $('.prototype').css({
    transform : "perspective(500px) translate3d(0px, -2000px, -5000px)"
  })
  setTimeout(() => {
    //Bring back the editor!
    $('.editorIdeas').css({
      transform : "perspective(500px) translate3d(0px, 0px, 0px)"
    })
    $('.editorDimension').css({
      transform : "perspective(500px) translate3d(0px, 0px, 0px)"
    })
    $('.editorThings').css({
      transform : "perspective(500px) translate3d(0px, 0px, 0px)"
    })
    $('.prototype').css('display', 'none');
    setTimeout(() => {
      //Change toolbar label to be the dimension being worked on
      $('.toolbarLabel').text(dimBeingEdited.name);
      changeToolbarColorsToDefault();
    }, 500)
  }, 250);
}


$(document).ready(() => {

  //Initialize Code Editor
  let editor = ace.edit('protoCodeEditor');
  editor.session.setMode("ace/mode/javascript");
  editor.session.setTabSize(2)
  editor.resize();

  //Go back to editor on back button Click
  $('.protoCodeNavBackBtn').on('click', () => {
    prototypeToEditor();
  })


})
