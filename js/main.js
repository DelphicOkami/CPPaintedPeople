let Loader;
let PageContents;
let ErrorContents;
let loading;
$(document).ready(function () {
    PageContents = $('#PageContents');
    Loader = $('#Loader');
    ErrorContents = $('<div class="row"><div class="col-md-12 error alwaysTyped entry">' +
        'It seems to me like you&apos;re looking for information we haven&apos;t recorded, how about you come and ask ' +
        'that sort of question rather than digging around in here.</div></div>')
    let page = ($(location).attr('hash').substring(2) || 'home');
    setupModeSwitches();
    getPage(page);
    setupMenu();
    window.onhashchange = function() {
        getPage($(location).attr('hash').substring(2) || 'home')
    }
});

function getPage(page) {
    PageContents.hide().empty();
    Loader.show();
    loading = $.get(
        "pages/" + page + '.yaml',
        // Success
        function (data) {
            let entries = jsyaml.load(data);
            for (const entryNo in entries) {
                let entry = entries[entryNo];
                let renderedEntry = $('<div/>');
                let signedBy = (entry.author || 'Anonymous');
                let unsigned = entry.hasOwnProperty('unsigned') && entry.unsigned;
                renderedEntry.html(marked(entry.content))
                    .addClass(signedBy.toLowerCase())
                    .addClass('entry')
                    .addClass('col-md-12');
                if (entry.hasOwnProperty('class')) {
                    renderedEntry.addClass(entry.class);
                }
                if (!unsigned) {
                    $('<span class="signed"><span>' + signedBy.replace('_', ' ') + '</span></span>')
                        .appendTo(renderedEntry);
                }
                let row = $('<div class="row"/>');
                renderedEntry.appendTo(row);
                row.appendTo(PageContents);
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
    });
    sun.click(function (e) {
        e.preventDefault();
        moon.show();
        sun.hide();
        $('link[href="css/flatly.css"]').attr('href', 'css/darkly.css');
    });
    typed.click(function (e) {
        e.preventDefault();
        typed.hide();
        pen.show();
        $('link[href="css/typed.css"]').attr('href', 'css/byhand.css');
    });
    pen.click(function (e) {
        e.preventDefault();
        typed.show();
        pen.hide();
        $('link[href="css/byhand.css"]').attr('href', 'css/typed.css');
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
                getPage(page);
            });
        }
    );
}

function arrayToLi(menuItems) {
    var renderedItems = '';
    for (const id in menuItems) {
        let menuItem = menuItems[id];
        if (menuItem.hasOwnProperty('entries')) {
            let list = '<ul class="dropdown-menu" aria-labelledby="' + menuItem.title.toString().replace(' ', '') + '">'
                + arrayToLi(menuItem.entries) + '</ul>';
            renderedItems +='<li class="dropdown"><a class="dropdown-toggle" data-toggle="dropdown" href="#" id="' + menuItem.title.toString().replace(' ', '') + '">' +
                menuItem.title.toString() +
                ' <span class="caret"></span></a>' + list + '</li>';
        } else {
            renderedItems += '<li><a class="menuItem" href="' + menuItem.url + '">' + menuItem.title + '</a></li>'
        }
    }
    return renderedItems;
}