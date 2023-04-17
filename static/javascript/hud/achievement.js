function achievement(id) {
  let achievement;
  const url = '/api/endpoint/';
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
      $('.achievement-name').html(`${achievement.name}&nbsp;&ndash;&nbsp;${achievement.description}`);

      var el = $('.achievement-banner'),
          newone = el.clone(true);

      el.before(newone);
      $('.achievement-banner:last').remove();

      let aPane = document.querySelector(".achievements-pane");
      aPane.innerHTML += `
        <div class='achievement'>
          <div class="aIcon">
            <i class="fa-solid fa-trophy"></i>
          </div>
          <div class="aContent">
            <div class='aName'>${achievement.name}</div>
            <hr class='animated-hr aHr'>
            <div class='aDescription'>${achievement.description}</div>
            <div class='aId'>${achievement.id}</div>
          </div>
        </div>
      `;
    }
  }).catch(error => alert(error));
}

// Example of how to use achievement()
// $(document).ready(
//     achievement('1,000 &ndash; Example Achievement Banner')
// );