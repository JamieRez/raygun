$(this.element).css({
  backgroundColor : this.data.color || "#f0f0f0",
  width : "100%",
  height : "100%",
  position : "absolute",
  zIndex : "-1"
})

if(this.data.backgroundImage != "none"){
  $(this.element).css({
    backgroundImage : "url('" + this.data.backgroundImage || "/components/body-bg.gif" + "')",
    backgroundRepeat : this.data.backgroundRepeat || "initial",
    backgroundSize : this.data.backgroundSize || "initial"
  })
}











console.log("Hey man!");
