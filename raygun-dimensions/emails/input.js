$(this.element).css({
  display : "flex",
  flexDirection : "column",
  justifyContent : "center",
  alignItems : "center",
  padding : "10px"
})

let thisInput = document.createElement('input');
thisInput.id = "raygunEmailInput";
$(thisInput).css({
  width : "350px",
  fontSize : "20px",
  outline : "none",
  border : "2px solid #3ea26e",
  borderRadius : "8px",
  padding : "5px 5px",
  textAlign : "center",
  marginBottom : "20px"
})
if($('#raygunEmailInput').length === 0){
  $(this.element).append(thisInput)
}
$('#raygunEmailInput').attr('placeholder', this.data.placeholder || "Enter your email")


let thisInputBtn = document.createElement('div');
$(thisInputBtn).css({
  backgroundColor : "#ff5f5f",
  height : "40px",
  width : "200px",
  display : "flex",
  justifyContent : "center",
  alignItems : "center",
  cursor : "pointer"
})
let thisInputBtnLabel = document.createElement('div');
thisInputBtnLabel.id = "raygunEmailBtnText";
$(thisInputBtnLabel).css({
  color : "white",
  fontSize : "20px",
  textAlign : "center"
})

if( $('#raygunEmailBtnText').length === 0){
  $(this.element).append(thisInputBtn)
  $(thisInputBtn).append(thisInputBtnLabel)
}
$('#raygunEmailBtnText').text(this.data.btnText || "Submit");



function addEmailToList(email){
  let newEmail = document.createElement('div');
  newEmail.textContent = email;
  $(newEmail).css({
    textAlign : "center",
    fontSize : "15px",
    color : "#2ed17c",
    fontWeight : "bold",
    padding : "5px",
    marginBottom : "5px",
    marginRight : "5px",
    textDecoration : "underline"
  })
  $('.emailList').append(newEmail)
}

//Handle Submit
$(thisInputBtn).on("click", () => {
  let email =  $('#raygunEmailInput').val();
  if(email.length > 0){
    addEmailToList(email)
    let thisRaygun = gun.user(this.creatorPubKey);
    thisRaygun.get('emails').set(email);
    $('#raygunEmailInput').val("")
  }
});

if($('.mainTop').children(this.element).length == 0){
  $('.mainTop').append($(this.element))
}
