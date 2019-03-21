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
  for(id in thingDataGun){
    if(thingDataGun[id] && !seenKeys[thingDataGun[id].key]){
      seenKeys[thingDataGun[id].key] = true;

      let thingData = thingDataGun[id];
      let thingDataId = thingDataGun[id].id;
      let thisKey = thingDataGun[id].key;
      let thisValue = thingDataGun[id].value;

      //Now we add the data value to the dom
      let thingDataValue = document.createElement('div');
      thingDataValue.classList.add('thingDataValue');
      thingDataValue.id = thingDataId;

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
          thing.data[thing.dataGun[thingDataId].key] = newValue;
          thing.dataGun[thingDataId].value = newValue;
          thing.render(true);
          raygun.get('thing/' + thing.id).get('dataGun').get(thingDataId).get('value').put(newValue)
          raygun.get('thing/' + thing.id).get('data').get(thing.dataGun[thingDataId].key).put(newValue)
        }
      })
    }
  }
}

function createNewThing(thing, thingHasData = false){
  //Add to dimension
  thing.render();
  //Add to things list in editor
  let newThingOption = document.createElement('div');
  newThingOption.classList.add('thingOptionBtn');
  newThingOption.id = 'thingOptionBtn-' + thing.id;
  newThingOption.thingId = thing.id;

  if(!thing.parentThing){
    $('.editorThingsList').append(newThingOption);
  }else{
    let parentThingBtnId = '#thingOptionBtn-' + thing.parentThing;
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
      $('#' + dimBeingEdited.id).children('.space').empty();
      let thingOptions = $('.editorThingsList').children();
      for(var i=0; i < thingOptions.length;i++){
        let thingId = thingOptions[i].thingId;
        if(loadedThings[thingId]){
          loadedThings[thingId].loadOrder = i;
          dimBeingEdited.things[i] = thingId;
          loadedThings[thingId].render();
          loadedThings[thingId].save()
          dimBeingEdited.save();
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
        raygun.get('thing/' + thing.id).put(null);
        raygun.get('dimension/' + dimBeingEdited.id).get('things').get(thing.loadOrder).put(null);
        $(`#thingOptionBtn-${thing.id}`).remove();
        dimBeingEdited.things[thing.loadOrder] = null;
        $(thing.element).remove();
        if(!thing.parentThing){
          dimBeingEdited.thingCount -= 1;
          //Update Thing Load orders in dim
          let dimThings = $('.editorThingsList').children('.thingOptionBtn');
          for(let i=0; i<dimThings.length;i++){
            loadedThings[dimThings[i].thingId].loadOrder = i;
            dimBeingEdited.things[i] = loadedThings[dimThings[i].thingId].id;
            loadedThings[dimThings[i].thingId].save();
          }
        }else{
          loadedThings[thing.parentThing].thingCount -= 1;
          loadedThings[thing.parentThing].things[thing.loadOrder] = null;
          loadedThings[thing.parentThing].save();
          let thingThings = $('#thingOptionBtn-' + thing.parentThing).children('.thingOptionBtn');
          for(let i=0; i<thingThings.length;i++){
            loadedThings[thingThings[i].thingId].loadOrder = i;
            loadedThings[thingThings[i].thingId].save();
          }
        }
        dimBeingEdited.save();
        for(i in thing.things){
          if(thing.things[i]){
            deleteThing(loadedThings[thing.things[i]]);
          }
        }
      }
      deleteThing(thing);
    }
  });

  //Add the thing children too if any
  raygun.get('thing/' + thing.id).get('things').load((thingIds) => {
    if(thingIds){
      for(let i=0; i<thing.thingCount; i++){
        if(thingIds[i]){
          if(!loadedThings[thingIds[i]]){
            let thisRaygun = gun.user(creatorPubKey);
            thisRaygun.get('thing/' + thingIds[i]).load((childThing) => {
              if(childThing){
                loadedThings[childThing.id] = new Thing(childThing)
                createNewThing(loadedThings[childThing.id]);
              }
            })
          }else{
            createNewThing(loadedThings[thingIds[i]])
          }
        }
      }
    }
  })
}

function loadDimensionThings(thingsHaveData = false){
  let dimThings = dimBeingEdited.things;
  for(let i=0; i<dimBeingEdited.thingCount; i++){
    if(dimThings[i]){
      let thisRaygun = gun.user(dimBeingEdited.creatorPubKey);
      thisRaygun.get('thing/' + dimThings[i]).load((thisThing) => {
        if(thisThing){
          if(!thisThing.parentThing){
            loadedThings[thisThing.id] = new Thing(thisThing);
            createNewThing(loadedThings[thisThing.id]);
          }
        }
      })
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
