$(this.element).css({
  width : "100%",
  display : "flex",
  flexDirection : "column",
  justifyContent : "center",
  borderTop : "2px solid #3ea26e",
  marginTop : "20px",
  fontSize : "28px",
  textAlign : "center",
  color : "#2ed17c",
  paddingTop : "7px",
})

let listLabel = document.createElement('div');
listLabel.textContent = "Emails";
$(listLabel).css({
  marginTop : "5px"
})


let emailList = document.createElement('div');
$(emailList).addClass('emailList');
$(emailList).css({
  width : "100%",
  height : "70%",
  display : "flex",
  flexDirection : "column",
  justifyContent : "flex-start",
  alignItems : "center",
  flexWrap : 'wrap',
  overflowX : 'scroll',
  fontSize : "28px",
  textAlign : "center",
  color : "#2ed17c",
})

let thisElement = this.element

function addNewEmail(email){
  let newEmail = document.createElement('div');
  newEmail.textContent = email;
  $(newEmail).css({
    textAlign : "center",
    fontSize : "15px",
    textDecoration : "underline",
    color : "#2ed17c",
    fontWeight : "bold",
    padding : "5px",
    marginBottom : "5px",
    marginRight : "5px"
  })
  $(emailList).append(newEmail)
}

let thisRaygun = gun.user(this.creatorPubKey);
thisRaygun.get('emails').once((emails) => {
  for(let id in emails){
    if(id != "_" && emails[id]){
      addNewEmail(emails[id])
    }
  }
})

if($('.mainBottom').children(this.element).length == 0){
  $('.mainBottom').append($(thisElement))
  $(this.element).append(listLabel);
  $(this.element).append(emailList);
}
