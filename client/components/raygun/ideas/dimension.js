window.Dimension = class {

  constructor(dim){
    if(dim){
      this.id = dim.id || UUID();
      this.name = dim.name || "Untitled Dimension";
      let userId = $('#userId').text();
      let username = $('#username').text();
      this.creatorId = dim.creatorId || userId;
      this.creatorName = dim.creatorName || username;
      this.isPrivate = dim.isPrivate || false;
      this.exists = dim.exists || true;
      this.ideas = dim.ideas || {};
      this.things = dim.things || {};
    }else{
      this.id = UUID();
      this.name = "Untitled Dimension";
      let userId = $('#userId').text();
      let username = $('#username').text();
      this.creatorId = userId
      this.creatorName = username;
      this.isPrivate = false;
      this.exists = true;
      this.ideas = {};
      this.things = {};
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
      overflowY : "hidden",
      overflowX : "hidden",
      transition : "transform 0.5s ease-in",
      transform : "perspective(500px) translate3d(0px, 0px, 0px)",
    })
    let space = document.createElement('div');
    space.id = 'space-' + this.id;
    space.classList.add('space');
    $(space).css({
      backgroundColor : "black",
      display : "flex",
      flexWrap : "wrap",
      overflowY : "hidden",
      overflowX : "hidden",
      transition : "transform 0.5s ease-in",
      transform : "perspective(500px) translate3d(0px, 0px, 0px)",
    })
    $(this.element).append(space);
    $(parentElement).append(this.element);
  }

}
