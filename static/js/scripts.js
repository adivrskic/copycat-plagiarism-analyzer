const obj = [
  {
      "similarity": 0.4598555386678978,
      "link": "<a data-ved=\"2ahUKEwjd4OjSvJyDAxVUtYQIHflKD5IQgQN6BAgMEAE\" href=\"/url?q=https://scholar.google.com/scholar%3Fq%3Dassessment,%2Bdata%2Binterpretation,%2Band%2Bmicro%2Band%2Bmacroeconomics.%26hl%3Den%26as_sdt%3D0%26as_vis%3D1%26oi%3Dscholart&amp;sa=U&amp;ved=2ahUKEwjd4OjSvJyDAxVUtYQIHflKD5IQgQN6BAgMEAE&amp;usg=AOvVaw0nHf50w4TMGh7aSR1xPdQa\"><span class=\"deIvCb AP7Wnd\"><span class=\"rQMQod Xb5VRe\">Scholarly articles for assessment, data interpretation, and micro and macroeconomics.</span></span></a>",
      "phrase": "assessment, data interpretation, and micro and macroeconomics."
  },
  {
      "similarity": 0.18823897055681799,
      "link": "<a class=\"eZt8xd\" href=\"/url?q=/search%3Fq%3Dbusiness%2Bvalue%2Bby%2Badding%2Bover%2B200%2Bresidential%2Bcustomers.%26sca_esv%3D8a501077993ea0e8%26ie%3DUTF-8%26tbm%3Dshop%26source%3Dlnms&amp;opi=89978449&amp;sa=U&amp;ved=0ahUKEwj3kq3VvJyDAxW3RTABHUypD-cQiaAMCAgoAw&amp;usg=AOvVaw0KCrCDiuvY6KH0SSmPeQuG\">Shopping</a>",
      "phrase": "      business value by adding over 200 residential customers."
  },
  {
      "similarity": 0.46536115655667654,
      "link": "<a data-ved=\"2ahUKEwj_9OPXvJyDAxVnRTABHTZvAV4QFnoECAAQAg\" href=\"/url?q=https://www.indeed.com/career-advice/career-development/research-databases&amp;sa=U&amp;ved=2ahUKEwj_9OPXvJyDAxVnRTABHTZvAV4QFnoECAAQAg&amp;usg=AOvVaw2-J0PimCef6p30pb1tsfIE\"><div class=\"DnJfK\"><div class=\"j039Wc\"><h3 class=\"zBAuLc l97dzf\"><div class=\"BNeawe vvjwJb AP7Wnd\">23 Research Databases for Professional and Academic Use - Indeed</div></h3></div><div class=\"sCuL3\"><div class=\"BNeawe UPmit AP7Wnd lRVwie\">www.indeed.com › Career Guide › Career development</div></div></div></a>",
      "phrase": "      databases for reliable reference."
  },
  {
      "similarity": 0.4982161102183709,
      "link": "<a href=\"/url?q=/search%3Fq%3D-%2B%2B%2BLed%2Ba%2Bteam%2Bin%2Ba%2Bbusiness%2Bsimulation%2Bproject.%26sca_esv%3D8a501077993ea0e8%26ie%3DUTF-8%26tbm%3Dshop%26source%3Dlnms&amp;opi=89978449&amp;sa=U&amp;ved=0ahUKEwi9zMbavJyDAxV7TTABHV8NBkQQiaAMCAooBQ&amp;usg=AOvVaw3wX9FJR3gj_rDbD74yBBWg\">Shopping</a>",
      "phrase": "-   Led a team in a business simulation project."
  }
];

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
            $('.custom-form-error').removeClass('visible');
            $('.custom-form-server-error').removeClass('visible');
            $('.custom-form-loading').addClass('visible');
          },
          success: function(data) {
            $('.custom-form-error').removeClass('visible');
            $('.custom-form-loading').removeClass('visible');
            $(".textarea").val(data);
          },
          error: function(err) {
            if(err.status === 400) {
              $(".textarea").val('');
              $('.custom-form-loading').removeClass('visible');
              $('.custom-form-error').addClass('visible');
            }
          }
      });
  });

  $('.scan').on('click', function() {
    if($('.textarea').val().length < 100) {
      $('.notification').addClass('visible');
    } else {
      $('.notification').removeClass('visisble');
      $.ajax({
        type: 'POST',
        url: '/scan',
        contentType: false,
        cache: false,
        processData: false,
        beforeSend: function() {
          $('.custom-form-server-error').removeClass('visible');
          $('.custom-form-loading').addClass('visible');
        },
        success: function(data) {
          $('.custom-form-error').removeClass('visible');
          $('.custom-form-loading').removeClass('visible');
          
          $('.custom-results').addClass('has-results');

          appendResults(obj);
          
        },
        error: function(err) {
          if(err.status === 500) {
            $('.custom-form-loading').removeClass('visible');
            $('.custom-form-server-error').addClass('visible');
          }
        }
      });
    }
  })

  $('.custom-form-error-close').on('click', function() {
    $('.custom-form-error').removeClass('visible');
    $('.custom-form-server-error').removeClass('visible');
  })

  $('.delete').on('click', function() {
    $('.notification').removeClass('visible');
  })

  const appendResults = data => {
    data.map(item => {
      const el = $("<div></div>").html(`
        <div class="custom-result">
          <h3 class="custom-result-phrase">${item.phrase}</h3>
          ${item.link}
          <span class="custom-result-percentage">${item.similarity * 100}</span>
        </div>
      `);
      $(".custom-results-container").append(el);
    })
  }
});

