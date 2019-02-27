window.loadedThings = {};

function openThingEditor(thing){
  $('.editorThingsList').css('display', 'none');
  $('.editorThingsEditor').css('display', 'flex');
  $('.thingEditorNameValue').text(thing.name);
  let thingDataGun = thing.dataGun;
  let thingData = thing.data;
  for(soul in thingDataGun){
    if(thingDataGun[soul] && thingDataGun[soul].exists){

      let thisKey = thingDataGun[soul].key;
      let thisValue = thingDataGun[soul].value;
      let thisId = thingDataGun[soul].id;
      let thisSoul = soul;

      //Now we add the data value to the dom
      let thingDataValue = document.createElement('div');
      thingDataValue.classList.add('thingDataValue');
      thingDataValue.id = thisId;

      let thingDataValueKey = document.createElement('div');
      thingDataValueKey.classList.add('thingDataValueKey');
      thingDataValueKey.textContent = thisKey;

      let thingDataValueValue = document.createElement('div');
      thingDataValueValue.classList.add('thingDataValueValue');
      thingDataValueValue.textContent = thisValue;
      thingDataValueValue.contentEditable = true;

      $(thingDataValue).append(thingDataValueKey);
      $(thingDataValue).append(thingDataValueValue);
      $('.thingDataValuesList').append(thingDataValue);

      //Update Thing Data Values
      $(thingDataValueValue).on('blur', () => {
        let newValue = $(thingDataValueValue).text();
        if(newValue.length > 0){
          thing.data[thisKey] = newValue;
          thing.dataGun[thisSoul].value = newValue;
          $(thing.element).remove();
          thing.render(true);
          raygun.get(`thingData/${thingDataGun[thisSoul].id}`).get('value').put(newValue)
        }
      })
    }
  }
}

function createNewThing(thing, thingHasData = false){
  //Add to dimension
  thing.render(true);
  //Add to things list in editor
  let newThingOption = document.createElement('div');
  newThingOption.classList.add('thingOptionBtn');
  newThingOption.id = 'thingOptionBtn-' + thing.id;
  $('.editorThingsList').append(newThingOption);
  let newThingOptionLabel = document.createElement('div');
  newThingOptionLabel.classList.add('thingOptionBtnLabel');
  newThingOptionLabel.textContent = thing.name;
  $(newThingOption).append(newThingOptionLabel);

  $(newThingOption).on('click', () => {
    if(!inDeleteMode){
      openThingEditor(thing);
    }else{
      //Delete this thing
      let thisThingGun = raygun.get('thing/' + thing.id);
      thisThingGun.get('exists').put(false);
      $(`#thingOptionBtn-${thing.id}`).remove();
      $(thing.element).remove();
    }
  })

}

function loadDimensionThings(thingsHaveData = false){
  let dimThings = dimBeingEdited.things;
  for(id in dimThings){
    if(dimThings[id] && dimThings[id].exists){
      dimThings[id] = new Thing(dimThings[id]);
      dimThings[id].loadData();
      createNewThing(dimThings[id], true);
    }
  }
}

$(document).ready(() => {

  //Go Back to Things List on Thing Editor Back Btn Click
  $('.thingEditorBackBtn').on('click', () => {
    $('.editorThingsEditor').css('display', 'none');
    $('.editorThingsList').css('display', 'flex');
    $('.thingDataValuesList').empty();
  })

})
