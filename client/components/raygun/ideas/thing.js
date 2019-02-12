window.Thing = class {

  constructor(thing){
    Object.assign(this, thing);
    this.id = this._id || this.id;
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
