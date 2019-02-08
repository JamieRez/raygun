function switchToDashboard(){
  $('.editor').css({
    display : "none"
  })
  $('.dashboard').css({
    display : "flex"
  })
  $('.toolbarLabel').text("Dashboard");
}

$(document).ready(() => {

  $('.raygunToolbarDashBtn').on("click", (e) => {
    switchToDashboard();
  })

  $('.raygunProfileIcon').on("click", (e) => {
    switchToDashboard();
  })

})
