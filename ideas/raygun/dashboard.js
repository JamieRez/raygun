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
