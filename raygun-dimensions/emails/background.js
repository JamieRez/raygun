$(this.element).css({
  width : "100%",
  height : "100%",
  display : "flex",
  flexDirection : "column",
  justifyContent : "center",
  alignItems : "center",
  position : "absolute",
  zIndex : "-1",
  backgroundColor : this.data.color || "#fff0f8"
})


let thisBgImage = this.data.backgroundImage || "none";
if(thisBgImage != "none"){
  $(this.element).css({
    backgroundImage : "url('" + thisBgImage + "')"
  })
}else{
  $(this.element).css({
    backgroundImage : "initial"
  })
}

$(this.element).addClass('background')
