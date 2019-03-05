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
  loadIdeaData(idea);
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
  newIdeaElem.ideaId = idea.id;
  newIdeaElem.ideaSoul = idea.soul;
  if(!idea.parentIdea){
    $('.editorIdeasList').append(newIdeaElem);
  }else{
    let parentIdeaBtn = $('#ideaBtn-' + dimBeingEdited.ideas[idea.parentIdea].id);
    $(parentIdeaBtn).append(newIdeaElem);
  }

  let newIdeaElemLabel = document.createElement('div');
  newIdeaElemLabel.classList.add('ideaBtnLabel');
  newIdeaElemLabel.textContent = idea.name;
  $(newIdeaElem).append(newIdeaElemLabel);

  let newIdeaElemIdeasList = document.createElement('div');
  newIdeaElemIdeasList.classList.add('ideaBtnIdeasList');
  $(newIdeaElem).append(newIdeaElemIdeasList);

  var ideaListSortable = Sortable.create(newIdeaElem, {
    direction : 'vertical',
    group : 'ideas',
    draggable : '.ideaBtn',
    animation : 150,
    onAdd : function(e){
      let ideaMoved = e.item;
      let ideaMovedGun = raygun.get(`idea/${ideaMoved.ideaId}`);
      ideaMovedGun.get('parentIdea').put(idea.soul);
      //Remove from the dimension ideas
      raygun.get(`dimension/${dimBeingEdited.id}`).get('ideas').get(ideaMoved.ideaSoul).put(null);
      //Add to the ideas of the idea it was added into.
      raygun.get(`idea/${idea.id}`).get('ideas').set(ideaMovedGun);
    }
  })

  var listSortable = Sortable.create($('.editorIdeasList')[0], {
    direction: 'horizontal',
    group : 'ideas',
    draggable : '.ideaBtn',
    animation : 150,
  });

  //Clicking on an idea, goes to the idea editor
  $(newIdeaElem).on("click", (e) => {
    e.stopPropagation();
    if(!inDeleteMode){
      ideaBeingEdited = idea;
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
        //Click on View/Edit Code Btn opens the prototype screen
        $('.editIdeaCodeBtn').on('click', () => {
          openIdeaPrototypeEditor(idea);
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
      if(!idea.parentIdea){
        raygun.get('dimension/' + dimBeingEdited.id).get('ideas').unset(thisIdeaGun);
      }else{
        parentIdeaId = dimBeingEdited.ideas[idea.parentIdea].id;
        raygun.get(`idea/${parentIdeaId}`).get('ideas').get(idea.soul).put(null);
      }
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

  //Add the idea's ideas if any
  for(let soul in idea.ideas){
    idea.ideas[soul] = new Idea(idea.ideas[soul], soul);
    addNewIdea(idea.ideas[soul]);
  }

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

    // Create a thing for each idea inside this idea if any
    let thisIdea = ideaBeingEdited;
    for(let soul in thisIdea.ideas){
      ideaBeingEdited = thisIdea.ideas[soul];
      let thisNewThing = new Thing();
      thisNewThing.parentThing = newThing.soul;
      let thisNewThingGun = raygun.get(`thing/${thisNewThing.id}`).put(thisNewThing);
      newThingGun.get('things').set(thisNewThingGun);
      let thisNewThingSoul = thisNewThingGun._.link;
      thisNewThing.soul = thisNewThingSoul;
      newThing.things[thisNewThingSoul] = thisNewThing;
    }
    ideaBeingEdited = thisIdea;

  })


})
