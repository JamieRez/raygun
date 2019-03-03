//Create the Toolbar Element
$(this.element).css({
  backgroundColor : this.data.color,
  width : this.data.width,
  height : this.data.height,
  borderBottom : this.data.border,
  padding : "5px 20px",
  display : "flex",
  flexDirection : "row",
  justifyContent : "space-between",
  alignItems : "center",
  transform : "perspective(500px) " + this.data.transform,
});

//Separate the toolbar into 3 sections (left - center - right)
let leftToolbar = document.createElement('div');
let centerToolbar = document.createElement('div');
let rightToolbar = document.createElement('div');
leftToolbar.classList.add('.toolbarLeft');
centerToolbar.classList.add('.toolbarCenter');
rightToolbar.classList.add('.toolbarRight');
$(leftToolbar).css({
  display : "flex",
  flexDirection : "row",
  alignItems : "center",
  height : "100%",
  justifyContent : "flexStart",
  width : "500px"
})
$(centerToolbar).css({
  display : "flex",
  flexDirection : "row",
  alignItems : "center",
  height : "100%",
  justifyContent : "center",
  width : "100%"
})
$(rightToolbar).css({
  display : "flex",
  flexDirection : "row",
  alignItems : "center",
  height : "100%",
  justifyContent : "flex-end",
  width : "500px",
  marginRight : "40px"
})
$(this.element).append(leftToolbar);
$(this.element).append(centerToolbar);
$(this.element).append(rightToolbar);


//Add the Main Dashboard Button (Combo of logo and label)
//This goes to the left side of the toolbar
let mainDashBtn = document.createElement('div');
let toolbarLogo = document.createElement('object');
let toolbarRaygunLabel = document.createElement('div');
$(mainDashBtn).css({
  display : "flex",
  flexDirection : "row",
  alignItems : "center",
  height : "100%",
  cursor : "pointer"
})
$(toolbarLogo).css({
  width : "64px",
  height : "64px",
  cursor : "pointer",
  marginRight : "10px"
})
$(toolbarRaygunLabel).css({
  fontSize : "30px",
  fontWeight : "250",
  color : this.data.brandTextColor
})
toolbarLogo.setAttribute('data', this.data.brandLogo)
toolbarRaygunLabel.textContent = this.data.brandText

$(mainDashBtn).append(toolbarLogo);
$(mainDashBtn).append(toolbarRaygunLabel);
$(leftToolbar).append(mainDashBtn)
