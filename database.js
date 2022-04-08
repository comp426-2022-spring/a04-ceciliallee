const db = require('better-sqlite3')

const datab = new Database('user.db')
const stmt = db.prepare(`
    SELECT name FROM sqlite_master WHERE type='table' and name='accesslogs';`);

let row = stmt.get();
if (row === undefined) {
    console.log("Log database appears to be empty. Creating log database.");
    const sqInit = `
        CREATE TABLE accesslog ( 
            id INTEGER PRIMARY KEY, 
            remoteaddr TEXT,
            remoteuser TEXT,
            time TEXT,
            method TEXT,
            url TEXT,
            protocol TEXT,
            httpversion TEXT,
            status TEXT, 
            referrer TEXT,
            useragent TEXT
        );
    `
    datab.execute(sqInit);
    console.log("Database created");
} else {
    console.log("Database already exists.");
}
module.exports = datab;


    
   