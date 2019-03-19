$(this.element).css({
  display : "flex",
  justifyContent : "center",
  alignItems : "center",
  marginBottom : "0px",
  marginTop : "75px"
})

let logo = document.createElement('object');
logo.id = 'raygunEmailLogo';
$(logo).attr('data', 'toolbar/raygun.svg')
$(logo).css({
  width : this.data.size || "100px",
  height : this.data.size || "100px"
})

if($('#raygunEmailLogo').length === 0){
  $(this.element).append(logo);
};

$('#raygunEmailLogo').css({
  width : this.data.size || "100px",
  height : this.data.size || "100px"
})


if($('.mainTop').children(this.element).length == 0){
  $('.mainTop').append($(this.element))
}
