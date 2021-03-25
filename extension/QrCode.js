class QrCode {
    image;
    constructor(link, qrCodeLink) {
        this.link = link;
        this.qrCodeLink = qrCodeLink;
    }

    async encode() {
        //TODO replace the following encoding algorithm by using a js library
        if (this.link !== undefined) {
            await jQuery.ajax({
                url: `http://api.qrserver.com/v1/create-qr-code/?data=${this.link}&size=100x100`,
                cache: false,
                xhr: await function(){// Seems like the only way to get access to the xhr object
                    let xhr = new XMLHttpRequest();
                    xhr.responseType= 'blob'
                    return xhr;
                },
                success: await function(data){
                    return data;
                },
                error: function(){

                }
            })
                .then(blobQr => {
                    this.image = blobQr;
                });
        }
        else {throw new Error("link not defined")}
    }

    getImage() {
        if (this.image !== undefined) {
            return this.image;
        }
        else {throw new Error("Image not defined")}
    }

    decode() {
        //TODO replace the following decoding algorithm by using a js library
        if (this.qrCodeLink !== undefined) {
            const url = `https://api.qrserver.com/v1/read-qr-code/?fileurl=${this.qrCodeLink}`;

            const settings = {
                "url": url,
                "method": "GET",
                "timeout": 0,
                "processData": false,
                "mimeType": "multipart/form-data",
                "contentType": false,
                "async": false
            };

            let imageLink;

            $.ajax(settings).done( function (response) {
                const responseJson = JSON.parse(response);
                const data = responseJson[0];
                const symbol = data["symbol"][0]

                if (symbol.error === null) {
                    imageLink = symbol.data;
                }
                else throw new Error("Not a qrCode");
            });

            this.link = imageLink;
        }
        else {throw new Error("QR code Link not defined")}
    }

    getLink() {
        return this.link;
    }
}

async function toDataURL(url, callback) {
    let xhr = new XMLHttpRequest();
    xhr.onload = async function () {
        let reader = new FileReader();
        reader.onloadend = await function () {
            callback(reader.result);
        }
        await reader.readAsDataURL(xhr.response);
    };
    xhr.open('GET', url);
    xhr.responseType = 'blob';
    await xhr.send();
}