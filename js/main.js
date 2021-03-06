let Loader, PageContents, ErrorContents, loading, NavbarToggle
$(document).ready(function () {
    PageContents = $('#PageContents');
    Loader = $('#Loader');
    ErrorContents = $('<div class="row"><div class="col-md-12 error alwaysTyped entry">' +
        'It seems to me like you&apos;re looking for information we haven&apos;t recorded, how about you come and ask ' +
        'that sort of question rather than digging around in here.</div></div>')
    NavbarToggle = $('.navbar-toggle');
    let page = ($(location).attr('hash').substring(2) || 'home');
    setupModeSwitches();
    getPage(page);
    setupMenu();
    window.onhashchange = function () {
        getPage($(location).attr('hash').substring(2) || 'home')
    }
});

function getPage(page) {
    PageContents.hide().empty();
    Loader.show();
    loading = $.get(
        "pages/" + page + '/page.json',
        // Success
        function (entries) {
            for (const entryNo in entries) {
                let entry = entries[entryNo];
                let renderedEntry = $('<div/>');
                let signedBy = (entry.author || 'Anonymous');
                let unsigned = entry.hasOwnProperty('unsigned') && entry.unsigned;
                let content = $.ajax({
                    type: "GET",
                    url: 'pages/' + page + '/' + entry.content,
                    cache: false,
                    async: false
                }).responseText;
                renderedEntry.html(marked(content))
                    .addClass(signedBy.toLowerCase().replaceAll(' ', '-'))
                    .addClass('entry')
                    .addClass('col-md-12');
                if (entry.hasOwnProperty('class')) {
                    renderedEntry.addClass(entry.class);
                }
                if (!unsigned) {
                    $('<span class="signed"><span>' + signedBy.replaceAll('_', ' ') + '</span></span>')
                        .appendTo(renderedEntry);
                }
                let row = $('<div class="row"/>');
                renderedEntry.appendTo(row);
                row.appendTo(PageContents);

                $('#PageContents img').each(function(index, image) {
                    let imageObject = $(image)
                    imageObject.addClass(imageObject.attr('alt').toLowerCase().replaceAll(' ', '-'))
                })
            }
        }
    )
        .error(function () {
            ErrorContents.appendTo(PageContents);
        })
        .always(function () {
            Loader.hide();
            PageContents.show();
        });
}

function setupModeSwitches() {
    let moon = $('#moon');
    let sun = $('#sun');
    let typed = $('#typed');
    let pen = $('#pen');
    moon.click(function (e) {
        e.preventDefault();
        moon.hide();
        sun.show();
        $('link[href="css/darkly.css"]').attr('href', 'css/flatly.css');
        closeOpenNavMenu();
    });
    sun.click(function (e) {
        e.preventDefault();
        moon.show();
        sun.hide();
        $('link[href="css/flatly.css"]').attr('href', 'css/darkly.css');
        closeOpenNavMenu();
    });
    typed.click(function (e) {
        e.preventDefault();
        typed.hide();
        pen.show();
        $('link[href="css/typed.css"]').attr('href', 'css/byhand.css');
        closeOpenNavMenu();
    });
    pen.click(function (e) {
        e.preventDefault();
        typed.show();
        pen.hide();
        $('link[href="css/byhand.css"]').attr('href', 'css/typed.css');
        closeOpenNavMenu();
    });
}

function setupMenu() {
    let navLi = $('<ul class="nav navbar-nav">')
    $.get(
        'menu.json',
        function (data) {
            navLi.append(arrayToLi(data))
            $('#navbar-main').prepend(navLi)
        }
    ).done(
        function () {
            $('.menuItem').click(function (e) {
                e.preventDefault();
                let page = $(e.currentTarget).attr('href')
                window.location = window.location.origin + window.location.pathname + '#/' + page;
                closeOpenNavMenu();
            });
        }
    );
}

function arrayToLi(menuItems) {
    var renderedItems = '';
    for (const id in menuItems) {
        let menuItem = menuItems[id];
        if (menuItem.hasOwnProperty('divider') && menuItem.divider) {
            renderedItems += '<li class="divider"></li>'
        } else if (menuItem.hasOwnProperty('entries')) {
            let list = '<ul class="dropdown-menu" aria-labelledby="' + menuItem.title.toString().replaceAll(' ', '') + '">'
                + arrayToLi(menuItem.entries) + '</ul>';
            renderedItems += '<li class="dropdown"><a class="dropdown-toggle" data-toggle="dropdown" href="#" id="' + menuItem.title.toString().replaceAll(' ', '') + '">' +
                menuItem.title.toString() +
                ' <span class="caret"></span></a>' + list + '</li>';
        } else {
            let url = (menuItem.hasOwnProperty('url') ? menuItem.url : menuItem.title.toLowerCase().replaceAll(' ', '-'))
            renderedItems += '<li><a class="menuItem" href="' + url + '">' + menuItem.title + '</a></li>'
        }
    }
    return renderedItems;
}

function closeOpenNavMenu() {
    if (NavbarToggle.is(':visible') && NavbarToggle.attr('aria-expanded') == "true") {
        NavbarToggle.click();
    }
}