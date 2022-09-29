export function baseUrlToBlob(urlData) {
    let arr = urlData.split(',');
    let mime = arr[0].match(/:(.*?);/)[1];
    let bstr = atob(arr[1]);
    let n = bstr.length;
    let u8arr = new Uint8Array(n);
    while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
    }

    let filename = Date.parse(new Date()) + '.jpg';
    return new File([u8arr], filename, {type: mime});
}

