window.ideaEditor = null;
window.ideaEditorDimension = null;

function saveCodeInEditor(cb){
  ideaBeingEdited.code = ideaEditor.getValue();
  axios.post('/api/idea/' + ideaBeingEdited._id, ideaBeingEdited).then((res) => {
    if(typeof cb == 'function' && res.data){
      cb(res.data)
    }
  });
}

function runCodeInIdeaEditor(){
  let codeInEditor = ideaEditor.getValue();
  try {
    saveCodeInEditor((idea) => {
      $(ideaEditorDimension.element).empty();
      eval(idea.classCode);
      let protoThingData = {
        id : "proto-" + idea.className,
        dimension : ideaEditorDimension,
        idea : idea
      }
      let protoThing = new Thing(protoThingData);
      protoThing.render();
    });
  } catch (e) {
    console.log(e.message);
  }
}

function prototypeToEditor(){
  currentRaygunScreen = "editor";
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
      dimBeingEdited.ideas = {};
      dimBeingEdited.things = {};
      $('.ideaBtn').remove();
      $('.thingOptionBtn').remove();
      $('.editorDimPreview').empty();
      dimBeingEdited.renderAt($('.editorDimPreview')[0]);
      loadDimensionIdeas();
      loadDimensionThings();
      changeToolbarColorsToDefault();
    }, 500)
  }, 250);
}


$(document).ready(() => {

  //Initialize Code Editor
  ideaEditor = ace.edit('protoCodeEditor');
  ideaEditor.session.setMode("ace/mode/javascript");
  ideaEditor.session.setTabSize(2)
  ideaEditor.resize();

  //Initialize Prototype Dimension
  ideaEditorDimension = new Dimension();
  ideaEditorDimension.name = "prototype";
  ideaEditorDimension.id = "prototype";
  ideaEditorDimension.things = {};
  ideaEditorDimension.renderAt('.prototypePreview');
  $(ideaEditorDimension.element).css({
    display : "flex",
    flexDirection : "column"
    // justifyContent : "center",
    // alignItems : "center"
  })

  //Go back to editor on back button Click
  $('.protoCodeNavBackBtn').on('click', () => {
    prototypeToEditor();
  })

  $('.protoCodeRunBtn').on('click', () => {
    runCodeInIdeaEditor();
  })

  $('#protoCodeEditor').on('keydown', (e) => {
    if(e.metaKey && e.keyCode == 83 || e.ctrlKey && e.keyCode == 83) {
      saveCodeInEditor();
    }
    else if(e.keyCode == 13 && e.shiftKey){
      e.preventDefault();
      runCodeInIdeaEditor()
    }
  })

})
