$(this.element).css({
  backgroundColor : this.data.color,
  width : "100%",
  height : "100%",
  position : "absolute",
  zIndex : "-1"
})

if(this.data.backgroundImage != "none"){
  $(this.element).css({
    backgroundImage : "url('" + this.data.backgroundImage + "')",
    backgroundRepeat : this.data.backgroundRepeat,
    backgroundSize : this.data.backgroundSize
  })
}











console.log("Hey man!");
