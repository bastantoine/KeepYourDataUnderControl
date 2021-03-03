$("form").find("*[type=submit]").click((event) => {
    event.preventDefault(); //this works for links

    let element = event.target.parentElement;

    while (!(element.nodeName === 'FORM')) {
        element = element.parentElement;
    }

    processForm(element);
});

function processForm(html_form) {
    let form_data = new FormData(html_form);

    $.when(parseForm(html_form, form_data)).done(async function (){
            let newHtmlForm = $(html_form).clone().appendTo(html_form.parentElement);
            $(html_form).empty();
            restoreForm(newHtmlForm, html_form, form_data)
            $(newHtmlForm).remove();
            $("form")[0].requestSubmit(); // https://developer.mozilla.org/en-US/docs/Web/API/HTMLFormElement/submit
        }
    )
}

function parseForm(form_html, form_data) {
    // For each input of the form which have self-storage as class
    $(form_html).find("input.self-storage").each(function () {
        // We create a new js form
        let form = new FormData();

        // Our following actions depend of the input type
        switch ($(this).attr('type')) {
            case 'text':
                console.log(this.value);
                // We convert our text as a file
                let blob = new Blob([this.value], {type: "text/plain;charset=utf-8"});
                // We add our text file in our js form
                form.append("file", blob, "tmp.txt");
                break;
            case 'file':
                // We add the file in our js form with the correct name for the API. File name will always be tmp
                form.append("file", this.files[0], "tmp.jpg");
                break;
            default:
                throw 'Input type is not supported'
        }

        const inputName = $(this).attr('name');

        let settings = {
            "url": "http://imta.bastien-antoine.fr/api/",
            "method": "POST",
            "timeout": 0,
            "processData": false,
            "mimeType": "multipart/form-data",
            "contentType": false,
            "data": form,
            "async": false
        };

        $.ajax(settings).done(function (response) {
            const responseJson = JSON.parse(response);
            form_data.set(inputName, responseJson.url);
        });
    });
}

function restoreForm(oldForm, newForm, formData) {
    for (let key of formData.keys()) {
        // We get the old input type
        let oldInputType = $(oldForm).find(`input[name="${ key }"], textarea[name="${ key }"]`).attr('type');
        // We get the value for this input, which could have been modified
        let inputValue = formData.get(key);

        let newType;
        if (typeof (inputValue) === "string") newType = 'text';
        else newType = oldInputType;
        // We start by creating a new input
        $('<input>', {
            type: newType,
            name: `new_${key}`,
            value: inputValue
        }).appendTo(newForm)
    }
}