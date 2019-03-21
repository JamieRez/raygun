$(this.element).addClass('mainDashboard');
$('.mainDashboard').css({
  backgroundColor : this.data.color || '#f3f3f3',
  width : "100%",
  height : "100%",
  display : "flex",
  flexDirection : "column",
  alignItems : "center"
})

let dashMessage = document.createElement('div');
dashMessage.classList.add("dashMessage");
if($('.dashMessage').length === 0){
  $('.mainDashboard').append(dashMessage);
}
$('.dashMessage').css({
  marginTop : "30px",
  fontSize : "24px",
  textAlign : "center"
})
$('.dashMessage').text(this.data.dashText || "Welcome to your Student Portal, James")

let dashContent = document.createElement('div');
dashContent.classList.add('dashContent');
if($('.dashContent').length === 0){
  $('.mainDashboard').append(dashContent);
}
$('.dashContent').css({
  width : "100%",
  display : "flex",
  flexDirection : "row",
  alignItems : "center",
  justifyContent : "center",
  marginTop : "25px"
})
