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

})
