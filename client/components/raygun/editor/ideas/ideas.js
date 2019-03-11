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
  $('#' + dimBeingEdited.id).css({
    transform : "perspective(500px) translate3d(2075px, -100px, -500px)"
  })
  $('.prototype').css('display', 'flex');
  $('#prototype').children('.space').empty();
  $('.dataValue').remove();
  loadIdeaData(idea);
  eval(idea.classCode);
  let protoThingData = {
    id : "proto-" + idea.className,
    dimension : 'prototype',
    ideaId : idea.id,
    ideaSoul : idea.soul,
    ideaClassName : idea.className,
    data : idea.data,
  }
  let protoThing = new Thing(protoThingData);
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
  if($('#' + newIdeaElem.id).length == 0){
    if(!idea.parentIdea){
      $('.editorIdeasList').append(newIdeaElem);
    }else{
      let parentIdeaBtn = $('#ideaBtn-' + idea.parentIdea);
      $(parentIdeaBtn).append(newIdeaElem);
    }
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
      //Update the local variables
      loadedIdeas[e.item.ideaId].parentIdea = idea.id;
      loadedIdeas[e.item.ideaId].loadOrder = idea.ideaCount;
      loadedIdeas[idea.id].ideas[idea.ideaCount] = e.item.ideaId;
      loadedIdeas[idea.id].ideaCount += 1;
      loadedIdeas[e.item.ideaId].save();
      loadedIdeas[idea.id].save();
    },

    onRemove : function(e){
      //Remove the idea from this idea. Put it back in the dim ideas
      loadedIdeas[e.item.ideaId].parentIdea = false;
      let loadIndex = loadedIdeas[e.item.ideaId].loadOrder;
      loadedIdeas[idea.id].ideaCount -= 1;
      loadedIdeas[idea.id].ideas[loadIndex] = null;
      loadedIdeas[e.item.ideaId].save();
      loadedIdeas[idea.id].save();

      //Add it to the new Idea if there is one.
      if(e.to.className != 'editorIdeasList'){
        //Update the local variables
        loadedIdeas[e.item.ideaId].parentIdea = e.to.ideaId;
        loadedIdeas[e.item.ideaId].loadOrder = loadedIdeas[e.to.ideaId].ideaCount;
        loadedIdeas[e.to.ideaId].ideas[loadedIdeas[e.item.ideaId].loadOrder] = e.item.ideaId;
        loadedIdeas[e.to.ideaId].ideaCount += 1;
        loadedIdeas[e.item.ideaId].save();
        loadedIdeas[e.to.ideaId].save();
      }
    },

    onSort : function(e){
      let ideaOptions = $(newIdeaElem).children('.ideaBtn');
      for(var i=0; i < ideaOptions.length;i++){
        let ideaId = ideaOptions[i].ideaId;
        if(loadedIdeas[ideaId]){
          loadedIdeas[ideaId].loadOrder = i;
          loadedIdeas[idea.id].ideas[i] = ideaId;
          loadedIdeas[ideaId].save();
          loadedIdeas[idea.id].save();
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
      raygun.get(`idea/${idea.id}`).put(null);
      dimBeingEdited.ideas[idea.id] = null;
      if(idea.parentIdea){
        loadedIdeas[idea.parentIdea][idea.loadOrder] = null
        loadedIdeas[idea.parentIdea].ideaCount -= 1;
        loadedIdeas[idea.parentIdea].save();
      }
      dimBeingEdited.save();
      $(newIdeaElem).remove();
    }
  });

  // raygun.get(`idea/${idea.id}`).get('name').on((newName) => {
  //   idea.name = newName;
  //   $('.editIdeaName').text(newName);
  //   $(`#ideaBtn-${idea.id}`).find('.ideaBtnLabel').text(newName);
  // })
  //
  // raygun.get(`idea/${idea.id}`).get('desc').on((newDesc) => {
  //   idea.desc = newDesc;
  //   $('.editIdeaDesc').text(newDesc);
  // })

  //Add the idea's ideas if any
  raygun.get('idea/' + idea.id).get('ideas').load((childIdeas) => {
    if(childIdeas){
      for(let i=0; i<idea.ideaCount; i++){
        if(childIdeas[i]){
          raygun.get('idea/' + childIdeas[i]).load((childIdea) => {
            if(childIdea){
              loadedIdeas[childIdea.id] = new Idea(childIdea);
              addNewIdea(loadedIdeas[childIdea.id]);
            }
          })
        }
      }
    }
  })

}

function loadDimensionIdeas(){
  for(id in dimBeingEdited.ideas){
    if(dimBeingEdited.ideas[id]){
      raygun.get('idea/' + id).load((thisIdea) => {
        if(!thisIdea.parentIdea){
          loadedIdeas[thisIdea.id] = new Idea(thisIdea);
          addNewIdea(loadedIdeas[thisIdea.id]);
        }
      })
    }
  }
}

$(document).ready(() => {

  //Add New Idea on newIdeaBtn click
  $('.newIdeaBtn').on("click", (e) => {
    let newIdea = new Idea();
    newIdea.save();
    addNewIdea(loadedIdeas[newIdea.id]);
  });

  //Blur on Name or Description, saves the idea
  $('.editIdeaName').on('blur', (e) => {
    if($('.editIdeaName').text().length > 0){
      ideaBeingEdited.name = $('.editIdeaName').text()
      $('#ideaBtn-' + ideaBeingEdited.id).children('.ideaBtnLabel').text(ideaBeingEdited.name)
      ideaBeingEdited.save();
    }
  })
  $('.editIdeaDesc').on('blur', () => {
    if($('.editIdeaDesc').text().length > 0){
      ideaBeingEdited.desc = $('.editIdeaDesc').text()
      ideaBeingEdited.save();
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
    loadedThings[newThing.id] = newThing
    loadedThings[newThing.id].getDataFromIdea(true)
    loadedThings[newThing.id].save();
    if(!loadedThings[newThing.id].parentThing){
      dimBeingEdited.things[newThing.loadOrder] = newThing.id;
      raygun.get('dimension/' + dimBeingEdited.id).get('things').get(newThing.loadOrder).put(newThing.id);
      dimBeingEdited.thingCount++;
      raygun.get('dimension/' + dimBeingEdited.id).get('thingCount').put(dimBeingEdited.thingCount);
    }
    // Create a thing for each idea inside this idea if any
    let initialIdea = ideaBeingEdited;
    function makeThingChildren(idea, parentThing){
      let thisIdea = idea;
      for(let i=0; i<thisIdea.ideaCount; i++){
        if(thisIdea.ideas[i] && loadedIdeas[thisIdea.ideas[i]]){
          ideaBeingEdited = loadedIdeas[idea.ideas[i]];
          let thisNewThing = new Thing();
          loadedThings[thisNewThing.id] = thisNewThing;
          loadedThings[thisNewThing.id].parentThing = parentThing.id;
          loadedThings[thisNewThing.id].loadOrder = ideaBeingEdited.loadOrder;
          loadedThings[thisNewThing.id].parentElement = `#${parentThing.ideaClassName + parentThing.id}`;
          loadedThings[parentThing.id].things[thisNewThing.loadOrder] = thisNewThing.id;
          loadedThings[parentThing.id].thingCount++;
          loadedThings[parentThing.id].save();
          loadedThings[thisNewThing.id].getDataFromIdea(true);
          loadedThings[thisNewThing.id].save();
          let thisIdea = ideaBeingEdited;
          if(ideaBeingEdited.ideaCount > 0){
            makeThingChildren(ideaBeingEdited, loadedThings[thisNewThing.id])
          }
          ideaBeingEdited = thisIdea
        }
      }
    }

    if(ideaBeingEdited.ideaCount > 0){
      makeThingChildren(ideaBeingEdited, newThing)
    }

    ideaBeingEdited = initialIdea;

    createNewThing(newThing)

  })

})
