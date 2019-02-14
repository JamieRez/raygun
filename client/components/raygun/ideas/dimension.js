window.Dimension = class {

  constructor(dim){
    if(dim){
      this.id = dim.id || UUID();
      this.name = dim.name || "Untitled Dimension";
      this.creatorId = dim.creatorId || $('#userId').text();
      this.creatorName = dim.creatorName || $('#username').text();
      this.isPrivate = dim.isPrivate || false;
    }else{
      this.id = UUID();
      this.name = "Untitled Dimension";
      this.creatorId = $('#userId').text();
      this.creatorName = $('#username').text();
      this.isPrivate = false;
    }
  }

  renderAt(parentElement){
    this.element = document.createElement('div');
    this.element.id = this.id;
    this.element.classList.add("dimension");
    $(this.element).css({
      width : "100%",
      height : "100%",
      backgroundColor : "black",
      display : "flex",
      transition : "transform 0.5s ease-in",
      transform : "perspective(500px) translate3d(0px, 0px, 0px)",
    })
    $(parentElement).append(this.element);

  }

}
