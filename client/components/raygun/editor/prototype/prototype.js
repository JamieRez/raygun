window.ideaEditor = null;
window.ideaEditorDimension = null;

function createClassCode(idea){
  let ideaClassName = idea.name;
  ideaClassName = ideaClassName[0].toUpperCase() + ideaClassName.substr(1, ideaClassName.length);
  ideaClassName = ideaClassName.split('');
  for(var i=0; i < ideaClassName.length; i++) {
    if (ideaClassName[i] === " "){
      let nextLetter = ideaClassName[i+1].toUpperCase()
      ideaClassName.splice(i, 2, nextLetter);
      i -= 1;
    }
  }
  ideaClassName = ideaClassName.join('');
  let codeStart = `
  window.${ideaClassName} = class {

    constructor(thing){
      Object.assign(this, thing);
    }

    build(){
  `
  let codeEnd = `
    }
  }
  `
  return {
    className : ideaClassName,
    classCode : codeStart + "\t" + idea.code + codeEnd
  }
}

function saveCodeInEditor(cb){
  ideaBeingEdited.code = ideaEditor.getValue();

  let ideaClassData = createClassCode(ideaBeingEdited);

  ideaBeingEdited.classCode= ideaClassData.classCode;
  ideaBeingEdited.className = ideaClassData.className;
  raygun.get(`idea/${ideaBeingEdited.id}`).get('className').put(ideaClassData.className);
  raygun.get(`idea/${ideaBeingEdited.id}`).get('code').put(ideaBeingEdited.code);
  raygun.get(`idea/${ideaBeingEdited.id}`).get('classCode').put(ideaClassData.classCode, () => {
    if(cb && typeof cb == 'function'){
      cb(ideaBeingEdited);
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
        dimension : 'prototype',
        ideaId : idea.id,
        ideaClassName : idea.className
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
    $(dimBeingEdited.element).css({
      transform : "perspective(500px) translate3d(575px, -100px, -500px)",
    })
    $('.prototype').css('display', 'none');
    setTimeout(() => {
      //Change toolbar label to be the dimension being worked on
      $('.toolbarLabel').text(dimBeingEdited.name);
      dimBeingEdited.ideas = {};
      dimBeingEdited.things = {};
      loadedIdeas = {};
      loadedThings = {};
      $('.ideaBtn').remove();
      $('.thingOptionBtn').remove();
      $('.editorDimPreview').empty();
      $(dimBeingEdited.element).remove();
      dimBeingEdited.renderAt($('body')[0]);
      $(dimBeingEdited.element).css({
        transform : "perspective(500px) translate3d(575px, -100px, -500px)",
      })
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
