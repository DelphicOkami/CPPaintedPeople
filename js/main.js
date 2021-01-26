let Loader;
let PageContents;
let ErrorContents;
$(document).ready(function () {
    PageContents = $('#PageContents');
    Loader = $('#Loader');
    ErrorContents = $('<div class="row"><div class="col-md-12 error alwaysTyped">' +
        'It seems to me like you&apos;re looking for information we haven&apos;t recorded, how about you come and ask ' +
        'that sort of question rather than digging around in here.</div></div>')
    let page = ($(location).attr('hash').substring(2) || 'index');
    setupModeSwitches();
    getPage(page);
});

function getPage(page) {
    PageContents.hide().empty();
    Loader.show();
    $.get(
        "/pages/" + page + '.yaml',
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
    moon.click(function () {
        moon.hide();
        sun.show();
        $('link[href="css/darkly.css"]').attr('href', 'css/flatly.css');
    });
    sun.click(function () {
        moon.show();
        sun.hide();
        $('link[href="css/flatly.css"]').attr('href', 'css/darkly.css');
    });
    typed.click(function () {
        typed.hide();
        pen.show();
        $('link[href="css/typed.css"]').attr('href', 'css/byhand.css');
    });
    pen.click(function () {
        typed.show();
        pen.hide();
        $('link[href="css/byhand.css"]').attr('href', 'css/typed.css');
    });
}