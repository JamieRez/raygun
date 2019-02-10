window.ideaBeingEdited = null;

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


})
