$(this.element).addClass('raygunDashboard');
$(this.element).css({
  backgroundColor : this.data.color || "#f0f0f0",
  width : this.data.width || "100%",
  height : this.data.height || "100%",
  transform : "Perspective(500px) translate3d(0, 0, 0)",
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
  width : this.data.dimBtnWidth || "100px",
  height : this.data.dimBtnHeight || "100px",
  padding : this.data.dimBtnPadding || "5px 10px",
  margin : this.data.dimBtnMargin || "0px 20px 20px 0px",
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

let thisData = this.data
let thisElement = this.element;
//Adding a dim as an option on the dashboard
function addDimOption(dim){
  let thisDimOption = document.createElement('div');
  let thisDimOptionLabel = document.createElement('div');
  thisDimOption.id = 'dashDimOption' + dim.id;
  thisDimOptionLabel.textContent = dim.name
  $(thisDimOption).css({
    width : thisData.dimBtnWidth || "100px",
    height : thisData.dimBtnHeight || "100px",
    padding : thisData.dimBtnPadding || "5px 10px",
    margin : thisData.dimBtnMargin || "0px 20px 20px 0px",
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
  $(dashDimList).append(thisDimOption);

  $(thisDimOption).on("click", () => {
    $(thisElement).css('display', 'none');
    $('.raygunEditor').css('display', 'flex');
    $('.raygunEditor')[0].loadDimInEditor(dim)
  })

}

raygun.get('dimension').load((dimensions) => {
  for(id in dimensions){
    if(dimensions[id] && dimensions[id]){
      raygun.get('dimension/' + id).load((thisDim) => {
        thisDim = new Dimension(thisDim);
        addDimOption(thisDim)
      })
    }
  }
})
