function enterDimensionInEditor(){
  currentRaygunScreen = 'dimension';
  currentDimension = dimBeingEdited || currentDimension;
  currentDimension.pos = {
    left : $(currentDimension.element).css('left'),
    top : $(currentDimension.element).css('top')
  }
  $(currentDimension.element).css({
    transform : "perspective(500px) translate3d(0px, 0px, 0px)",
    top : "0px",
    left : "0px",
    zIndex : "1"
  });
}

function escapeDimensionToRaygun(){
  currentRaygunScreen = 'editor';
  currentDimension = dimBeingEdited || currentDimension;
  $('body').css({
    background: 'url("/components/body-bg.gif")'
  })
  $('.raygun').css({
    display : 'flex'
  })
  $(currentDimension.element).css({
    transform : "perspective(500px) translate3d(0px, 0px, -500px)",
    top : currentDimension.pos.top,
    left : currentDimension.pos.left,
    boxShadow : "0px 0px 3px 3px #2ed17c"
  })
}

function copyDimLinkToClipboard(){
  let dimLink = `https://www.raygun.live/user/${dimBeingEdited.creatorPubKey}/dim/${dimBeingEdited.id}`
  let dimLinkEl = document.createElement('textarea');
  dimLinkEl.value = dimLink;
  dimLinkEl.style.position = "absolute";
  dimLinkEl.style.left = '-100000';
  document.body.appendChild(dimLinkEl);
  dimLinkEl.select();
  document.execCommand('copy');
  document.body.removeChild(dimLinkEl);
}

function copyDim(){
  let dimCopy = new Dimension();
  Object.assign(dimCopy, dimBeingEdited)
  dimCopy.id = UUID();
  dimCopy.name = dimCopy.name + " Copy";
  dimCopy.creatorId = thisUserId;
  dimCopy.creatorName = thisUsername;
  dimCopy.creatorPubKey = raygun.is.pub;
  dimCopy.ideas = {null : null};
  dimCopy.things = {null : null};

  raygun.get('dimension').get(dimCopy.id).put(dimCopy.id);
  raygun.get('dimension/' + dimCopy.id).put(dimCopy);

  let ideaCopyKey = {};
  function copyDimIdeas(cb){
    copyIdeas = {};
    for(let id in dimBeingEdited.ideas){
      if(dimBeingEdited.ideas[id] && loadedIdeas[id]){
        let ideaCopy = new Idea();
        Object.assign(ideaCopy, loadedIdeas[id])
        ideaCopy.id = UUID();
        ideaCopyKey[id] = ideaCopy.id;
        ideaCopy.creatorId = thisUserId;
        ideaCopy.creatorName = thisUsername;
        ideaCopy.creatorPubKey = raygun.is.pub;
        dimCopy.ideas[ideaCopy.id] = ideaCopy.id;
        copyIdeas[ideaCopy.id] = ideaCopy;
      }
    };
    let ideaAmount = Object.keys(copyIdeas).length;
    let count = 0;
    for (let id in copyIdeas){
      if(copyIdeas[id]){
        //Update the children ideas to point to the new child idea
        copyIdeas[id].ideas = copyIdeas[id].ideas || {};
        for(childId in copyIdeas[id].ideas){
          copyIdeas[id].ideas[ideaCopyKey[childId]] = ideaCopyKey[childId] || null;
          delete copyIdeas[id].ideas[childId];
        }
        if(copyIdeas[id].parentIdea){
          copyIdeas[id].parentIdea = ideaCopyKey[copyIdeas[id].parentIdea];
        }
        raygun.get('idea/' + id).put(copyIdeas[id]);
        raygun.get('dimension/' + dimCopy.id).get('ideas').get(id).put(id, () => {
          count += 1;
          console.log(count + ": Copied an idea")
          if(count == ideaAmount){
            cb();
          }
        });
      }
    }
  }

  function copyDimThings(cb){
    copyThings = {};
    let thingCopyKey = {};
    for(let i in dimBeingEdited.things){
      if(dimBeingEdited.things[i]){
        let thingId = dimBeingEdited.things[i];
        ideaBeingEdited = loadedIdeas[loadedThings[thingId].ideaId]
        let thingCopy = new Thing();
        Object.assign(thingCopy, loadedThings[thingId]);
        thingCopy.id = UUID();
        thingCopyKey[thingId] = thingCopy.id;
        thingCopy.creatorId = thisUserId;
        thingCopy.creatorName = thisUsername;
        thingCopy.creatorPubKey = raygun.is.pub;
        thingCopy.dimension = dimCopy.id;
        thingCopy.dimElement = null;
        thingCopy.parentElement = null;
        thingCopy.ideaId = ideaCopyKey[thingCopy.ideaId];
        dimCopy.things[i] = thingCopy.id;
        copyThings[thingCopy.id] = thingCopy;
      }
    };
    let thingAmount = Object.keys(copyThings).length;
    let count = 0;
    for (let id in copyThings){
      if(copyThings[id]){
        //Update the children ideas to point to the new child idea
        copyThings[id].things = copyThings[id].things || {};
        for(childId in copyThings[id].things){
          copyThings[id].things[thingCopyKey[childId]] = thingCopyKey[childId] || null;
          delete copyThings[id].things[childId];
        }
        if(copyThings[id].parentThing){
          copyThings[id].parentThing = thingCopyKey[copyThings[id].parentThing];
        }
        raygun.get('thing/' + id).put(copyThings[id]);
        raygun.get('dimension/' + dimCopy.id).get('things').get(id).put(id, () => {
          count += 1;
          console.log(count + ": Copied a thing")
          if(count == thingAmount){
            cb();
          }
        });
      }
    }

  }

  copyDimIdeas(() => {
    copyDimThings(() => {
      raygun.get('dimension').get(dimCopy.id).put(dimCopy.id);
      raygun.get('dimension/' + dimCopy.id).put(dimCopy, () => {
        console.log("Copied Dimension");
        console.log(dimCopy)
      });
    })
  })

}

$(document).ready(() => {

  $('.goToDimBtn').on("click", () => {
    enterDimensionInEditor();
  })

  $('.copyDimBtn').on('click', () => {
    copyDim();
  })

  $('.shareDimBtn').on('click', () => {
    copyDimLinkToClipboard();
    $('.shareDimBtnLabel').text("Link Copied to Clipboard!")
    setTimeout(() => {
      $('.shareDimBtnLabel').text("Share Dimension")
    }, 1000)
  })

})
