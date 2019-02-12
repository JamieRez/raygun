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
  $('.prototype').css('display', 'flex');
  $(ideaEditorDimension.element).empty();
  eval(ideaBeingEdited.classCode);
  let protoThingData = {
    id : "proto-" + ideaBeingEdited.className,
    dimension : ideaEditorDimension,
    idea : ideaBeingEdited
  }
  let protoThing = new Thing(protoThingData);
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
      changeToolbarColorsForIdeaBuilder();
    }, 500)
  }, 250)
}

function saveIdea(idea){
  axios.post('/api/idea/' + idea._id, idea).then((res) => {

  })
}

function addNewIdea(idea){
  //Add an idea to the editor
  let newIdeaElem = document.createElement('div');
  newIdeaElem.classList.add('ideaBtn');
  newIdeaElem.id = 'ideaBtn-' + idea._id;
  $('.editorIdeasList').append(newIdeaElem);
  let newIdeaElemLabel = document.createElement('div');
  newIdeaElemLabel.classList.add('ideaBtnLabel');
  newIdeaElemLabel.textContent = idea.name;
  $(newIdeaElem).append(newIdeaElemLabel);

  //Clicking on an idea, goes to the idea editor
  $(newIdeaElem).on("click", (e) => {
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
      $('.editIdeaName').text(idea.name);
      $('.editIdeaCreator').text("Created by: " + idea.creatorName);
      $('.editIdeaDesc').text(idea.desc);
    }, 10);

    setTimeout(() => {
      $('.editorIdeasList').css({
        display : "none"
      })
    }, 20)
  })

}

function loadDimensionIdeas(){
  axios.get('/api/dimension/' + dimBeingEdited._id + '/ideas').then((res) => {
    res.data.forEach((idea) => {
      addNewIdea(idea);
    })
  })
}

$(document).ready(() => {

  //Add New Idea on newIdeaBtn click
  $('.newIdeaBtn').on("click", (e) => {
    axios.post('/api/idea/new', {
      dimId : dimBeingEdited._id
    }).then((res) => {
      addNewIdea(res.data);
    })
  })

  //Blur on Name or Description, saves the idea
  $('.editIdeaName').on('blur', (e) => {
    if($('.editIdeaName').text().length > 0){
      ideaBeingEdited.name = $('.editIdeaName').text()
      saveIdea(ideaBeingEdited);
    }
  })
  $('.editIdeaDesc').on('blur', () => {
    if($('.editIdeaDesc').text().length > 0){
      ideaBeingEdited.desc = $('.editIdeaDesc').text()
      saveIdea(ideaBeingEdited);
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


})
