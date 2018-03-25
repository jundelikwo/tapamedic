export function b64DecodeUnicode(str) {
    return decodeURIComponent(atob(str).replace(/(.)/g, function (m, p) {
        var code = p.charCodeAt(0).toString(16).toUpperCase();
        if (code.length < 2) {
            code = '0' + code;
        }
        return '%' + code;
    }));
}

export function removeServiceWorker(){
    navigator.serviceWorker.getRegistrations().then(function(registrations) {
        for(let registration of registrations) {
         registration.unregister()
       } })
}