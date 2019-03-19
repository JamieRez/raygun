//Idea Editor Container
$(this.element).css({
  width : "45%",
  height : "100%",
  borderRight : "2px solid #3ea26e",
  display : "flex",
  flexDirection : "column",
  padding : "5px",
  paddingBottom : "0px",
  backgroundColor : "#f0f0f0",
  transition :"transform 0.25s ease-in-out"
})
$(this.element).addClass('raygunIdeasEditor');
// Comment this out to see in Prototype Preview
$('#raygunUpperEditor').append($(this.element));
//

//Idea Editor Tab
let ideaEditorTab = document.createElement('div');
let ideaEditorTabLabel = document.createElement('div');
ideaEditorTabLabel.textContent = "Ideas";
$(ideaEditorTab).css({
  height : "25px",
  width : "75px",
  textAlign : "center",
  fontSize : "15px",
  padding : "5px",
  borderBottom : "2px solid #3ea26e",
  display : "flex",
  flexDirection : "column",
  justifyContent : "center",
  alignItems : "center"
})
$(ideaEditorTab).append(ideaEditorTabLabel);
$(this.element).append(ideaEditorTab)

//The core of the idea editor. Contains the Ideas List and Editor
let ideaEditorCore = document.createElement('div');
$(ideaEditorCore).css({
  display : "flex",
  flexDirection : "column",
  justifyContent : "flex-start",
  alignItems : "center",
  overflowX : "hidden",
  width : "100%",
  height : "100%"
})
$(this.element).append(ideaEditorCore)

//The List of Ideas
let ideaEditorList = document.createElement('div');
$(ideaEditorList).addClass('raygunIdeasList');
$(ideaEditorList).css({
  display : "flex",
  flexDirection : "row",
  justifyContent : "flex-start",
  alignItems : "flex-start",
  flexWrap : "wrap",
  overflowY : "scroll",
  padding : "10px",
  width : "90%",
})
$(ideaEditorCore).append(ideaEditorList)

//Add New Idea to List
$('.raygunIdeasList')[0].addNewIdea = function(idea){
  //Run the idea code
  eval(idea.classCode);
  //Add an idea to the editor
  let newIdeaElem = document.createElement('div');
  newIdeaElem.classList.add('raygunIdeaBtn');
  newIdeaElem.id = 'raygunIdeaBtn-' + idea.id;
  newIdeaElem.ideaId = idea.id;
  $(newIdeaElem).css({
    fontSize : "14px",
    textAlign : "center",
    border : "2px solid #3ea26e",
    borderRadius : "8px",
    color : "#2ed17c",
    padding : "5px",
    paddingBottom : "0px",
    display : "flex",
    justifyContent : "center",
    alignItems : "center",
    flexDirection : "column",
    cursor : "pointer",
    marginBottom : "5px",
    marginRight : "5px"
  })

  if($('#' + newIdeaElem.id).length === 0){
    if(!idea.parentIdea){
      $('.raygunIdeasList').append(newIdeaElem);
    }else{
      let parentIdeaBtn = $('#raygunIdeaBtn-' + idea.parentIdea);
      $(parentIdeaBtn).append(newIdeaElem);
    }
  }

  let newIdeaElemLabel = document.createElement('div');
  newIdeaElemLabel.classList.add('raygunIdeaBtnLabel');
  newIdeaElemLabel.textContent = idea.name;
  $(newIdeaElemLabel).css({
    marginBottom : "5px"
  })
  $(newIdeaElem).append(newIdeaElemLabel);

  let newIdeaElemIdeasList = document.createElement('div');
  newIdeaElemIdeasList.classList.add('raygunIdeaBtnIdeasList');
  $(newIdeaElem).append(newIdeaElemIdeasList);

  let ideaElemSortable = Sortable.create(newIdeaElem, {
    direction : 'vertical',
    group : 'ideas',
    draggable : '.raygunIdeaBtn',
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
      if(e.to.className != 'raygunIdeasList'){
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
      let ideaOptions = $(newIdeaElem).children('.raygunIdeaBtn');
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

  var listSortable = Sortable.create($('.raygunIdeasList')[0], {
    direction: 'horizontal',
    group : 'ideas',
    draggable : '.raygunIdeaBtn',
    animation : 150,
  });

  //Clicking on an idea, goes to the idea editor
  $(newIdeaElem).on("click", (e) => {
    e.stopPropagation();
    //TODO
  });


  //Add the idea's ideas if any
  let thisRaygun = gun.user(dimBeingEdited.creatorPubKey);
  thisRaygun.get('idea/' + idea.id).get('ideas').load((childIdeas) => {
    if(childIdeas){
      for(let i=0; i<idea.ideaCount; i++){
        if(childIdeas[i]){
          thisRaygun.get('idea/' + childIdeas[i]).load((childIdea) => {
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

//New Idea Button
let newIdeaBtn = document.createElement('div');
let newIdeaBtnLabel = document.createElement('div');
newIdeaBtnLabel.textContent = 'New Idea';
$(newIdeaBtn).css({
  fontSize : "14px",
  textAlign : "center",
  border : "2px solid #fc70bf",
  color : "#fc70bf",
  borderRadius : "8px",
  padding : "5px",
  display : "flex",
  justifyContent : "center",
  flexDirection : "center",
  cursor : "pointer",
  marginBottom : "5px",
  marginRight : "5px"
})
$(newIdeaBtn).append(newIdeaBtnLabel)
$(ideaEditorList).append(newIdeaBtn)
