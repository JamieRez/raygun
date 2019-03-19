//Create the Toolbar Element
$(this.element).css({
  backgroundColor : this.data.color || "#f0f0f0",
  width : this.data.width || "100%",
  height : this.data.height || "60px",
  borderBottom : this.data.border || "2px solid #3ea26e",
  padding : "5px 20px",
  display : "flex",
  flexDirection : "row",
  justifyContent : "space-between",
  alignItems : "center",
  transform : "perspective(500px) translate3d(0,0,0)",
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
  width : "500px",
  cursor : "pointer",
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
  color : this.data.brandTextColor || "#2ed17c"
})
toolbarLogo.setAttribute('data', this.data.brandLogo || "/toolbar/raygun.svg")
toolbarRaygunLabel.textContent = this.data.brandText || "RayGun"
$(mainDashBtn).append(toolbarLogo);
$(mainDashBtn).append(toolbarRaygunLabel);
$(leftToolbar).append(mainDashBtn)

$(mainDashBtn).on("click", () => {
  $('.raygunEditor').css('display', 'none');
  $('.raygunDashboard').css('display', 'flex');
  $('#raygunToolbarInput').css('display', 'none');
  $('#raygunToolbarLocLabel').css('display', 'flex');
})

//Create the toolbar location label. Starts off as Dashboard.
//This goes to the center side of the toolbar
let toolbarLocLabel = document.createElement('div');
toolbarLocLabel.id = 'raygunToolbarLocLabel';
toolbarLocLabel.textContent = this.data.locationLabelText || "Dashboard";
$(toolbarLocLabel).css({
  textAlign : "center",
  fontSize : "30px",
  display : "flex",
  fontWeight : "250",
  color : this.data.locLabelTextColor || "#2ed17c"
})
$(centerToolbar).append(toolbarLocLabel);

//Create the toolbar input box for the editor. Starts off hidden
let toolbarInput = document.createElement('div');
toolbarInput.id = 'raygunToolbarInput';
toolbarInput.contentEditable = true;
toolbarInput.textContent = "Untitled";
$(toolbarInput).css({
  display : "none",
  textAlign : "center",
  fontSize : "30px",
  fontWeight : "250",
  color : "#2ed17c",
  border : "2px solid #3ea26e",
  borderRadius : "25px",
  padding : "5px 10px",
  outline : "none"
})
$(centerToolbar).append(toolbarInput)

//Create the Profile Icon. This goes to the right side of the toolbar
let toolbarProfileIcon = document.createElement('object');
$(toolbarProfileIcon).css({
  width : "48px",
  height : "48px",
  cursor : "pointer"
})
toolbarProfileIcon.setAttribute('data', this.data.profileIcon || "/toolbar/profile.svg");
$(rightToolbar).append(toolbarProfileIcon)
