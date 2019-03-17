window.Thing = class {

  getDataFromIdea(isPrototype = false){
    let ideaData = loadedIdeas[this.ideaId].data;
    this.data = {null : null};
    let seenKeys = {};
    for(id in ideaData){
      if(ideaData[id] && !seenKeys[ideaData[id].key]){
        seenKeys[ideaData[id].key] = true;
        let newThingData = {
          id : UUID(),
          key : ideaData[id].key,
          value : ideaData[id].value,
          exists : ideaData[id].exists,
        }
        this.data[newThingData.key] = newThingData.value;
        this.dataGun[newThingData.id] = newThingData;
        if(!isPrototype){
          this.save();
        }
      }
    }
  }

  loadData(cb){
    let thisRaygun = gun.user(this.creatorPubKey);
    let seenData = {};
    thisRaygun.get('thing/' + this.id).get('data').open((data) => {
      if(!seenData[data.key]){
        seenData[data.key] = true;
        if(this.data != data){
          this.data = data;
          if(cb && typeof cb == 'function'){
            cb();
          }
        }else{
          if(cb && typeof cb == 'function'){
            cb();
          }
        }
      }else{
        return;
      }
    })
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
      this.creatorPubKey = thing.creatorPubKey || dimBeingEdited.creatorPubKey;
      this.isPrivate = thing.isPrivate || false;
      this.dimension = thing.dimension || dimBeingEdited.id
      this.ideaId = thing.ideaId || null;
      this.ideaClassName = thing.ideaClassName || null;
      this.exists = thing.exists || true;
      this.data = thing.data || {null : null};
      this.dataCount = thing.dataCount;
      this.dataGun = thing.dataGun || {null : null};
      this.loadOrder = thing.loadOrder || dimBeingEdited.thingCount;
      this.things = thing.things || {null : null};
      this.thingCount = thing.thingCount || 0;
      this.parentThing = thing.parentThing || false;
      this.parentElement = thing.parentElement || `#space-${dimBeingEdited.element}`;
      this.element = thing.element || null;
      this.rendered = thing.rendered || false;
    }else{
      this.id = UUID();
      this.name = ideaBeingEdited.name;
      this.data = {null : null},
      this.dataCount = ideaBeingEdited.dataCount;
      this.dataGun = {null : null};
      let userId = $('#userId').text();
      let username = $('#username').text();
      this.creatorId = userId;
      this.creatorName = username;
      this.creatorPubKey = dimBeingEdited.creatorPubKey;
      this.isPrivate = false;
      this.dimension = dimBeingEdited.id;
      this.ideaId = ideaBeingEdited.id;
      this.ideaClassName = ideaBeingEdited.className;
      this.exists = true;
      this.loadOrder = dimBeingEdited.thingCount;
      this.things = {null : null};
      this.thingCount = 0;
      this.parentThing = false;
      this.parentElement = `#space-${dimBeingEdited.element}`;
      this.element = null;
      this.rendered = false;
    }
  }

  save(){
    loadedThings[this.id] = this;
    let thisRaygun = gun.user(this.creatorPubKey);
    thisRaygun.get('thing/' + this.id).put(this);
  }

  render(dataLoaded = false){
    let thisThing = this;
    function create(){
      let thisElement = document.createElement('div');
      thisElement.id = thisThing.ideaClassName + thisThing.id;
      thisElement.classList.add("thing");
      thisThing.element = '#' + thisThing.ideaClassName + thisThing.id;
      if($(`#${thisThing.ideaClassName + thisThing.id}`).length == 0){
        $(thisThing.parentElement).append(thisElement);
        thisThing.rendered = true;
      }else if(thisThing.dimension == 'prototype'){
        thisElement.id = 'prototype-thing';
        thisThing.element = '#prototype-thing';
        $('#space-prototype').append(thisElement);
      }else{
        thisThing.rendered= false;
      }
      eval(`
        new ${thisThing.ideaClassName}(thisThing).build();
      `)
    }
    if(!dataLoaded){
      this.loadData(create);
    }else{
      create();
    }
  }


}
