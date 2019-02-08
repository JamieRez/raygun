function switchToDashboard(){
  $('.editor').css({
    display : "none"
  })
  $('.dashboard').css({
    display : "flex"
  })
  $('.toolbarLabel').text("Dashboard");
  $('.toolbarLabel')[0].contentEditable = false;
  $('.toolbarLabel').css({
    border : "0px solid #2ed17c",
    borderRadius : "0px",
    padding : "0px"
  })
}

$(document).ready(() => {

  $('.raygunToolbarDashBtn').on("click", (e) => {
    switchToDashboard();
  })

  $('.raygunProfileIcon').on("click", (e) => {
    switchToDashboard();
  })

})
