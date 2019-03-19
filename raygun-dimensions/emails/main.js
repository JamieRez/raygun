$(this.element).css({
  width : "90%",
  height : "90%",
  display : "flex",
  flexDirection : "column",
  justifyContent : "center",
  alignItems : "center",
  position : "absolute",
  zIndex : "-1",
})
$(this.element).addClass('main');

let mainTop = document.createElement('div');
$(mainTop).css({
  width : "100%",
  height : "55%",
  display : "flex",
  flexDirection : "column",
  justifyContent : "center",
  alignItems : "center",
})
$(mainTop).addClass('mainTop');
let mainBottom = document.createElement('div');
$(mainBottom).css({
  width : "100%",
  height : "45%",
  display : "flex",
  flexDirection : "column",
  justifyContent : "center",
  alignItems : "center",
})
$(mainBottom).addClass('mainBottom');

if($('.background').children(this.element).length === 0){
  $(this.element).append(mainTop);
  $(this.element).append(mainBottom);
  $('.background').append($(this.element));
}
