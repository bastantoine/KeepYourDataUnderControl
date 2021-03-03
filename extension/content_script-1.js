$( document ).ready(function() {
    $("e-img").each(function() {
        const source = $(this).attr("src");

        $(this).replaceWith(`<img src="${source}" ${getAttributes(this)}>`);
    });

    $("e-vid").each(function() {
        const source = $(this).attr("src");

        $(this).replaceWith(`<video ${getAttributes(this)}><source src="${source}"></video>`);
    });

    $("e-txt").each(function() {
        const source = $(this).attr("src");
        const alternativeText =  $(this).attr("alt");
        const element = this;

        $.get(source, function (data) {
            element.replaceWith(data);
          })
            .fail(function () {
                element.replaceWith(alternativeText);
            });
    });
});

function getAttributes ( element ) {
    const attributes = element.attributes;
    let string = "";

    for (const attr of attributes) {
        if (attr.value) string += `${attr.name}=${attr.value} `;
        else string += `${attr.name} `;
    }
    return string;
}