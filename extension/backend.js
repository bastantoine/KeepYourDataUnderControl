$( document ).ready(function() {
    $("span.e-img").each(function() {
        var source = $(this).html();

        $(this).replaceWith(`<img src="${source}" ${getAttributes(this)}>`);
    });

    $("span.e-vid").each(function() {
        var source = $(this).html();


        $(this).replaceWith("<video style='width: 500px'><source src='" + source + "'> </video>");

        //getAttributes(this)
    });

    $("span.e-txt").each(function() {
        var source = $(this).html();
        const element = this;

        $.get(source, function (data) {
            element.replaceWith(data);
        })
    });
});

function getAttributes ( element ) {
    var attributes = element.attributes;
    var string = "";

    for (const attr of attributes) {
        if (attr.name !== "hidden") {
            if (attr.value) string += `${attr.name}=${attr.value} `;
            else string += `${attr.name} `;
        }
    }

    console.log(string)
    return string;
}