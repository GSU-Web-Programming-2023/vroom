function achievement(text) {
    $('.achievement-banner').css('opacity', '1');
    $('.achievement-notification').html('Achievement Unlocked');
    $('.achievement-name').html(text);

    var el = $('.achievement-banner'),
        newone = el.clone(true);

    el.before(newone);
    $('.achievement-banner:last').remove();
}

// Example of how to use achievement()
// $(document).ready(
//     achievement('1,000 &ndash; Example Achievement Banner')
// );