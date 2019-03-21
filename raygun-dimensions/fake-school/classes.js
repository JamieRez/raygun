$(this.element).addClass('dashClasses');
$('.dashClasses').css({
  width : "350px",
  height : "450px",
  borderRadius : "15px",
  boxShadow : "0px 3px 5px 0px rgba(50, 50, 50, 0.5)",
  margin : "0px 25px",
  color : "#4a4a4a",
  display : "flex",
  flexDirection : "column",
  alignItems : "center"
})
$(this.element).appendTo('.dashContent')

let classLabel = document.createElement('div');
classLabel.classList.add('dashClassLabel');
if($('.dashClassLabel').length === 0){
  $('.dashClasses').append(classLabel)
}
$('.dashClassLabel').text(this.data.label || "Courses")
$('.dashClassLabel').css({
  marginTop : "10px",
  textAlign : "center",
  fontSize : "27px",
  textDecoration : "underline",
  marginBottom : "20px"
})

let courseList = document.createElement('div');
courseList.classList.add('dashCourseList');
if($('.dashCourseList').length === 0){
  $('.dashClasses').append(courseList)
  $('.dashCourseList').append(`
    <div>Glass Blowing</div>
    <div>Culinary Crafts</div>
    <div>Dan's Positivity Training</div>
    <div>Time Traveling Arts</div>
  `)
}
$('.dashCourseList').css({
  fontSize : "20px",
  display : "flex",
  flexDirection : "column",
  textAlign : "center",
})
$('.dashCourseList').children().css({
  marginBottom : "20px"
})
