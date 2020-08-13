$(function() {
  $("button").on("click", function () {
    $.ajax({
      type: 'GET',
      url: '/tiff/tt',
      success: function(data) {
        console.log("data.."+data)
        $('#mydiv').html(data);
      },
      error: function(error) {
        console.log(error)
      }
    });
  });
});
