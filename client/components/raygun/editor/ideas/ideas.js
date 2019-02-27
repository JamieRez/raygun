window.ideaBeingEdited = null;

function openIdeaPrototypeEditor(){
  currentRaygunScreen = "prototype";
  //Move the editor windows out
  $('.editorIdeas').css({
    transform : "perspective(500px) translate3d(-1500px, 0px, -500px)"
  })
  $('.editorDimension').css({
    transform : "perspective(500px) translate3d(1500px, 0px, -500px)"
  })
  $('.editorThings').css({
    transform : "perspective(500px) translate3d(0px, 1500px, -500px)"
  })
  $(dimBeingEdited.element).css({
    transform : "perspective(500px) translate3d(2075px, -100px, -500px)"
  })
  $('.prototype').css('display', 'flex');
  $(ideaEditorDimension.element).children('.space').empty();
  $('.dataValue').remove();
  loadIdeaData();
  eval(ideaBeingEdited.classCode);
  let protoThingData = {
    id : "proto-" + ideaBeingEdited.className,
    dimension : 'prototype',
    ideaId : ideaBeingEdited.id,
    ideaClassName : ideaBeingEdited.className,
    dataGun : ideaBeingEdited.data
  }
  let protoThing = new Thing(protoThingData);
  protoThing.loadData();
  protoThing.render();
  //Bring in the prototype scree
  setTimeout(() => {
    $('.prototype').css({
      transform : "perspective(500px) translate3d(0px, 0px, 0px)"
    })
    //Update Toolbar
    setTimeout(() => {
      //Change toolbar label to be the idea being worked on
      $('.toolbarLabel').text(ideaBeingEdited.name);
      ideaEditor.setValue(ideaBeingEdited.code);
      runCodeInIdeaEditor();
      changeToolbarColorsForIdeaBuilder();
    }, 500)
  }, 250)
}

function addNewIdea(idea){
  //Run the idea code
  eval(idea.classCode);
  //Add an idea to the editor
  let newIdeaElem = document.createElement('div');
  newIdeaElem.classList.add('ideaBtn');
  newIdeaElem.id = 'ideaBtn-' + idea.id;
  $('.editorIdeasList').append(newIdeaElem);
  let newIdeaElemLabel = document.createElement('div');
  newIdeaElemLabel.classList.add('ideaBtnLabel');
  newIdeaElemLabel.textContent = idea.name;
  $(newIdeaElem).append(newIdeaElemLabel);

  //Clicking on an idea, goes to the idea editor
  $(newIdeaElem).on("click", (e) => {
    if(!inDeleteMode){
      ideaBeingEdited = dimBeingEdited.ideas[idea.soul];
      $('.editorIdeasList').css({
        transform : "translate3d(-750px, 0px, 0px)"
      })
      $('.editIdeaContainer').css({
        display : "flex"
      })
      setTimeout(() => {
        $('.editIdeaContainer').css({
          transform : "translate3d(0px, 0px, 0px)"
        })
        $('.editIdeaName').text(idea.name);
        $('.editIdeaCreator').text("Created by: " + idea.creatorName);
        $('.editIdeaDesc').text(idea.desc);
      }, 10);

      setTimeout(() => {
        $('.editorIdeasList').css({
          display : "none"
        })
      }, 20)
    }else{
      //Delete this idea
      let thisIdeaGun = raygun.get(`idea/${idea.id}`);
      thisIdeaGun.get('exists').put(false);
      raygun.get('dimension/' + dimBeingEdited.id).get('ideas').unset(thisIdeaGun);
      $(newIdeaElem).remove();
    }
  });

  raygun.get(`idea/${idea.id}`).get('name').on((newName) => {
    idea.name = newName;
    $('.editIdeaName').text(newName);
    $(`#ideaBtn-${idea.id}`).find('.ideaBtnLabel').text(newName);
  })

  raygun.get(`idea/${idea.id}`).get('desc').on((newDesc) => {
    idea.desc = newDesc;
    $('.editIdeaDesc').text(newDesc);
  })

}

function loadDimensionIdeas(){
  let dimIdeas = dimBeingEdited.ideas;
  for(soul in dimIdeas){
    if(dimIdeas[soul] && dimIdeas[soul].exists){
      dimIdeas[soul] = new Idea(dimIdeas[soul], soul);
      addNewIdea(dimIdeas[soul]);
    }
  }
}

$(document).ready(() => {

  //Add New Idea on newIdeaBtn click
  $('.newIdeaBtn').on("click", (e) => {
    let newIdea = new Idea();
    dimBeingEdited.ideas[newIdea.id] = newIdea;
    addNewIdea(newIdea);
    let newIdeaGun = raygun.get(`idea/${newIdea.id}`).put((newIdea), () => {
      raygun.get('idea').set(newIdea);
      raygun.get('dimension/' + dimBeingEdited.id).get('ideas').set(newIdeaGun);
    })
  })

  //Blur on Name or Description, saves the idea
  $('.editIdeaName').on('blur', (e) => {
    if($('.editIdeaName').text().length > 0){
      ideaBeingEdited.name = $('.editIdeaName').text()
      raygun.get(`idea/${ideaBeingEdited.id}`).get('name').put(ideaBeingEdited.name);
    }
  })
  $('.editIdeaDesc').on('blur', () => {
    if($('.editIdeaDesc').text().length > 0){
      ideaBeingEdited.desc = $('.editIdeaDesc').text()
      raygun.get(`idea/${ideaBeingEdited.id}`).get('desc').put(ideaBeingEdited.desc);
    }
  })

  //Back btn in idea editor goes back to ideaslist
  $('.editIdeaNavBackBtn').on('click', () => {
    $('.editIdeaContainer').css({
      display : "none",
      transform : "translate3d(-750px, 0px, 0px)"
    })
    $('.editIdeaName').text("");
    $('.editIdeaCreator').text("");
    $('.editIdeaDesc').text("");
    $('.editorIdeasList').css({
      display : "flex"
    })
    setTimeout(() => {
      $('.editorIdeasList').css({
        transform : "translate3d(0px, 0px, 0px)"
      })
    })
  })

  //Click on View/Edit Code Btn opens the prototype screen
  $('.editIdeaCodeBtn').on('click', () => {
    openIdeaPrototypeEditor();
  })

  //Click on Make Thing Button makes a new thing in this dimension
  $('.editIdeaMakeThingBtn').on('click', () => {
    let newThing = new Thing();
    dimBeingEdited.things[newThing.id] = newThing;
    let newThingGun = raygun.get('thing/' + newThing.id).put(newThing);
    raygun.get('thing').set(newThingGun);
    raygun.get('dimension/' + dimBeingEdited.id).get('things').set(newThingGun);
    dimBeingEdited.things[newThing.id].getDataFromIdea();
    createNewThing(dimBeingEdited.things[newThing.id])
  })


})
