window.dimBeingEdited = null;

$(document).ready(() => {

  $('.toolbarLabel').on("blur", () => {
    let newDimName = $('.toolbarLabel').text();
    if(newDimName.length > 0){
      dimBeingEdited.name = newDimName;
      axios.post('/api/dimension/' + dimBeingEdited._id, dimBeingEdited).then((res) => {
        let dim = res.data;
        $('#dashDimOption-' + dim._id).find('.dashDimOptionLabel').text(dim.name);
      });
    }
  })

})
