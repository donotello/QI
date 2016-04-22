VK_LINK_PREFIX = 'http://vk.com/videos-18564830?section=album_';

function getLink(link) {
  if (link.indexOf('video-') > -1 && link.indexOf('album-') > -1) {
    return VK_LINK_PREFIX + link;
  }
  return link;
}

function getSingleLink(l1, l2, l3, l4, l1empty, l2empty, l3empty, l4empty) {
  var singleLink = '';

  if (!l1empty && l2empty && l3empty && l4empty) {
    singleLink = l1;
  } else if (l1empty && !l2empty && l3empty && l4empty) {
    singleLink = l2;
  } else if (l1empty && l2empty && !l3empty && l4empty) {
    singleLink = l3;
  } else if (l1empty && l2empty && l3empty && !l4empty) {
    singleLink = l4;
  }

  return singleLink;
}

function addShowLink(showBlock, link, text, addComma) {
  if (typeof link !== 'undefined') {
    if (addComma) {
      showBlock.append($('<span />', {
        text: ', '
      }));
    }
    showBlock.append($('<a />', {
      href: getLink(link),
      target: '_blank',
      text: text
    }));
    return true;
  }
  return false;
}

function createShowWithSeveralLinks(text, guestId, show) {
  var showBlock = $('#guest' + guestId + 'shows div:last()');
  showBlock.append($('<span />', {
    text: text + ' ('
  }));

  var addComma = false;
  addComma = addShowLink(showBlock, show.eng, 'eng', addComma) || addComma;
  addComma = addShowLink(showBlock, show.eng_xl, 'eng_xl', addComma) || addComma;
  addComma = addShowLink(showBlock, show.rus, 'rus', addComma) || addComma;
  addComma = addShowLink(showBlock, show.rus_xl, 'rus_xl', addComma) || addComma;

  showBlock.append($('<span />', {
    text: ')'
  }));
}

function createShow(showId, guestId) {
  $('#guest' + guestId + 'shows').append($('<div />'));

  var guest = guests[guestId]
  var show = shows[showId];
  var text = show.name + ' (series ' + show.season + ' episode ' + show.episode + ')'
  if ($.inArray(showId, guest.winner) != -1) {
    text += ' (winner)';
  }

  var l1 = show.eng;
  var l2 = show.eng_xl;
  var l3 = show.rus;
  var l4 = show.rus_xl;
  var l1empty = typeof show.eng === 'undefined';
  var l2empty = typeof show.eng_xl === 'undefined';
  var l3empty = typeof show.rus === 'undefined';
  var l4empty = typeof show.rus_xl === 'undefined';

  if (l1empty && l2empty && l3empty && l4empty) {
    $('#guest' + guestId + 'shows div:last()').append($('<span />', {
      text: text
    }));
  } else {
    var singleLink = getSingleLink(l1, l2, l3, l4, l1empty, l2empty, l3empty, l4empty);

    if (singleLink != '') {
      console.log(singleLink);
      $('#guest' + guestId + 'shows div:last()').append($('<a />', {
        href: getLink(singleLink),
        target: '_blank',
        text: text
      }));
    } else {
      createShowWithSeveralLinks(text, guestId, show)
    }
  }
}

function addShows(guestId) {
  var guestBlock = $('#guest' + guestId);
  var block = $('<div />', {
    id: 'guest' + guestId + 'shows',
    class: 'shows'
  });
  block.insertAfter(guestBlock);
  for (j = 0; j < guests[guestId].shows.length; j++) {
    createShow(guests[guestId].shows[j], guestId);
  }
}

function createGuestBlock(guestId) {
  var guest = guests[guestId];
  block = $('<h3 />', {
    id: 'guest' + guestId,
    text: guest.name + ' (' + guest.winner.length + '/' + guest.shows.length + ')'
  });
  return block;
}

for (var i = 0; i < guests.length; i++) {
  $('#output').append(createGuestBlock(i));
  addShows(i);
}

accordion = $('#output').accordion({
  heightStyle: 'content'
});

$('#filter').keyup(function() {
  var filterText = $(this).val();
  var headers = $('#output h3');
  var shows = $('#output .shows[aria-hidden="false"]');

  if (filterText.length > 0) {
    var containing = headers.filter(function() {
      var regex = new RegExp('\\b' + filterText, 'i');
      return regex.test($(this).text());
    }).slideDown();

    headers.not(containing).slideUp();
    if (shows.prev().not(containing).length > 1) {
      shows.show();
    } else {
      shows.hide();
    }
  } else {
    headers.slideDown();
    shows.slideDown();
  }

  return false;
});