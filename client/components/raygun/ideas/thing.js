window.Thing = class {

  getDataFromIdea(){
    let ideaData = dimBeingEdited.ideas[this.ideaSoul].data;
    this.data = {};
    for(soul in ideaData){
      if(ideaData[soul] && ideaData[soul].exists){
        let newThingData = {
          soul : null,
          id : UUID(),
          key : ideaData[soul].key,
          value : ideaData[soul].value,
          exists : ideaData[soul].exists
        }
        this.data[newThingData.key] = newThingData.value;
        let thingDataGun = raygun.get(`thingData/${newThingData.id}`).put(newThingData, () => {
          raygun.get(`thing/${this.id}`).get('dataGun').set(thingDataGun);
        });
      }
    }
  }

  loadData(){
    this.data = {};
    let thisDataGun = this.dataGun;
    for(soul in thisDataGun){
      if(thisDataGun[soul] && thisDataGun[soul].exists){
        this.data[thisDataGun[soul].key] = thisDataGun[soul].value;
      }
    }
  }

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
      this.ideaSoul = thing.ideaSoul || ideaBeingEdited.soul;
      this.ideaClassName = thing.ideaClassName || ideaBeingEdited.className;
      this.exists = thing.exists || true;
      this.dataGun = thing.dataGun || {};
    }else{
      this.id = UUID();
      this.name = ideaBeingEdited.name;
      this.dataGun = {}
      let userId = $('#userId').text();
      let username = $('#username').text();
      this.creatorId = userId;
      this.creatorName = username;
      this.isPrivate = false;
      this.dimension = dimBeingEdited.id;
      this.ideaId = ideaBeingEdited.id;
      this.ideaSoul = ideaBeingEdited.soul;
      this.ideaClassName = ideaBeingEdited.className;
      this.exists = true;
    }
  }

  render(dataIsAlreadyLoaded=false){
    let thisThing = this;
    let thisDimensionId = this.dimension;
    let thisData = this.data;
    let thisDataCount = this.dataCount;
    let thisDataFromGun = this.dataFromGun;
    let thisId = this.id;
    let thisIdea = dimBeingEdited.ideas[this.ideaSoul]
    this.element = document.createElement('div');
    this.element.id = this.ideaClassName + this.id;
    this.element.classList.add("thing");
    $(`#${thisDimensionId}`).find('.space').append(this.element);
    eval(`
      new ${thisIdea.className}(thisThing).build();
    `)
  }


}
