const { createHash } = require("crypto");
const res = require("express/lib/response");
const sqlite3 = require("sqlite3");



exports.hash = function(string) {
    return createHash('sha256').update(string).digest('hex');
}


exports.getUser = function(userEmail, callback) {
    let ret = {};
    global.db.all("SELECT * FROM 'USER' WHERE email == ?", [userEmail], (error, rows) => {
        if (error) {
            console.log(error);
            ret = {};
            callback({});
        }
        if (rows.length > 1) {
            callback({});
            console.log("SELECT * FROM 'USER' WHERE email == ?", [userEmail]);
        } else {
            callback(rows[0]);
        }
    });
}

exports.addUser = function(userdata, callback) {
    console.log(userdata);

    this.getUser(userdata.email, (dbUserData) => {
        if (dbUserData === undefined || dbUserData === {}) {
            global.db.all("INSERT INTO USER ('Email', 'Name', 'Phone', 'PasswordHash') VALUES (?, ?, ?, ?)", [userdata.email.trim(), userdata.name.trim(), userdata.phone, this.hash(userdata.pass.trim())], (error, rows) => {
                if (error) {
                    console.log(error);
                    ret = {};
                    callback({});
                }
                console.log(rows);
                
            });
        } else {
            callback("Exists");
        }
    });
    
}