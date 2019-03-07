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

  let ideaElemSortable = Sortable.create(newIdeaElem, {
    direction : 'vertical',
    group : 'ideas',
    draggable : '.ideaBtn',
    animation : 150,
    onAdd : function(e){
      let ideaMoved = e.item;
      //Update the local variables
      let thisIdea = dimBeingEdited.ideas[ideaMoved.ideaSoul];
      thisIdea.parentIdea = idea.soul;
      thisIdea.loadOrder = idea.ideaCount;
      idea.ideas[thisIdea.soul] = thisIdea.soul;

      let ideaMovedGun = raygun.get(`idea/${thisIdea.id}`);
      ideaMovedGun.get('parentIdea').put(idea.soul);
      ideaMovedGun.get('loadOrder').put(idea.ideaCount);
      //Remove from the dimension ideas
      //Add to the ideas of the idea it was added into.
      idea.ideaCount += 1;
      raygun.get(`idea/${idea.id}`).get('ideas').get(thisIdea.soul).put(thisIdea.soul);
      raygun.get(`idea/${idea.id}`).get('ideaCount').put(idea.ideaCount);
    },

    onRemove : function(e){
      //Remove the idea from this idea. Put it back in the dim ideas
      dimBeingEdited.ideas[e.item.ideaSoul].parentIdea = false;
      idea.ideaCount -= 1;
      raygun.get(`idea/${idea.id}`).get('ideas').get(e.item.ideaSoul).put(null);
      raygun.get(`idea/${idea.id}`).get('ideaCount').put(idea.ideaCount);
      raygun.get(`idea/${e.item.ideaId}`).get('parentIdea').put(false);
      delete idea.ideas[e.item.ideaSoul];

      //Add it to the new Idea if there is one.
      if(e.to.className != 'editorIdeasList'){
        let ideaMoved = e.item;
        let ideaTo = e.to;
        //Update the local variables
        let thisIdea = dimBeingEdited.ideas[ideaMoved.ideaSoul];
        let thisIdeaParent = dimBeingEdited.ideas[ideaTo.ideaSoul];
        thisIdea.parentIdea = thisIdeaParent.soul;
        thisIdea.loadOrder = thisIdeaParent.ideaCount;
        thisIdeaParent.ideas[thisIdea.ideaSoul] = thisIdea.soul;
        thisIdeaParent.ideaCount += 1;

        let ideaMovedGun = raygun.get(`idea/${thisIdea.id}`);
        ideaMovedGun.get('parentIdea').put(thisIdeaParent.soul);
        ideaMovedGun.get('loadOrder').put(thisIdeaParent.ideaCount);
        //Remove from the dimension ideas
        //Add to the ideas of the idea it was added into.
        raygun.get(`idea/${thisIdeaParent.id}`).get('ideas').get(thisIdea.soul).put(thisIdea.soul);
        raygun.get(`idea/${thisIdeaParent.id}`).get('ideaCount').put(thisIdeaParent.ideaCount);
      }
    },

    onEnd : function(e){
      let ideaOptions = $(newIdeaElem).children('.ideaBtn');
      for(var i=0; i < ideaOptions.length;i++){
        let soul = ideaOptions[i].ideaSoul;
        let ideaId = ideaOptions[i].ideaId;
        if(idea.ideas[soul]){
          idea.ideas[soul].loadOrder = i;
          raygun.get(`idea/${ideaId}`).get('loadOrder').put(i);
        }
      }
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
        raygun.get('dimension/' + dimBeingEdited.id).get('ideas').get(idea.soul).put(null);
      }else{
        parentIdeaId = dimBeingEdited.ideas[idea.parentIdea].id;
        dimBeingEdited.ideas[idea.parentIdea].ideaCount -= 1;
        raygun.get(`idea/${parentIdeaId}`).get('ideas').get(idea.soul).put(null);
        raygun.get(`idea/${parentIdeaId}`).get('ideaCount').put(dimBeingEdited.ideas[idea.parentIdea].ideaCount)
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
  let ideaIdeasSorted = {};
  for(let soul in idea.ideas){
    if(idea.ideas[soul] && $(`#ideaBtn-${dimBeingEdited.ideas[idea.ideas[soul]].id}`).length == 0){
      ideaIdeasSorted[dimBeingEdited.ideas[soul].loadOrder] = soul;
    }
  }
  for(let i=0; i<idea.ideaCount; i++){
    if(ideaIdeasSorted[i]){
      dimBeingEdited.ideas[ideaIdeasSorted[i]] = new Idea(dimBeingEdited.ideas[ideaIdeasSorted[i]], ideaIdeasSorted[i]);
      addNewIdea(dimBeingEdited.ideas[ideaIdeasSorted[i]]);
    }
  }

}

function loadDimensionIdeas(){
  let dimIdeas = dimBeingEdited.ideas;
  for(soul in dimBeingEdited.ideas){
    if(dimBeingEdited.ideas[soul] && dimBeingEdited.ideas[soul].exists){
      if($(`#ideaBtn-${dimBeingEdited.ideas[soul].id}`).length == 0){
        dimBeingEdited.ideas[soul] = new Idea(dimBeingEdited.ideas[soul], soul);
        addNewIdea(dimBeingEdited.ideas[soul]);
      }
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
    raygun.get('thing').set(newThingGun);
    raygun.get('dimension/' + dimBeingEdited.id).get('things').get(newThing.soul).put(newThing);
    raygun.get('dimension/' + dimBeingEdited.id).get('thingCount').put(dimBeingEdited.thingCount)

    // Create a thing for each idea inside this idea if any
    let initialIdea = ideaBeingEdited;
    function makeThingChildren(idea, parentThing){
      let thisIdea = idea;
      for(let soul in thisIdea.ideas){
        ideaBeingEdited = dimBeingEdited.ideas[soul];
        let thisNewThing = new Thing();
        thisNewThing.parentThing = parentThing.soul;
        thisNewThing.loadOrder = ideaBeingEdited.loadOrder;
        thisNewThing.parentElement = `#${parentThing.ideaClassName + parentThing.id}`;
        let thisNewThingGun = raygun.get(`thing/${thisNewThing.id}`).put(thisNewThing);
        let thisNewThingSoul = thisNewThingGun._.link;
        thisNewThing.soul = thisNewThingSoul;
        dimBeingEdited.things[thisNewThingSoul] = thisNewThing;
        dimBeingEdited.things[parentThing.soul].things[thisNewThingSoul] = thisNewThingSoul
        raygun.get(`dimension/${dimBeingEdited.id}`).get('things').get(thisNewThingSoul).put(thisNewThing)
        raygun.get(`dimension/${dimBeingEdited.id}`).get('things').get(parentThing.soul).get('things').get(thisNewThingSoul).put(thisNewThingSoul)
        let thisIdea = ideaBeingEdited
        if(ideaBeingEdited.ideas){
          makeThingChildren(ideaBeingEdited, thisNewThing)
        }
        ideaBeingEdited = thisIdea
      }
    }

    if(ideaBeingEdited.ideas){
      makeThingChildren(ideaBeingEdited, newThing)
    }

    ideaBeingEdited = initialIdea;

    createNewThing(newThing)

  })


})
