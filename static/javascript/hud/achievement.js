function achievement(id) {
    let achievement;
    const url = 'http://localhost:5000/api/endpoint/';
    const data = {
        'postType': 'achievement',
        'user_id': $('#user-id').val(),
        'achievement_id': id
    }
    fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      })
      .then(response => response.json())
      .then(data => {
          if ('error' in data) {
              alert(data['error']);
          } else {
            achievement = data['achievement'];
            $('.achievement-banner').css('opacity', '1');
            $('.achievement-notification').html('Achievement Unlocked');
            $('.achievement-name').html(achievement);

            var el = $('.achievement-banner'),
                newone = el.clone(true);

            el.before(newone);
            $('.achievement-banner:last').remove();
          }
        }).catch(error => alert(error));
}

// Example of how to use achievement()
// $(document).ready(
//     achievement('1,000 &ndash; Example Achievement Banner')
// );