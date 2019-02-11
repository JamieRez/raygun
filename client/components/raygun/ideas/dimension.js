window.Dimension = class {

  constructor(dim){
    Object.assign(this, dim);
  }

  renderAt(parentElement){
    this.element = document.createElement('div');
    this.element.id = this._id;
    this.element.classList.add("dimension");
    $(this.element).css({
      width : "100%",
      height : "100%",
      backgroundColor : "black",
      display : "flex",
      transition : "transform 0.5s ease-in",
      transform: "perspective(500px) translate3d(0px, 0px, 0px)"
    })
    $(parentElement).append(this.element);
  }

}
