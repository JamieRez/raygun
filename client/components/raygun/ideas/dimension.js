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
      this.ideas = dim.ideas || {null : null};
      this.things = dim.things || {null : null};
      this.thingCount = dim.thingCount || 0;
    }else{
      this.id = UUID();
      this.name = "Untitled Dimension";
      let userId = $('#userId').text();
      let username = $('#username').text();
      this.creatorId = userId
      this.creatorName = username;
      this.isPrivate = false;
      this.exists = true;
      this.ideas = {null : null};
      this.things = {null : null};
      this.thingCount = 0;
    }
  }

  save(){
    raygun.get('dimension/' + this.id).put(this);
    raygun.get('dimension').get(this.id).put(this.id);
  }

  renderAt(parentElement){
    let thisElement = document.createElement('div');
    thisElement.id = this.id;
    thisElement.classList.add("dimension");
    $(thisElement).css({
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
      width : "100%",
      height : "100%",
      position : "absolute",
      zIndex : "0",
      transition : "transform 0.5s ease-in",
      transform : "perspective(500px) translate3d(0px, 0px, 0px)",
    })
    $(thisElement).append(space);
    $(parentElement).append(thisElement);
  }

}
