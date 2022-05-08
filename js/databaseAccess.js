const { createHash } = require("crypto");
const res = require("express/lib/response");
const sqlite3 = require("sqlite3");

/**
 * 
 * @param {string} string string to hash
 * @returns sha256 hash of string
 */
exports.hash = function (string) {
    return createHash('sha256').update(string).digest('hex');
}

/**
 * 
 * @param {string} userEmail user email to check if exists in db
 * @param {function} callback {} => if user not found, userdata in json if user is found
 */
exports.getUser = function (userEmail, callback) {
    global.db.all("SELECT * FROM 'USER' WHERE email == ?", [userEmail], (error, rows) => {
        if (error) {
            console.log(error);
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

/**
 * Add user to Database
 * @param {JSON} userdata 
 * @param {Function} callback callback function 0 => error, 200 => OK
 */
exports.addUser = function (userdata, callback) {
    this.getUser(userdata.email, (dbUserData) => {
        if (dbUserData === undefined || dbUserData === {}) {
            global.db.all("INSERT INTO USER ('Email', 'Name', 'Phone', 'PasswordHash') VALUES (?, ?, ?, ?)", [userdata.email.trim(), userdata.name.trim(), userdata.phone, this.hash(userdata.pass.trim())], (error, rows) => {
                if (error) {
                    console.log(error);
                    callback(0);
                }
                callback(200);
            });
        } else {
            callback(0);
        }
    });
}

/**
 * Add Artist entry to db
 * @param {string} artistName Artist name to add
 * @param {function} callback callback function 0 => error, 200 => OK
 */
exports.addArtist = function (artistName, callback) {
    global.db.all("INSERT INTO ARTIST ('name') VALUES (?)", [artistName.trim()], (error, rows) => {
        if (error) {
            console.log(error);
            callback(0);
        }
        callback(200);
    });
}

/**
 * 
 * @param {function} callback {} => if user not found, userdata in json if user is found
 */
exports.getArtists = function (callback) {
    global.db.all("SELECT * FROM 'ARTIST'", (error, rows) => {
        if (error) {
            console.log(error);
            callback({});
        } else {
            callback(rows);
        }
    });
}

/**
 * @param {string} artistName
 * @param {function} callback 
 */
exports.getArtist = function (artistName, callback) {
    global.db.all("SELECT * FROM 'ARTIST' where name=?", [artistName], (error, rows) => {
        if (error) {
            console.log(error);
            callback({});
        } else {
            callback(rows[0]);
        }
    });
}

/**
 * Add Collection entry to db
 * @param {object} collectionData Artist name to add
 * @param {function} callback callback function 0 => error, 200 => OK
 */
 exports.addCollection = function (collectionData, callback) {
    this.getArtist(collectionData.artist.trim(), (artistData) => {
        if (artistData != undefined) {
            global.db.all("INSERT INTO COLLECTION ('Name', 'Description', 'ArtistID') VALUES (?, ?, ?)", [collectionData.name.trim(), collectionData.description.trim(), artistData.id], (error, rows) => {
                if (error) {
                    console.log(error);
                    console.log("INSERT INTO COLLECTION ('Name', 'Description', 'ArtistID') VALUES (?, ?, ?)", [collectionData.name.trim(), collectionData.description.trim(), artistData.id])
                    callback(0);
                } else {
                    callback(200);
                }
            });
        } else {
            callback(0);
        }

    });
}

/**
 * @param {function} callback 
 */
 exports.getCollection = function(callback) {
    global.db.all("SELECT * FROM 'COLLECTION'", (error, rows) => {
        if (error) {
            console.log(error);
            callback({});
        } else {
            callback(rows);
        }
    });
}