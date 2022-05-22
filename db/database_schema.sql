PRAGMA foreign_keys = ON; 
PRAGMA encoding="UTF-8";
BEGIN TRANSACTION;

DROP TABLE IF EXISTS "USER";
CREATE TABLE IF NOT EXISTS "USER" (
    "id" INTEGER NOT NULL ,
    "Email" TEXT NOT NULL,
    "Name" TEXT NOT NULL,
    "Phone" INTEGER,
    "PasswordHash" TEXT NOT NULL,
    "IsAdmin" BOOLEAN DEFAULT FALSE NOT NULL,

    PRIMARY KEY("id")
);

DROP TABLE IF EXISTS "TICKET";
CREATE TABLE IF NOT EXISTS "TICKET" (
    "id" INTEGER NOT NULL ,
    "ReservationDate" DATETIME NOT NULL,
    "Active" BOOLEAN DEFAULT TRUE NOT NULL,
    "PersonID" INTEGER NOT NULL,
    "EventID" INTEGER NOT NULL,

    CONSTRAINT "PersonFK" FOREIGN KEY("PersonID") REFERENCES "USER"("id")     ON DELETE CASCADE		ON UPDATE CASCADE,
    CONSTRAINT "EventFK" FOREIGN KEY("EventID") REFERENCES "EVENT"("id")	ON DELETE SET NULL		ON UPDATE CASCADE,
    PRIMARY KEY("id")
);

DROP TABLE IF EXISTS "EVENT";
CREATE TABLE IF NOT EXISTS "EVENT" (
    "id" INTEGER NOT NULL ,
    "Name"	TEXT NOT NULL,
    "Address"	TEXT NOT NULL,
    "StartDate" DATETIME NOT NULL,
    "EndDate" DATETIME NOT NULL,
    "MaxTickets" INTEGER DEFAULT TRUE NOT NULL,
    PRIMARY KEY("id")
);

DROP TABLE IF EXISTS "EXHIBITS";
CREATE TABLE IF NOT EXISTS "EXHIBITS" (
    "id" INTEGER NOT NULL ,
    "CollectionID" INTEGER,
    "EventID" INTEGER,

    CONSTRAINT "CollectionFK" FOREIGN KEY("CollectionID") REFERENCES "COLLECTION"("id")     ON DELETE SET NULL	ON UPDATE CASCADE,
    CONSTRAINT "EventFK" FOREIGN KEY("EventID") REFERENCES "EVENT"("id")	ON DELETE SET NULL  	ON UPDATE CASCADE,
    PRIMARY KEY("id")
);

DROP TABLE IF EXISTS "COLLECTION";
CREATE TABLE IF NOT EXISTS "COLLECTION" (
    "id" INTEGER NOT NULL ,
    "Name" TEXT NOT NULL,
    "Description" TEXT,
    "ArtistID" INTEGER NOT NULL,

    CONSTRAINT "ArtistFK" FOREIGN KEY("ArtistID") REFERENCES "ARTIST"("id")	ON DELETE CASCADE ON UPDATE CASCADE,
    PRIMARY KEY("id")
);

DROP TABLE IF EXISTS "IMAGE";
CREATE TABLE IF NOT EXISTS "IMAGE" (
    "id" INTEGER NOT NULL ,
    "Name" TEXT NOT NULL,
    "Src_path" TEXT NOT NULL,
    "Description" TEXT,
    "CollectionID" INTEGER NOT NULL,

    CONSTRAINT "CollectionFK" FOREIGN KEY("CollectionID") REFERENCES "COLLECTION"("id")	ON DELETE CASCADE ON UPDATE CASCADE,
    PRIMARY KEY("id")
);

DROP TABLE IF EXISTS "ARTIST";
CREATE TABLE IF NOT EXISTS "ARTIST" (
    "id" INTEGER NOT NULL ,
    "Name" TEXT NOT NULL,

    PRIMARY KEY("id")
);

INSERT INTO "USER" ("Email", "Name", "Phone", "PasswordHash", "IsAdmin") VALUES ('admin@admin.admin', 'Admin', 6942069420, '8c6976e5b5410415bde908bd4dee15dfb167a9c873fc4bb8a81f6f2ab448a918', TRUE);

COMMIT;
