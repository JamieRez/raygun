window.Thing = class {

  createThingData(cb){
    let loadedIdeaData = 0;
    let thisData = this.data;
    let thisId = this.id;
    let thisIdeaId = this.ideaId;
    raygun.get(`idea/${thisIdeaId}`).get('data').once().map().once((dataValue) => {
      if(dataValue && dataValue.exists && !thisData[dataValue.key]){
        thisData[dataValue.key] = dataValue.value;
        //Create a raygun for each data value from the idea
        let thisThingData = {
          id : UUID(),
          key : dataValue.key,
          value : dataValue.value,
          exists : true
        }
        let thisThingDataGun = raygun.get(`thingData/${thisThingData.id}`).put(thisThingData);
        loadedIdeaData += 1;
        raygun.get(`thing/${thisId}`).get('data').set(thisThingDataGun);
        if(loadedIdeaData == ideaBeingEdited.dataCount){
          if(cb && typeof cb == 'function'){
            cb();
          }
        }
      }
    })
  }

  constructor(thing){
    if(thing){
      this.id = thing.id || UUID();
      this.name = thing.name || ideaBeingEdited.name;
      this.data = thing.data || {};
      let userId = $('#userId').text();
      let username = $('#username').text();
      this.creatorId = thing.creatorId || userId;
      this.creatorName = thing.creatorName || username;
      this.isPrivate = thing.isPrivate || false;
      this.dimension = thing.dimension || dimBeingEdited.id
      this.ideaId = thing.ideaId || ideaBeingEdited.id;
      this.ideaClassName = thing.ideaClassName || ideaBeingEdited.className;
      this.exists = thing.exists || true;
    }else{
      this.id = UUID();
      this.name = ideaBeingEdited.name;
      this.data = {};
      let userId = $('#userId').text();
      let username = $('#username').text();
      this.creatorId = userId;
      this.creatorName = username;
      this.isPrivate = false;
      this.dimension = dimBeingEdited.id;
      this.ideaId = ideaBeingEdited.id;
      this.ideaClassName = ideaBeingEdited.className;
      this.exists = true;
    }
  }

  render(){
    let thisThing = this;
    let thisDimensionId = this.dimension;
    let thisData = this.data;
    let thisId = this.id;
    this.element = document.createElement('div');
    this.element.id = this.ideaClassName + this.id;
    this.element.classList.add("thing");
    raygun.get(`idea/${this.ideaId}`).once((thisIdea) => {
      if(thisDimensionId){
        $(`#${thisDimensionId}`).append(this.element);
      }else{
        $('#prototype').append(this.element);
      }
      //Load Thing Data
      let loadedDataCount = 0;
      raygun.get(`thing/${thisId}`).get('data').once().map().once((dataValue) => {
        if(dataValue && dataValue.exists && !thisData[dataValue.key]){
          console.log(dataValue);
          loadedDataCount += 1;
          thisData[dataValue.key] = dataValue.value;
          if(loadedDataCount == thisIdea.dataCount){
            eval(`
              new ${thisIdea.className}(thisThing).build();
            `)
          }
        }
      })
    })
  }


}
