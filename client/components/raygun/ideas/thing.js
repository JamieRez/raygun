window.Thing = class {

  getDataFromIdea(isPrototype = false){
    let ideaData = loadedIdeas[this.ideaId].data;
    this.data = {};
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
    raygun.get('thing/' + this.id).get('data').load((data) => {
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
      this.isPrivate = thing.isPrivate || false;
      this.dimension = thing.dimension || dimBeingEdited.id
      this.ideaId = thing.ideaId || null;
      this.ideaSoul = thing.ideaSoul || null;
      this.ideaClassName = thing.ideaClassName || null;
      this.exists = thing.exists || true;
      this.data = thing.data || {null : null};
      this.dataCount = thing.dataCount;
      this.dataGun = thing.dataGun || {null : null};
      this.loadOrder = thing.loadOrder || dimBeingEdited.thingCount;
      this.things = thing.things || {null : null};
      this.thingCount = thing.thingCount || 0;
      this.parentThing = thing.parentThing || false;
      this.parentElement = thing.parentElement || `#space-${dimBeingEdited.id}`;
      this.element = thing.element || null;
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
    raygun.get('thing/' + this.id).put(this);
  }

  render(dataLoaded = false){
    if(!dataLoaded){
      this.loadData(() => {
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
      });
    }else{
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


}
