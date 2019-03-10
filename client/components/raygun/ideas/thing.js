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
      this.data = thing.data || {null : null};
      this.loadOrder = thing.loadOrder || dimBeingEdited.thingCount;
      this.things = thing.things || {null : null};
      this.thingCount = thing.thingCount || 0;
      this.parentThing = thing.parentThing || false;
      this.parentElement = thing.parentElement || `#space-${dimBeingEdited.id}`;
      this.element = thing.element || null;
    }else{
      this.id = UUID();
      this.name = ideaBeingEdited.name;
      this.data = {null : null}
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
      this.things = {null : null};
      this.thingCount = 0;
      this.parentThing = false;
      this.parentElement = `#space-${dimBeingEdited.id}`;
      this.element = null;
    }
  }

  save(){
    loadedThings[this.id] = this;
    dimBeingEdited.things[this.id] = this.id;
    raygun.get('thing/' + this.id).put(this);
    raygun.get('dimension/' + dimBeingEdited.id).get('things').get(this.id).put(this.id)
  }

  render(){
    if($(`#${this.ideaClassName + this.id}`).length == 0){
      let thisElement = document.createElement('div');
      thisElement.id = this.ideaClassName + this.id;
      thisElement.classList.add("thing");
      this.element = '#' + this.ideaClassName + this.id;
      if(this.dimension == 'prototype'){
        thisElement.id = 'prototype-thing';
        this.element = '#prototype-thing';
        $('#space-prototype').append(thisElement);
      }else{
        $(this.parentElement).append(thisElement);
      }
    }
    eval(`
      new ${this.ideaClassName}(this).build();
    `)
  }


}
