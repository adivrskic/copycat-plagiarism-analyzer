const obj = {
  aggregateSimilarity: 0.77,
  results: [
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
  ]
}

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
            console.log('data:' ,data);
            $('.custom-form-error').removeClass('visible');
            $('.custom-form-loading').removeClass('visible');
            $(".textarea").val(data);
            $('#custom-file-input').val(''); 
          },
          error: function(err) {
            console.log(err);
            if(err.status === 400) {
              $(".textarea").val('');
              $('.custom-form-loading').removeClass('visible');
              $('.custom-form-error').addClass('visible');
            }
          }
      });
  });

  $('.scan, .proceed').on('click', function(e) {
    if($('.textarea').val().length < 250) {
      $('.error-notification').addClass('visible');
      $('.proceed-notification').removeClass('visible');
    } else {
      $('.error-notification').removeClass('visible');
      $('.proceed-notification').removeClass('visible');
      $.ajax({
        type: 'POST',
        url: '/scan',
        contentType: false,
        data: JSON.stringify({
          val: $('.textarea').val(),
          type: $(e.target).hasClass('scan') ? 'regular' : 'deep'
        }),
        headers: { 
          'Accept': 'application/json',
          'Content-Type': 'application/json' 
        },
        contentType: 'application/json; charset=UTF-8',
        dataType: 'json',
        cache: false,
        processData: false,
        beforeSend: function() {
          $('.custom-form-server-error').removeClass('visible');
          $('.custom-form-loading').addClass('visible');
        },
        success: function(data) {
          $('.custom-form-error').removeClass('visible');
          $('.custom-form-loading').removeClass('visible');
          $('.custom-form-success').addClass('has-results');
          appendResults(data);
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

  $('.deep-scan').on('click', function() {
    $('.proceed-notification').addClass('visible');
  })

  $('.custom-form-error .close-icon, .custom-form-server-error .close-icon').on('click', function() {
    $('.custom-form-error').removeClass('visible');
    $('.custom-form-server-error').removeClass('visible');
  });

  $('.delete').on('click', function() {
    $('.notification').removeClass('visible');
    $('.proceed-notification').removeClass('visible');
  });

  $('.clear-button').on('click', function() {
    $(".textarea").val('');
    $('.custom-form-success').removeClass('has-results');
  });

  $('.see-details-button').on('click', function() {
    $('.custom-container').addClass('details-visible');
    $('.custom-form-success').addClass('details-visible');
    $('.custom-form-success-details').addClass('details-visible');
    $('.custom-form-success-details-container').addClass('details-visible');
  })

  $('.custom-form-success-details .close-icon').on('click', function() {
    $('.custom-container').removeClass('details-visible');
    $('.custom-form-success').removeClass('details-visible');
    $('.custom-form-success-details').removeClass('details-visible');
    $('.custom-form-success-details-container').removeClass('details-visible');
  })

  const appendResults = data => {
    const el = $("<div></div>").html(`
      <div class="outer-circle" id="outer-circle">
        <div class="inner-circle" id="inner-circle">
        </div>
      </div>
      <div class="custom-percent pb-2 is-size-1 has-text-weight-bold">${(Math.round(data.aggregateSimilarity * 100))}%</div>
    `);
    $(".custom-form-success-container").html(el);
    const outerCircle = document.getElementById("outer-circle");
    let color;
    if(data.aggregateSimilarity < .4) {
      color = 'hsl(204, 86%, 53%)'
    } else if(data.aggregateSimilarity >= .4 && data.aggregateSimilarity <= .7) {
      color = 'hsl(48, 100%, 67%)'
    } else {
      color = 'hsl(348, 100%, 61%)'
    }
    outerCircle.style.setProperty('background-image', 'conic-gradient(' +
      color +
      ' ' +
      ((300 / 100) * data.aggregateSimilarity * 100) +
      'deg, ' + '#e8f6fd' +
      ' ' +
      ((300 / 100) * data.aggregateSimilarity * 100) +
      'deg 300deg, ' + 'transparent 300deg 360deg)'
    )

    $('.custom-form-success-details-container').html('');
    data.results.map((item) => {
      $('.custom-form-success-details-container').append(`
      <div class="box is-flex is-flex-direction-column is-justify-content-space-between">
        <div class="percentage">Similarity: ${Math.round(item.similarity * 100)}%</div>
        <h4 class="has-text-weight-bold">"${item.phrase}"</h4>
        <a href="${item.link}">Found Here</a>
      </div>
    `)})
  }
});

