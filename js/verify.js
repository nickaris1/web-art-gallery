exports.verifyCookieAdmin = function(cookieVal) {
    const cookie = cookieVal; // get data cookie
    if (cookie != undefined) {
        const data = JSON.parse(Buffer.from(cookie, 'base64').toString('utf-8'));
        if (data.IsAdmin === 1) {
            return true;
        }
    }
    return false;
}

exports.verifyCookieLogin = function(cookieVal) {
    const cookie = cookieVal; // get data cookie
    if (cookie != undefined) { 
        return true;
    }
    return false;
}