window.Idea = class {

  createClassCode(){
    let ideaClassName = this.name;
    ideaClassName = ideaClassName[0].toUpperCase() + ideaClassName.substr(1, ideaClassName.length);
    ideaClassName = ideaClassName.split('');
    for(var i=0; i < ideaClassName.length; i++) {
      if (ideaClassName[i] === " "){
        let nextLetter = ideaClassName[i+1].toUpperCase()
        ideaClassName.splice(i, 2, nextLetter);
        i -= 1;
      }
    }
    this.className = ideaClassName.join('');
    let codeStart = `
    window.${this.className} = class {

      constructor(thing){
        Object.assign(this, thing);
      }

      build(){
    `
    let codeEnd = `
      }
    }
    `
    return codeStart + "\t" + this.code + codeEnd;
  }

  constructor(idea){
    if(idea){
      this.id = idea.id || UUID();
      this.name = idea.name || "Untitled Idea";
      this.desc = idea.desc || "This is an idea!";
      let userId = $('#userId').text();
      let username = $('#username').text();
      this.creatorId = idea.creatorId || userId;
      this.creatorName = idea.creatorName || username;
      this.isPrivate = idea.isPrivate || false;
      this.code = idea.code || `//Write code for ${this.name}`;
      this.classCode = idea.classCode || this.createClassCode();
    }else{
      this.id = UUID();
      this.name = "Untitled Idea";
      this.desc = "This is an idea!";
      let userId = $('#userId').text();
      let username = $('#username').text();
      this.creatorId = userId;
      this.creatorName = username;
      this.isPrivate = false;
      this.code = `//Write code for ${this.name}`;
      this.classCode = this.createClassCode();
    }
  }

}
