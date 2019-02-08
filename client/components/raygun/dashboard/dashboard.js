$(document).ready(()=> {

  $('.dashNewDimensionBtn').on("click", (e) => {

    //Change to Editor
    $('.dashboard').css({
      display : "none"
    })
    $('.editor').css({
      display : "flex"
    })
    $('.toolbarLabel').text("Editor");


  })

})
