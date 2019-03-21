window.ideaEditor = null;
window.ideaEditorDimension = null;
window.loadedIdeaData = {};

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

  if(cb && typeof cb == 'function'){
    cb(ideaBeingEdited);
  }

  raygun.get(`idea/${ideaBeingEdited.id}`).get('className').put(ideaClassData.className);
  raygun.get(`idea/${ideaBeingEdited.id}`).get('code').put(ideaBeingEdited.code);
  raygun.get(`idea/${ideaBeingEdited.id}`).get('classCode').put(ideaClassData.classCode);

}

function runCodeInIdeaEditor(){
  let codeInEditor = ideaEditor.getValue();
  try {
    saveCodeInEditor((idea) => {
      $('#prototypePreviewprototype').children('.space').empty();
      eval(idea.classCode);
      let protoThingData = {
        id : "proto-" + idea.className,
        dimension : 'prototype',
        ideaId : idea.id,
        ideaClassName : idea.className,
        dataGun : idea.data,
        parentElement : '#space-prototype'
      }
      let protoThing = new Thing(protoThingData);
      protoThing.getDataFromIdea(true)
      protoThing.render(true);

      //Render the idea children if any
      for(i in idea.ideas){
        if(idea.ideas[i]){
          if(loadedIdeas[idea.ideas[i]]){
            let thisIdea = loadedIdeas[idea.ideas[i]];
            eval(thisIdea.classCode);
            let thisProtoThingData = {
              id : "proto-" + thisIdea.className,
              dimension : 'prototype',
              ideaId : thisIdea.id,
              ideaClassName : thisIdea.className,
              parentThing : 'prototype-thing'
            }
            let thisProtoThing = new Thing(thisProtoThingData);
            protoThing.getDataFromIdea(true)
            thisProtoThing.render(true);
          }
        }
      }

    });
  } catch (e) {
    console.log(e);
  }
}

function prototypeToEditor(){
  currentRaygunScreen = "editor";
  //Move the prototype screen away
  $('.prototype').css({
    transform : "perspective(500px) translate3d(0px, -2000px, -5000px)"
  })
  setTimeout(() => {
    $('.editorIdeas').css({
      transform : "perspective(500px) translate3d(0px, 0px, 0px)"
    })
    $('.editorDimension').css({
      transform : "none"
    })
    $('.editorThings').css({
      transform : "perspective(500px) translate3d(0px, 0px, 0px)"
    })
    $('.prototype').css('display', 'none');
    setTimeout(() => {
      //Change toolbar label to be the dimension being worked on
      $('.toolbarLabel').text(dimBeingEdited.name);
      $('.dataValue').remove();
      $('.ideaBtn').remove();
      $('.thingOptionBtn').remove();
      $('.editorDimPreview').empty();
      $('.thingDataValue').remove();
      $('.editorThingsEditor').css('display', 'none');
      $('.editorThingsList').css('display', 'flex');
      $('#prototypePreviewprototype').children('.space').empty();
      dimBeingEdited.renderAt('.editorDimPreview');
      $(dimBeingEdited.element).css({
        transform : "perspective(500px) translate3d(0px, 0px, -500px)",
        boxShadow : "0px 0px 3px 3px #2ed17c",
        position : "absolute",
      })
      loadDimensionIdeas();
      loadDimensionThings(true);
      changeToolbarColorsToDefault();
      //Bring back the editor!
      $('.editIdeaName').text(ideaBeingEdited.name);
      $('.editIdeaCreator').text("Created by: " + ideaBeingEdited.creatorName);
      $('.editIdeaDesc').text(ideaBeingEdited.desc);
    }, 500)
  }, 250);
}

function loadIdeaData(idea){
  let ideaData = idea.data;
  for(id in ideaData){
    if(ideaData[id]){
      addNewDataValue(ideaData[id]);
    }
  }
}

function codeEditorToDataValues(){
  $('#protoCodeEditor').css('display', 'none');
  $('.protoCodeEditDataBtn').css('display', 'none');
  $('.protoCodeDataValues').css('display', 'flex');
  $('.protoCodeEditCodeBtn').css('display', 'flex');
}

function dataValuesToCodeEditor(){
  $('.protoCodeDataValues').css('display', 'none');
  $('.protoCodeEditCodeBtn').css('display', 'none');
  $('#protoCodeEditor').css('display', 'flex');
  $('.protoCodeEditDataBtn').css('display', 'flex');
}

function addNewDataValue(dataValue){
  let newDataValue = document.createElement('div');
  newDataValue.classList.add('dataValue');
  newDataValue.id = dataValue.id;

  let newDataValueKey = document.createElement('div');
  newDataValueKey.classList.add('dataValueKey');
  newDataValueKey.textContent = dataValue.key;
  newDataValueKey.contentEditable = true;

  let newDataValueValue = document.createElement('div');
  newDataValueValue.classList.add('dataValueValue');
  newDataValueValue.textContent = dataValue.value;
  newDataValueValue.contentEditable = true;

  $(newDataValue).append(newDataValueKey);
  $(newDataValue).append(newDataValueValue);
  $('.dataValuesList').append(newDataValue);

  $(newDataValueKey).on('focus', () => {
    userIsTyping = true;
  })

  $(newDataValueValue).on('focus', () => {
    userIsTyping = true;
  })

  //Update Data Key
  $(newDataValueKey).on('blur', () => {
    userIsTyping = false;
    let newKey = $(newDataValueKey).text();
    if(newKey.length > 0){
      dataValue.key = newKey;
      raygun.get('idea/'+ ideaBeingEdited.id).get('data').get(dataValue.id).get('key').put(newKey);
      loadedIdeas[ideaBeingEdited.id].data[dataValue.id] = dataValue;
      runCodeInIdeaEditor();
    }
  })

  //Update Data Value
  $(newDataValueValue).on('blur', () => {
    userIsTyping = false;
    let newValue = $(newDataValueValue).text();
    if(newValue.length > 0){
      dataValue.value = newValue;
      raygun.get('idea/'+ ideaBeingEdited.id).get('data').get(dataValue.id).get('value').put(newValue);
      loadedIdeas[ideaBeingEdited.id].data[dataValue.id] = dataValue;
      runCodeInIdeaEditor();
    }
  })

  //Delete
  $(newDataValue).on('click', (e) => {
    if(inDeleteMode){
      raygun.get('idea/'+ ideaBeingEdited.id).get('data').get(dataValue.id).put(null);
      raygun.get('idea/'+ ideaBeingEdited.id).get('dataCount').put(loadedIdeas[ideaBeingEdited.id].dataCount - 1)
      loadedIdeas[ideaBeingEdited.id].dataCount -= 1;
      $(newDataValue).remove();
    }
  });
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

  //Go back to editor on back button Click
  $('.protoCodeNavBackBtn').on('click', () => {
    prototypeToEditor();
  })

  $('.protoCodeEditDataBtn').on('click', () => {
    codeEditorToDataValues();
  })

  $('.protoCodeEditCodeBtn').on('click', () => {
    dataValuesToCodeEditor();
  })

  $('.protoCodeRunBtn').on('click', () => {
    runCodeInIdeaEditor();
  })

  $('.createNewDataValueBtn').on('click', () => {
    let newIdeaData = {
      id : UUID(),
      key : "dataKey",
      value : "dataValue",
      exists : true,
    }
    loadedIdeas[ideaBeingEdited.id].data = newIdeaData;
    loadedIdeas[ideaBeingEdited.id].dataCount += 1;
    raygun.get(`idea/${ideaBeingEdited.id}`).get('data').get(newIdeaData.id).put(newIdeaData);
    raygun.get(`idea/${ideaBeingEdited.id}`).get('dataCount').put(ideaBeingEdited.dataCount + 1);
    addNewDataValue(newIdeaData);
  })

  $('#protoCodeEditor').on('keydown', (e) => {
    if(e.metaKey && e.keyCode == 83 || e.ctrlKey && e.keyCode == 83) {
      saveCodeInEditor();
    }
    else if(e.keyCode == 13 && e.shiftKey){
      e.preventDefault();
      runCodeInIdeaEditor()
    }
  });

})
