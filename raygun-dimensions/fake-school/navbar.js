//Create the Toolbar Element
$(this.element).addClass('mainToolbar');
$('.mainToolbar').css({
  backgroundColor : this.data.color || "#303030",
  width : this.data.width || "100%",
  height : this.data.height || "60px",
  borderBottom : this.data.border || "2px solid #36ffad",
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
leftToolbar.classList.add('mainToolbarLeft');
centerToolbar.classList.add('mainToolbarCenter');
rightToolbar.classList.add('mainToolbarRight');
if($('.mainToolbarLeft').length === 0){
  $('.mainToolbar').append(leftToolbar);
}
if($('.mainToolbarCenter').length === 0){
  $('.mainToolbar').append(centerToolbar);
}
if($('.mainToolbarRight').length === 0){
  $('.mainToolbar').append(rightToolbar);
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
mainDashBtn.classList.add('mainToolbarMainDashBtn');
toolbarLogo.classList.add('mainToolbarLogo');
toolbarLabel.classList.add('mainToolbarBrandLabel');
if($('.mainToolbarMainDashBtn').length === 0){
  $('.mainToolbarLeft').append(mainDashBtn)
}
if($('.mainToolbarLogo').length === 0){
  $('.mainToolbarMainDashBtn').append(toolbarLogo);
}
if($('.mainToolbarBrandLabel').length === 0){
  $('.mainToolbarMainDashBtn').append(toolbarLabel);
}
$('.mainToolbarMainDashBtn').css({
  display : "flex",
  flexDirection : "row",
  alignItems : "center",
  height : "100%",
  cursor : "pointer"
})
$('.mainToolbarLogo').css({
  width : "84px",
  height : "64px",
  cursor : "pointer",
  marginRight : "10px"
})
$('.mainToolbarBrandLabel').css({
  fontSize : "30px",
  fontWeight : "250",
  color : this.data.brandTextColor || "white"
})


$('.mainToolbarLogo').attr('src', this.data.brandLogo || "/components/fake_cool.png")
$('.mainToolbarBrandLabel').text(this.data.brandText || "Fake School");

//Create the toolbar location label. Starts off as Dashboard.
//This goes to the center side of the toolbar
let toolbarLocLabel = document.createElement('div');
toolbarLocLabel.classList.add('mainToolbarLocLabel');
if($('.mainToolbarLocLabel').length === 0){
  $('.mainToolbarCenter').append(toolbarLocLabel);
}
$('.mainToolbarLocLabel').text(this.data.locationLabelText || "Student Dashboard")
$('.mainToolbarLocLabel').css({
  textAlign : "center",
  fontSize : "30px",
  display : "flex",
  fontWeight : "250",
  color : this.data.locLabelTextColor || "#36ffad"
})

//Create the Profile Icon. This goes to the right side of the toolbar
let toolbarProfileIcon = document.createElement('img');
toolbarProfileIcon.classList.add('mainToolbarProfileIcon');
if($('.mainToolbarProfileIcon').length === 0){
  $('.mainToolbarRight').append(toolbarProfileIcon)
}
$('.mainToolbarProfileIcon').css({
  width : "48px",
  height : "48px",
  cursor : "pointer"
})
$('.mainToolbarProfileIcon').attr('src', this.data.profileIcon || "/toolbar/profile.svg");
