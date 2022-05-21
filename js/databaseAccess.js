const { createHash } = require("crypto");
const res = require("express/lib/response");
const sqlite3 = require("sqlite3");

const log4js = require("log4js");
const logger = log4js.getLogger("[DatabaseAccess]");
logger.level = global.LOGGERLEVEL; 

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
            logger.error(error);
            callback({});
        }
        if (rows.length > 1) {
            callback({});
            logger.warn("SELECT * FROM 'USER' WHERE email == ?", [userEmail]);
        } else {
            callback(rows[0]);
        }
    });
}

/**
 * 
 * @param {function} callback {} => if user not found, userdata in json if user is found
 */
exports.getUsers = function (callback) {
    global.db.all("SELECT * FROM 'USER'", (error, rows) => {
        if (error) {
            logger.error(error);
            callback({});
        } else {
            callback(rows);
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
                    logger.error(error);
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
 * Delete user from Database
 * @param {userid} userId 
 * @param {Function} callback callback function 0 => error, 200 => OK
 */
exports.deleteUser = function (userid, callback) {
    if (userid != 1) {
        global.db.all("DELETE FROM USER where id=?", [userid], (error, rows) => {
            if (error) {
                logger.error(error);
                callback(0);
            } else {
                callback(200);
            }
        });
    } else {
        callback(0);
    }
}


/**
 * Add Artist entry to db
 * @param {string} artistName 
 * @param {function} callback callback function 0 => error, 200 => OK
 */
exports.addArtist = function (artistName, callback) {
    global.db.all("INSERT INTO ARTIST ('name') VALUES (?)", [artistName.trim()], (error, rows) => {
        if (error) {
            logger.error(error);
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
            logger.error(error);
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
            logger.error(error);
            callback({});
        } else {
            callback(rows[0]);
        }
    });
}

/**
 * Add Collection entry to db
 * @param {object} collectionData 
 * @param {function} callback callback function 0 => error, 200 => OK
 */
exports.addCollection = function (collectionData, callback) {
    this.getArtist(collectionData.artist.trim(), (artistData) => {
        if (artistData != undefined) {
            global.db.all("INSERT INTO COLLECTION ('Name', 'Description', 'ArtistID') VALUES (?, ?, ?)", [collectionData.name.trim(), collectionData.description.trim(), artistData.id], (error, rows) => {
                if (error) {
                    logger.error(error);
                    logger.error("INSERT INTO COLLECTION ('Name', 'Description', 'ArtistID') VALUES (?, ?, ?)", [collectionData.name.trim(), collectionData.description.trim(), artistData.id])
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
exports.getCollections = function (callback) {
    global.db.all("SELECT * FROM 'COLLECTION'", (error, rows) => {
        if (error) {
            logger.error(error);
            callback({});
        } else {
            callback(rows);
        }
    });
}

/**
 * @param {string} collectionName
 * @param {function} callback 
 */
exports.getCollection = function (collectionName, callback) {
    global.db.all("SELECT * FROM 'COLLECTION' where name=?", [collectionName], (error, rows) => {
        if (error) {
            logger.error(error);
            callback({});
        } else {
            callback(rows[0]);
        }
    });
}


/**
 * @param {string} imageName
 * @param {string} imagePath
 * @param {function} callback 
 */
exports.getImage = function (imageName, imagePath, callback) {
    logger.info(`Get Image| name: ${imageName}, path: ${imagePath}`);
    global.db.all("SELECT * FROM 'IMAGE' where Name=?", [imageName], (error, rows) => {
        if (error) {
            logger.error(error);
            callback({});
        } else {
            callback(rows[0]);
        }
    });
}


/**
 * Add Image entry to db
 * @param {object} imageData 
 * @param {function} callback callback function 0 => error, 200 => OK, 1 => image exist
 */
exports.addImage = function (imageData, callback) {
    this.getImage(imageData.name, imageData.srcPath, (status) => {
        if (status === undefined) {
            this.getCollection(imageData.collection.trim(), (collectionData) => {
                if (collectionData != undefined) {
                    global.db.all("INSERT INTO IMAGE ('Name', 'Src_path', 'Description', 'CollectionID') VALUES (?, ?, ?, ?)", [imageData.name.trim(), imageData.srcPath.trim(), imageData.description.trim(), collectionData.id], (error, rows) => {
                        if (error) {
                            logger.error(error);
                            callback(0);
                        } else {
                            callback(200);
                        }
                    });
                } else {
                    callback(0);
                }
            });
        } else {
            callback(1);
        }
    });
}

/**
 * Add Event entry to db
 * @param {object} eventData 
 * @param {function} callback callback function 0 => error, 200 => OK, 1 => image exist
 */
exports.addEvent = function (eventData, callback) {
    global.db.all("INSERT INTO EVENT ('Address', 'StartDate', 'EndDate', 'MaxTickets') VALUES (?, ?, ?, ?)", [eventData.address, eventData.startDate, eventData.endDate, eventData.maxTickets], (error, rows) => {
        if (error) {
            logger.error(error);
            callback(0);
        } else {
            // Get last Event id
            global.db.all("Select * from EVENT", (error, rows) => {
                if (error) {
                    logger.error(error);
                    callback(0);
                } else {
                    // Add entries to EXHIBITS
                    if (typeof eventData.collections === "string") {
                        this.getCollection(eventData.collections, (row) => {
                            this.addExhibition({ collectionId: row.id, eventId: rows[rows.length - 1].id }, (status) => {
                                if (status === 200) {
                                    callback(200);
                                } else {
                                    callback(0);
                                }
                            });
                        });
                    } else {
                        eventData.collections.forEach(collection => {
                            this.getCollection(collection, (row) => {
                                this.addExhibition({ collectionId: row.id, eventId: rows[rows.length - 1].id }, (status) => {
                                    return;
                                });
                            });

                        });
                    }
                }
            });
            callback(200);
        }
    });
}

/**
 * 
 * @param {function} callback {} => if evemt not found, eventRows in json if user is found
 */
exports.getEvents = function (callback) {
    global.db.all("SELECT * FROM 'EVENT'", (error, rows) => {
        if (error) {
            logger.error(error);
            callback({});
        } else {
            callback(rows);
        }
    });
}

/**
 * @param {number} eventId id of event that the ticket is for
 * @param {function} callback 0 => if user not found, userdata in json if user is found
 */
exports.getTicketActiveReservations = function (eventId, callback) {
    global.db.all("SELECT count(*) as count FROM 'TICKET' where EventId=? and \"Active\"=\"1\"", [eventId], (error, rows) => {
        if (error) {
            logger.error(error);
            callback(0);
        } else {
            callback(rows[0].count);
        }
    });
}


/**
 * Add Exhibits entry to db
 * @param {object} exhibitsData 
 * @param {function} callback callback function 0 => error, 200 => OK, 1 => image exist
 */
exports.addExhibition = function (exhibitsData, callback) {
    global.db.all("INSERT INTO EXHIBITS ('EventID', 'CollectionID') VALUES (?, ?)", [exhibitsData.eventId, exhibitsData.collectionId], (error, rows) => {
        if (error) {
            logger.error(error);
            callback(0);
        } else {
            callback(200);
        }
    });
}