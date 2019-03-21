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
leftToolbar.classList.add('toolbarLeft');
centerToolbar.classList.add('toolbarCenter');
rightToolbar.classList.add('toolbarRight');
if($('.toolbarLeft').length === 0){
  $(this.element).append(leftToolbar);
}
if($('.toolbarCenter').length === 0){
  $(this.element).append(centerToolbar);
}
if($('.toolbarRight').length === 0){
  $(this.element).append(rightToolbar);
}

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


//Add the Main Dashboard Button (Combo of logo and label)
//This goes to the left side of the toolbar
let mainDashBtn = document.createElement('div');
let toolbarLogo = document.createElement('img');
let toolbarLabel = document.createElement('div');
mainDashBtn.classList.add('toolbarMainDashBtn');
toolbarLogo.classList.add('toolbarLogo');
toolbarLabel.classList.add('toolbarBrandLabel');
if($('.toolbarMainDashBtn').length === 0){
  $('.toolbarLeft').append(mainDashBtn)
}
if($('.toolbarLogo').length === 0){
  $('.toolbarMainDashBtn').append(toolbarLogo);
}
if($('.toolbarBrandLabel').length === 0){
  $('.toolbarMainDashBtn').append(toolbarLabel);
}
$('.toolbarMainDashBtn').css({
  display : "flex",
  flexDirection : "row",
  alignItems : "center",
  height : "100%",
  cursor : "pointer"
})
$('.toolbarLogo').css({
  width : "64px",
  height : "64px",
  cursor : "pointer",
  marginRight : "10px"
})
$('.toolbarBrandLabel').css({
  fontSize : "30px",
  fontWeight : "250",
  color : this.data.brandTextColor || "#2ed17c"
})


$('.toolbarLogo').attr('src', this.data.brandLogo || "/toolbar/raygun.svg")
$('.toolbarBrandLabel').text(this.data.brandText || "RayGun");

$('.toolbarMainDashBtn').on("click", () => {
  $('.raygunEditor').css('display', 'none');
  $('.raygunDashboard').css('display', 'flex');
  $('#raygunToolbarInput').css('display', 'none');
  $('#raygunToolbarLocLabel').css('display', 'flex');
})

//Create the toolbar location label. Starts off as Dashboard.
//This goes to the center side of the toolbar
let toolbarLocLabel = document.createElement('div');
toolbarLocLabel.classList.add('toolbarLocLabel');
if($('.toolbarLocLabel').length === 0){
  $('.toolbarCenter').append(toolbarLocLabel);
}
$('.toolbarLocLabel').text(this.data.locationLabelText || "Dashboard")
$('.toolbarLocLabel').css({
  textAlign : "center",
  fontSize : "30px",
  display : "flex",
  fontWeight : "250",
  color : this.data.locLabelTextColor || "#2ed17c"
})

//Create the Profile Icon. This goes to the right side of the toolbar
let toolbarProfileIcon = document.createElement('img');
toolbarProfileIcon.classList.add('toolbarProfileIcon');
if($('.toolbarProfileIcon').length === 0){
  $('.toolbarRight').append(toolbarProfileIcon)
}
$('.toolbarProfileIcon').css({
  width : "48px",
  height : "48px",
  cursor : "pointer"
})
$('.toolbarProfileIcon').attr('src', this.data.profileIcon || "/toolbar/profile.svg");
