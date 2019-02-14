window.Thing = class {

  constructor(thing){
    if(thing){
      this.id = thing.id || UUID();
      this.name = thing.name || "Untitled Idea";
      let userId = $('#userId').text();
      let username = $('#username').text();
      this.creatorId = thing.creatorId || userId;
      this.creatorName = thing.creatorName || username;
      this.isPrivate = thing.isPrivate || false;
      this.dimension = thing.dimension || {name : "prototype"}
      this.idea = thing.idea || {name : "Untitled Idea"};
    }else{
      this.id = UUID();
      this.name = "Untitled Idea";
      let userId = $('#userId').text();
      let username = $('#username').text();
      this.creatorId = userId;
      this.creatorName = username;
      this.isPrivate = false;
      this.dimension = {name : "prototype"};
      this.idea = {name : "Untitled Idea"}
    }
  }

  render(){
    this.element = document.createElement('div');
    this.element.id = this.id;
    this.element.classList.add("thing");
    $(this.dimension.element).append(this.element);
    let thisDimension = this.dimension;
    let thisThing = this;
    let thisIdea = this.idea;
    eval(`
      thisDimension.things[thisThing.id] = new ${thisIdea.className}(thisThing);
    `)
    thisDimension.things[thisThing.id].build();
  }


}
