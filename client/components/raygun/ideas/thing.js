window.Thing = class {

  constructor(thing){
    if(thing){
      this.id = thing.id || UUID();
      this.name = thing.name || ideaBeingEdited.name;
      let userId = $('#userId').text();
      let username = $('#username').text();
      this.creatorId = thing.creatorId || userId;
      this.creatorName = thing.creatorName || username;
      this.isPrivate = thing.isPrivate || false;
      this.dimension = thing.dimension || dimBeingEdited.id
      this.ideaId = thing.ideaId || ideaBeingEdited.id;
      this.ideaClassName = thing.ideaClassName || ideaBeingEdited.className;
    }else{
      this.id = UUID();
      this.name = ideaBeingEdited.name;
      let userId = $('#userId').text();
      let username = $('#username').text();
      this.creatorId = userId;
      this.creatorName = username;
      this.isPrivate = false;
      this.dimension = dimBeingEdited.id;
      this.ideaId = ideaBeingEdited.id;
      this.ideaClassName = ideaBeingEdited.className;
    }
  }

  render(){
    let thisThing = this;
    let thisDimensionId = this.dimension;
    this.element = document.createElement('div');
    this.element.id = this.ideaClassName + this.id;
    this.element.classList.add("thing");
    raygun.get(`idea/${this.ideaId}`).once((thisIdea) => {
      if(thisDimensionId){
        $(`#${thisDimensionId}`).append(this.element);
      }else{
        $('#prototype').append(this.element);
      }
      eval(`
        new ${thisIdea.className}(thisThing).build();
      `)
    })
  }


}
