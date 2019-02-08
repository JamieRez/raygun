$(document).ready(()=> {

  $('.dashNewDimensionBtn').on("click", (e) => {

    //Change to Editor
    $('.dashboard').css({
      display : "none"
    })
    $('.editor').css({
      display : "flex"
    })
    $('.toolbarLabel').text("Untitled Dimension");
    $('.toolbarLabel')[0].contentEditable = true;
    $('.toolbarLabel').css({
      border : "2px solid #2ed17c",
      borderRadius : "25px",
      padding : "5px 10px",
    })
  })

})
