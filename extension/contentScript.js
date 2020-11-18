    $("e-img").each(function() {
        var source = $(this).attr("src");


        $(this).replaceWith("<img src=\"" + source + "\" " + getAttributes(this) + ">");

        //getAttributes(this)
    });

    $("e-vid").each(function() {
        var source = $(this).attr("src");


        $(this).replaceWith("<video style='width: 500px'><source src='" + source + "'> </video>");

        //getAttributes(this)
    });

    $("e-txt").each(function() {
        var source = $(this).attr("src");
        const element = this;

        $.get(source, function (data) {
            element.replaceWith(data);
        })
    });

function getAttributes ( element ) {
    var attributes = element.attributes;
    var string = "";

    for (const attr of attributes) {
        string += attr + " ";
    }

    console.log(string)
}