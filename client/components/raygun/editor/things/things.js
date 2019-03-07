window.loadedThings = {};

function openThingEditor(thing){
  $('.editorThingsList').css('display', 'none');
  $('.editorThingsEditor').css('display', 'flex');

  //Create the Thing Name Data Value
  let thingNameData = document.createElement('div');
  thingNameData.classList.add('thingEditorName');
  thingNameData.classList.add('thingDataValue');
  let thingNameKey = document.createElement('div');
  thingNameKey.classList.add('thingEditorNameKey');
  thingNameKey.textContent = 'Thing Name';
  let thingNameValue = document.createElement('div');
  thingNameValue.classList.add('thingEditorNameValue');
  thingNameValue.textContent = thing.name;
  thingNameValue.contentEditable = true;
  $(thingNameData).append(thingNameKey);
  $(thingNameData).append(thingNameValue);
  $('.thingDataValuesList').append(thingNameData);

  //Changing the thing name
  $(thingNameValue).on('blur', () => {
    let newName = $(thingNameValue).text()
    if(newName.length > 0){
      thing.name = newName;
      $(`#thingOptionBtn-${thing.id}`).find('.thingOptionBtnLabel').text(newName);
      raygun.get(`thing/${thing.id}`).get('name').put(newName);
    }
  })

  let thingDataGun = thing.dataGun;
  let thingData = thing.data;
  let seenKeys = {}
  for(soul in thingDataGun){
    if(thingDataGun[soul] && thingDataGun[soul].exists && !seenKeys[thingDataGun[soul].key]){

      seenKeys[thingDataGun[soul].key] = true;

      let thingData = thingDataGun[soul];
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
          let thingDataId = thing.dataGun[thisSoul].id;
          thing.render(true);
          raygun.get(`thingData/${thingData.id}`).get('value').put(newValue)
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
  newThingOption.setAttribute('thingId', thing.id);
  newThingOption.setAttribute('thingSoul', thing.soul);

  if(!thing.parentThing){
    $('.editorThingsList').append(newThingOption);
  }else{
    let parentThingBtnId = '#thingOptionBtn-' + dimBeingEdited.things[thing.parentThing].id
    $(parentThingBtnId).append(newThingOption);
  }

  let newThingOptionContent = document.createElement('div');
  newThingOptionContent.classList.add('thingOptionBtnContent');
  newThingOption.append(newThingOptionContent);

  let newThingOptionLabel = document.createElement('div');
  newThingOptionLabel.classList.add('thingOptionBtnLabel');
  newThingOptionLabel.textContent = thing.name;
  $(newThingOptionContent).append(newThingOptionLabel);

  var sortable = Sortable.create($('.editorThingsList')[0], {
    direction: 'horizontal',
    onEnd : function(e){

      //Empty the Dimension Space
      $(dimBeingEdited.element).children('.space').empty();

      let thingOptions = $('.editorThingsList').children();
      for(var i=0; i < thingOptions.length;i++){
        let soul = thingOptions[i].getAttribute('thingSoul');
        let thingId = thingOptions[i].getAttribute('thingId');
        if(dimBeingEdited.things[soul]){
          dimBeingEdited.things[soul].loadOrder = i;
          if(!dimBeingEdited.things[soul].render){
            dimBeingEdited.things[soul] = new Thing(dimBeingEdited.things[soul])
            dimBeingEdited.things[soul].loadData();
          }
          dimBeingEdited.things[soul].render();
          raygun.get(`thing/${thingId}`).get('loadOrder').put(i);
        }
      }
    }
  })

  $(newThingOption).on('click', (e) => {
    e.stopPropagation();
    if(!inDeleteMode){
      openThingEditor(thing);
    }else{
      //Delete this thing
      function deleteThing(thing){
        let thisThingGun = raygun.get('thing/' + thing.id);
        thisThingGun.get('exists').put(false);
        raygun.get(`dimension/${dimBeingEdited.id}`).get('things').get(thing.soul).put(null);
        $(`#thingOptionBtn-${thing.id}`).remove();
        $(thing.element).remove();
        for(soul in thing.things){
          if(thing.things[soul]){
            raygun.get(`dimension/${dimBeingEdited.id}`).get('things').get(soul).put(null);
          }
        }
      }
      deleteThing(thing);
    }
  });

  //Add the thing children too if any
  let thingThingsInOrder = {};
  for(soul in thing.things){
    if(thing.things[soul]){
      thingThingsInOrder[dimBeingEdited.things[soul].loadOrder] = soul;
    }
  }
  console.log(thingThingsInOrder);
  for(let i=0; i < dimBeingEdited.ideas[thing.ideaSoul].ideaCount; i++){
    if(thingThingsInOrder[i]){
      console.log(dimBeingEdited.things[thingThingsInOrder[i]])
      dimBeingEdited.things[thingThingsInOrder[i]] = new Thing(dimBeingEdited.things[thingThingsInOrder[i]]);
      dimBeingEdited.things[thingThingsInOrder[i]].soul = thingThingsInOrder[i];
      dimBeingEdited.things[thingThingsInOrder[i]].loadData();
      createNewThing(dimBeingEdited.things[thingThingsInOrder[i]]);
    }
  }
}

function loadDimensionThings(thingsHaveData = false){
  let dimThings = dimBeingEdited.things;
  let thingsInOrder = {};
  for(soul in dimThings){
    if(dimThings[soul] && dimThings[soul].exists && !dimThings[soul].parentThing){
      thingsInOrder[dimThings[soul].loadOrder] = soul;
    }
  }
  for(let i=0; i < dimBeingEdited.thingCount; i++){
    if(thingsInOrder[i]){
      dimThings[thingsInOrder[i]] = new Thing(dimThings[thingsInOrder[i]]);
      dimThings[thingsInOrder[i]].soul = thingsInOrder[i];
      dimBeingEdited.things[thingsInOrder[i]] = dimThings[thingsInOrder[i]];
      dimBeingEdited.things[thingsInOrder[i]].loadData();
      createNewThing(dimBeingEdited.things[thingsInOrder[i]]);
    }
  }
}

$(document).ready(() => {

  //Go Back to Things List on Thing Editor Back Btn Click
  $('.thingEditorBackBtn').on('click', () => {
    $('.editorThingsEditor').css('display', 'none');
    $('.editorThingsList').css('display', 'flex');
    $('.thingDataValue').remove();
  })

})
