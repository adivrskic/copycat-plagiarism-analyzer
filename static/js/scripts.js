$(function() {
  $('#custom-file-input').on('change', function() {
      const form_data = new FormData($('#form')[0]);
      $.ajax({
          type: 'POST',
          url: '/upload',
          data: form_data,
          contentType: false,
          cache: false,
          processData: false,
          beforeSend: function() {
            console.log("Loading indicator stuff")
          },
          success: function(data) {
            $('.custom-form-error').removeClass('visible');
            $(".textarea").val(data);
          },
          error: function(err) {
            if(err.status === 400) {
              $(".textarea").val('');
              $('.custom-form-error').addClass('visible');
            }
          }
      });
  });

  $('.custom-form-error-close').on('click', function() {
    $('.custom-form-error').removeClass('visible');
  })
});