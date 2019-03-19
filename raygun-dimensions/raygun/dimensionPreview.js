//Dimension Preview Container
$(this.element).css({
  width : "55%",
  height : "100%",
  display : "flex",
  flexDirection : "column",
  padding : "5px",
  paddingBottom : '0px',
  backgroundColor : "#f0f0f0",
  transition : "transform 0.25s ease-in-out"
})
$(this.element).addClass('.raygunDimensionPreview');
$('#raygunUpperEditor').append($(this.element));

//Dimension preview nav
let editorDimNav = document.createElement('div');
$(editorDimNav).css({
  display : "flex",
  flexDirection : "row",
  justifyContent : "space-between",
  alignItems : "center"
})
$(this.element).append(editorDimNav)

//Dimension Preview Tab
let dimEditorTab = document.createElement('div');
let dimEditorTabLabel = document.createElement('div');
dimEditorTabLabel.textContent = "Dimension";
$(dimEditorTab).css({
  height : "25px",
  width : "75px",
  textAlign : "center",
  fontSize : "15px",
  padding : "5px",
  borderBottom : "2px solid #3ea26e",
  display : "flex",
  flexDirection : "column",
  justifyContent : "center",
  alignItems : "center"
})
$(dimEditorTab).append(dimEditorTabLabel);
$(editorDimNav).append(dimEditorTab)

//Enter Dimension Btn
let enterDimBtn = document.createElement('div');
let enterDimBtnLabel = document.createElement('div');
enterDimBtnLabel.textContent = "Enter Dimension (~)";
$(enterDimBtn).css({
  border : "2px solid #3ea26e",
  color : "#2ed17c",
  fontSize : "15px",
  padding : "5px 10px",
  marginRight : "30px",
  display : "flex",
  justifyContent : "center",
  alignItems : "center",
  textAlign : "center",
  cursor : "pointer"
})
$(enterDimBtn).append(enterDimBtnLabel)
$(editorDimNav).append(enterDimBtn)

let editorDimPreview = document.createElement('div');
$(editorDimPreview).addClass("raygunDimPreviewBox");
$(editorDimPreview).css({
  width : "90%",
  height : "80%",
  display : "flex",
  flexDirection : "column",
  justifyContent : "center",
  alignItems : "center",
  marginTop : "20px",
  alignSelf : "center"
})
$(this.element).append(editorDimPreview)

$('.raygunDimPreviewBox')[0].renderThing = function(thing){

  thing.loadData(() => {

    let thisElement = document.createElement('div');
    thisElement.id = 'raygunDimPreviewBox-' + thing.ideaClassName + thing.id;
    thisElement.classList.add("thing");
    thing.element = '#' + thisElement.id;
    if($(thing.element).length === 0){
      $('.raygunDimPreviewBox').find('.space').append(thisElement);
    }
    eval(`
      new ${thing.ideaClassName}(thing).build();
    `)
  })

}
