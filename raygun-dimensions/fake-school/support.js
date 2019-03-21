$(this.element).addClass('dashSupport');
$('.dashSupport').css({
  width : "350px",
  height : "450px",
  borderRadius : "15px",
  boxShadow : "0px 3px 5px 0px rgba(50, 50, 50, 0.5)",
  margin : "0px 25px",
  color : "#4a4a4a"
})
$(this.element).appendTo('.dashContent')

let supportLabel = document.createElement('div');
supportLabel.classList.add('dashSupportLabel');
if($('.dashSupportLabel').length === 0){
  $('.dashSupport').append(supportLabel)
}
$('.dashSupportLabel').text(this.data.label || "Support")
$('.dashSupportLabel').css({
  marginTop : "10px",
  textAlign : "center",
  fontSize : "27px",
  textDecoration : "underline",
  marginBottom : "20px"
})

let supportList = document.createElement('div');
supportList.classList.add('dashSupportList');
if($('.dashSupportList').length === 0){
  $('.dashSupport').append(supportList)
  $('.dashSupportList').append(`
    <div>Online First Aid Kid</div>
    <div>Office Hours</div>
    <div>Slack Channel</div>
    <div>Student Calendar</div>
    <div>Talk to the Dean</div>
    <div>Dan's Positive Support</div>
  `)
}
$('.dashSupportList').css({
  fontSize : "20px",
  display : "flex",
  flexDirection : "column",
  textAlign : "center",
})
$('.dashSupportList').children().css({
  marginBottom : "20px",
  color : "#4bb1e4",
  textDecoration : "underline",
  cursor : "pointer"
})
