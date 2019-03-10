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
      $(dimBeingEdited.element).children('.space').empty();

      let thingOptions = $('.editorThingsList').children();
      for(var i=0; i < thingOptions.length;i++){
        let thingId = thingOptions[i].thingId;
        if(loadedThings[thingId]){
          loadedThings[thingId].loadOrder = i;
          loadedThings[thingId].render();
          loadedThings[thingId].save()
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
        $(`#thingOptionBtn-${thing.id}`).remove();
        dimBeingEdited.things[thing.id] = null;
        $(thing.element).remove();
        if(!thing.parentThing){
          dimBeingEdited.thingCount -= 1;
          //Update Thing Load orders in dim
          let dimThings = $('.editorThingsList').children('.thingOptionBtn');
          for(let i=0; i<dimThings.length;i++){
            loadedThings[dimThings[i].thingId].loadOrder = i;
            loadedThings[dimThings[i].thingId].save();
          }
        }else{
          loadedThings[thing.parentThing].thingCount -= 1;
          loadedThings[thing.parentThing].things[thing.id] = null;
          loadedThings[thing.parentThing].save();
          let thingThings = $('#thingOptionBtn-' + thing.parentThing).children('.thingOptionBtn');
          for(let i=0; i<thingThings.length;i++){
            loadedThings[thingThings[i].thingId].loadOrder = i;
            loadedThings[thingThings[i].thingId].save();
          }
        }
        dimBeingEdited.save();
        for(id in thing.things){
          if(thing.things[id]){
            deleteThing(loadedThings[id]);
          }
        }
      }
      deleteThing(thing);
    }
  });

  //Add the thing children too if any
  raygun.get('thing/' + thing.id).get('things').load((thingIds) => {
    if(thingIds){
      let thingThingsInOrder = {};
      let count = 0;
      for(let id in thingIds){
        if(thingIds[id]){
          raygun.get('thing/' + thingIds[id]).load((childThing) => {
            if(childThing){
              loadedThings[thingIds[id]] = childThing
              thingThingsInOrder[loadedThings[id].loadOrder] = id;
              count++;
              if(count == thing.thingCount){
                for(let i=0; i < thing.thingCount; i++){
                  if(thingThingsInOrder[i]){
                    loadedThings[thingThingsInOrder[i]] = new Thing(loadedThings[thingThingsInOrder[i]]);
                    createNewThing(loadedThings[thingThingsInOrder[i]]);
                  }
                }
              }
            }
          })
        }
      }
    }
  })
}

function loadDimensionThings(thingsHaveData = false){
  let dimThings = dimBeingEdited.things;
  let thingsInOrder = {};
  let count = 0;
  for(id in dimThings){
    if(dimThings[id]){
      raygun.get('thing/' + id).load((thisThing) => {
        if(!thisThing.parentThing){
          loadedThings[thisThing.id] = thisThing;
          thingsInOrder[thisThing.loadOrder] = thisThing.id;
          count += 1;
          if(count == dimBeingEdited.thingCount){
            for(let i=0; i < dimBeingEdited.thingCount; i++){
              if(thingsInOrder[i]){
                loadedThings[thingsInOrder[i]] = new Thing(loadedThings[thingsInOrder[i]]);
                createNewThing(loadedThings[thingsInOrder[i]]);
              }
            }
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
