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
      if(dim.editors){
        this.editors = dim.editors
      }else{
        this.editors = {};
        this.editors[userId] = userId;
      }
    }else{
      this.id = UUID();
      this.name = "Untitled Dimension";
      let userId = $('#userId').text();
      let username = $('#username').text();
      this.creatorId = userId
      this.creatorName = username;
      this.isPrivate = false;
      this.editors = {};
      this.editors[userId] = userId;
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
