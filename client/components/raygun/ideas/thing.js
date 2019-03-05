window.Thing = class {

  getDataFromIdea(){
    let ideaData = ideaBeingEdited.data;
    this.data = {};
    let seenKeys = {};
    for(soul in ideaData){
      if(ideaData[soul] && ideaData[soul].exists && !seenKeys[ideaData[soul].key]){
        seenKeys[ideaData[soul].key] = true;
        let newThingData = {
          id : UUID(),
          key : ideaData[soul].key,
          value : ideaData[soul].value,
          exists : ideaData[soul].exists,
        }
        let thingDataGun = raygun.get(`thingData/${newThingData.id}`).put(newThingData)
        newThingData.soul = thingDataGun._.link;
        this.data[newThingData.key] = newThingData.value;
        this.dataGun[newThingData.soul] = newThingData;
        raygun.get(`thing/${this.id}`).get('dataGun').set(thingDataGun);
      }
    }
  }

  loadData(){
    this.data = {};
    let thisDataGun = this.dataGun;
    let seenKeys = {};
    for(soul in thisDataGun){
      if(thisDataGun[soul] && thisDataGun[soul].exists && !seenKeys[thisDataGun[soul].key]){
        seenKeys[thisDataGun[soul].key] = true;
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
      this.things = thing.things || {};
      this.parentThing = thing.parentThing || false;
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
      this.things = {};
      this.parentThing = false;
    }
  }

  render(){
    if(!this.element || $(`#${this.ideaClassName + this.id}`).length == 0){
      this.element = document.createElement('div');
      this.element.id = this.ideaClassName + this.id;
      if(this.dimension == 'prototype'){
        this.element.id = 'prototype-thing';
      }
      this.element.classList.add("thing");
      if(!this.parentThing){
        $(`#${this.dimension}`).find('.space').append(this.element);
      }else{
        if(this.parentThing != 'prototype-soul-lol'){
          let parentThingElement = dimBeingEdited.things[this.parentThing].element;
          $(parentThingElement).append(this.element);
        }else{
          $('#prototype-thing').append(this.element);
        }
      }
    }
    eval(`
      new ${this.ideaClassName}(this).build();
    `)
  }


}
