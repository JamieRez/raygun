window.ideaBeingEdited = null;

function openIdeaPrototypeEditor(idea){
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
  eval(idea.classCode);
  let protoThingData = {
    id : "proto-" + idea.className,
    dimension : 'prototype',
    ideaId : idea.id,
    ideaSoul : idea.soul,
    ideaClassName : idea.className,
    dataGun : idea.data
  }
  let protoThing = new Thing(protoThingData);
  protoThing.loadData();
  protoThing.render();
  //Bring in the prototype screen
  setTimeout(() => {
    $('.prototype').css({
      transform : "perspective(500px) translate3d(0px, 0px, 0px)"
    })
    //Update Toolbar
    setTimeout(() => {
      //Change toolbar label to be the idea being worked on
      $('.toolbarLabel').text(idea.name);
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
        ideaEditor.setValue(idea.code);
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

  //Click on View/Edit Code Btn opens the prototype screen
  $('.editIdeaCodeBtn').on('click', () => {
    openIdeaPrototypeEditor(idea);
  })

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
  for(soul in dimBeingEdited.ideas){
    if(dimBeingEdited.ideas[soul] && dimBeingEdited.ideas[soul].exists){
      dimBeingEdited.ideas[soul] = new Idea(dimBeingEdited.ideas[soul], soul);
      addNewIdea(dimBeingEdited.ideas[soul]);
    }
  }
}

$(document).ready(() => {

  //Add New Idea on newIdeaBtn click
  $('.newIdeaBtn').on("click", (e) => {
    let newIdea = new Idea();
    let newIdeaGun = raygun.get(`idea/${newIdea.id}`).put(newIdea);
    dimBeingEdited.ideas[newIdeaGun._.link] = newIdea;
    dimBeingEdited.ideas[newIdeaGun._.link].soul = newIdeaGun._.link;
    addNewIdea(dimBeingEdited.ideas[newIdeaGun._.link]);
    raygun.get('idea').set(newIdea);
    raygun.get('dimension/' + dimBeingEdited.id).get('ideas').set(newIdeaGun);
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

  //Click on Make Thing Button makes a new thing in this dimension
  $('.editIdeaMakeThingBtn').on('click', () => {
    let newThing = new Thing();
    let newThingGun = raygun.get('thing/' + newThing.id).put(newThing);
    newThing.soul = newThingGun._.link;
    dimBeingEdited.things[newThing.soul] = newThing;
    dimBeingEdited.things[newThing.soul].soul = newThing.soul;
    dimBeingEdited.thingCount += 1;
    dimBeingEdited.things[newThing.soul].getDataFromIdea();
    createNewThing(dimBeingEdited.things[newThing.soul])
    raygun.get('thing').set(newThingGun);
    raygun.get('dimension/' + dimBeingEdited.id).get('things').set(newThingGun);
    raygun.get('dimension/' + dimBeingEdited.id).get('thingCount').put(dimBeingEdited.thingCount)
  })


})
