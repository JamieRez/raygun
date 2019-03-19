$(this.element).css({
  display : "flex",
  flexDirection : "column",
  justifyContent : "center",
  alignItems : "center",
  textAlign : "center",
  fontSize : "28px",
  color : "#2ed17c",
  marginBottom : "10px"
})

let messageText = document.createElement('div');
messageText.id = "raygunEmailsMsgTxt";
if($('#raygunEmailsMsgTxt').length === 0){
  $(this.element).append(messageText)
}
$('#raygunEmailsMsgTxt').text(this.data.message || "Join the interdimensional pals!")

if($('.mainTop').children(this.element).length == 0){
  $('.mainTop').append($(this.element))
}
