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
