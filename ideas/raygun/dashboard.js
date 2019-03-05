$(this.element).css({
  backgroundColor : this.data.color,
  width : this.data.width,
  height : this.data.height,
  transform : "Perspective(500px) " + this.data.transform,
  transition : "transform 0.5s ease-in-out",
  display : "flex",
  flexDirection : "column",
  padding : "20px"
})

//Create Dashboard Dimensions Label
let dashDimLabel = document.createElement('div');
dashDimLabel.textContent = "Your Dimensions";
$(dashDimLabel).css({
  fontSize : "20px",
  marginBottom : "10px",
  color : "#2ed17c"
});
$(this.element).append(dashDimLabel)

//Create The List of Dimensions
let dashDimList = document.createElement('div');
$(dashDimList).css({
  width : "100%",
  display : "flex",
  flexDirection : "row",
  justifyContent : "flexStart",
  alignItems : "flexStart",
  flexWrap : "wrap",
  borderTop : "2px solid #3ea26e",
  padding : "20px"
})
$(this.element).append(dashDimList)

//Create the New Dimension Button
let dashNewDimBtn = document.createElement('div');
let dashNewDimLabel = document.createElement('div');
dashNewDimLabel.textContent = "New Dimension";
$(dashNewDimBtn).css({
  width : this.data.dimBtnWidth,
  height : this.data.dimBtnHeight,
  padding : this.data.dimBtnPadding,
  margin : this.data.dimBtnMargin,
  border : "2px solid #c76a6a",
  color : "#c76a6a",
  display : "flex",
  flexDirection : "column",
  justifyContent : "center",
  alignItems : "center",
  cursor : "pointer"
})
$(dashNewDimLabel).css({
  fontSize : "18px",
  textAlign : "center",
  color : "c76a6a"
})
$(dashNewDimBtn).append(dashNewDimLabel)
$(dashDimList).append(dashNewDimBtn)


//Adding a dim as an option on the dashboard
function addDimOption(dim, thisData){
  let thisDimOption = document.createElement('div');
  let thisDimOptionLabel = document.createElement('div');
  thisDimOption.id = 'dashDimOption' + dim.id;
  thisDimOptionLabel.textContent = dim.name
  $(thisDimOption).css({
    width : thisData.dimBtnWidth,
    height : thisData.dimBtnHeight,
    padding : thisData.dimBtnPadding,
    margin : thisData.dimBtnMargin,
    border : "2px solid #3ea26e",
    color : "#2ed17c",
    display : "flex",
    flexDirection : "column",
    justifyContent : "center",
    alignItems : "center",
    cursor : "pointer"
  })
  $(thisDimOptionLabel).css({
    fontSize : "18px",
    textAlign : "center"
  })
  $(thisDimOption).append(thisDimOptionLabel);
  $(dashDimList).append(thisDimOption)
}


//Load the user dimensions if we haven't done so already
usergun.get('dimensions').load((dimensions) => {
  window.userDims = dimensions;
  for(soul in userDims){
    if(userDims[soul] && userDims[soul].exists){
      let thisDim = new Dimension(userDims[soul]);
      addDimOption(thisDim, this.data)
    }
  }
})
