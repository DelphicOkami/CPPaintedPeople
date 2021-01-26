let Loader;
let PageContents;
let ErrorContents;
$(document).ready(function () {
    PageContents = $('#PageContents');
    Loader = $('#Loader');
    ErrorContents = $('<div class="row"><div class="col-md-12 error">' +
        'It seems to me like you&apos;re looking for information we haven&apos;t recorded, how about you come and ask ' +
        'that sort of question rather than digging around in here.</div></div>')
    let page = ($(location).attr('hash').substring(2) || 'index');
    let moon = $('#moon')
    let sun = $('#sun')
    moon.click(function () {
        moon.hide();
        sun.show();
        $('link[href="css/darkly.css"]').attr('href','css/flatly.css');
    });
    sun.click(function () {
        moon.show();
        sun.hide();
        $('link[href="css/flatly.css"]').attr('href','css/darkly.css');
    })
    getPage(page);

});

function getPage(page) {
    PageContents.hide().empty();
    Loader.show();
    $.get(
        "/pages/" + page + '.json',
        // Success
        function (entries) {
            for(const entryNo in entries) {
                let entry = entries[entryNo]
                let renderedEntry = $('<div/>')
                let signed = (entry.author || 'Anonymous');
                renderedEntry.html(marked(entry.content))
                    .addClass(signed.toLowerCase())
                    .addClass('entry')
                    .addClass('col-md-12')
                $('<span class="signed">' + signed.replace('_', ' ') + '</span>').appendTo(renderedEntry)
                let row = $('<div class="row"/>')
                renderedEntry.appendTo(row)
                row.appendTo(PageContents)
            }
        }
    )
        .error(function () {
            ErrorContents.appendTo(PageContents)
        })
        .always(function () {
            Loader.hide();
            PageContents.show();
        });
}