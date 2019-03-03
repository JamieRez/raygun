$(this.element).css({
  backgroundColor : this.data.color,
  width : this.data.width,
  height : this.data.height,
  transform : "Perspective(500px) " + this.data.transform,
  transition : "transform 0.5s ease-in-out",
  display : "flex",
  flexDirection : "column",
})
