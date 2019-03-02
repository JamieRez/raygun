window.Thing = class {

  getDataFromIdea(){
    let ideaData = ideaBeingEdited.data;
    this.data = {};
    for(soul in ideaData){
      if(ideaData[soul] && ideaData[soul].exists){
        let newThingData = {
          soul : null,
          id : UUID(),
          key : ideaData[soul].key,
          value : ideaData[soul].value,
          exists : ideaData[soul].exists,
        }
        this.data[newThingData.key] = newThingData.value;
        this.dataGun[newThingData.id] = newThingData;
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
      this.soul = thing.soul || null;
      let userId = $('#userId').text();
      let username = $('#username').text();
      this.creatorId = thing.creatorId || userId;
      this.creatorName = thing.creatorName || username;
      this.isPrivate = thing.isPrivate || false;
      this.dimension = thing.dimension || dimBeingEdited.id
      this.ideaId = thing.ideaId || null;
      this.ideaSoul = thing.ideaSoul || null;
      this.ideaClassName = thing.ideaClassName || null;
      this.exists = thing.exists || true;
      this.dataGun = thing.dataGun || {};
      this.loadOrder = thing.loadOrder || dimBeingEdited.thingCount;
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
      this.loadOrder = dimBeingEdited.thingCount;
    }
  }

  render(){
    this.element = document.createElement('div');
    this.element.id = this.ideaClassName + this.id;
    this.element.classList.add("thing");
    $(`#${this.dimension}`).find('.space').append(this.element);
    eval(`
      new ${this.ideaClassName}(this).build();
    `)
  }


}
