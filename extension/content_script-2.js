'use strict';

$("form").click((event) => {
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
            await restoreForm(html_form, form_data);

            html_form.submit();
            //$("form")[0].requestSubmit(); // https://developer.mozilla.org/en-US/docs/Web/API/HTMLFormElement/submit
        }
    )
}

async function parseForm(form_html, form_data) {
    // For each input of the form
    
    await $(form_html).find("input").each(await async function () {
        // We create a new js form
        let form = new FormData();

        let type;

        // Our following actions depend of the input type
        switch ($(this).attr('type')) {
            case 'text':
                // We convert our text as a file
                let blob = new Blob([this.value], {type: "text/plain;charset=utf-8"});
                // We add our text file in our js form
                form.append("file", blob, "tmp.txt");
                type = "text";
                break;
            case 'file':
                // We add the file in our js form with the correct name for the API. File name will always be tmp
                form.append("file", this.files[0], "tmp.jpg");
                type = "image";
                break;
            default:
                throw 'Input type is not supported'
        }

        const inputName = $(this).attr('name');

        // We specify the parameters for the ajax request to the self storage
        let settings = {
            // This url need to be changed to your own self storage
            "url": "",
            "method": "POST",
            "timeout": 0,
            "processData": false,
            "mimeType": "multipart/form-data",
            "contentType": false,
            "data": form,
            "async": false
        };

        await $.ajax(settings).done(await async function (response) {
            const responseJson = JSON.parse(response);

            let data;
            // If the data self stored was an image we call the QrCode class to generate a qrcode
            // with the link to the ressource
            if (type === "image") {
                let qrCode = new QrCode(responseJson.url);
                await qrCode.encode();
                data = await qrCode.getImage();
            }

            // We set the form data with the new value generated
            form_data.set(inputName, data);
        });
    });
}

// This function will create a new fileList from an array of file
function FileListItems (files) {
    let b = new ClipboardEvent("").clipboardData || new DataTransfer()
    for (let i = 0, len = files.length; i<len; i++) b.items.add(files[i])
    return b.files
}

// For todays date;
Date.prototype.today = function () {
    return ((this.getDate() < 10)?"0":"") + this.getDate() +"-"+(((this.getMonth()+1) < 10)?"0":"") + (this.getMonth()+1) +"-"+ this.getFullYear();
}

// For the time now
Date.prototype.timeNow = function () {
    return ((this.getHours() < 10)?"0":"") + this.getHours() +"_"+ ((this.getMinutes() < 10)?"0":"") + this.getMinutes() +"_"+ ((this.getSeconds() < 10)?"0":"") + this.getSeconds();
}

function restoreForm(form, formData) {
    // Here for each element of the form we will replace the current value by the value present in our formData
    $(form).find("input").each(function () {
        const inputName = $(this).attr('name');

        switch ($(this).attr('type')) {
            case 'text':
                //TODO
                break;
            case 'file':
                let newDate = new Date();
                let filename = "selfStored-" + newDate.today() + "-at-" + newDate.timeNow() + ".png";
                let files = [
                    new File([formData.get(inputName)], filename, {
                        type: "img/png",
                    })
                ];

                this.files = new FileListItems(files);
                break;
            default:
                throw 'Input type is not supported'
        }
    });
}