const mysql = require("mysql2");


const dbConnection = mysql.createConnection({
    host: "localhost",
    user: "root", 
    password: "1212", 
    database: "sihon-resorts"
});

// const dbConnection = mysql.createConnection({
//     host: "34.65.225.105",
//     user: "root", 
//     password: "1212", 
//     database: "sihon-resorts"
// });

dbConnection.connect(error => {
    if (error) {
        console.log("Failed to create connection + " + error);
        return;
    }
    console.log("We're connected to MySQL");
});


function execute(sql) {
    return new Promise((resolve, reject) => {
        dbConnection.query(sql, (error, result) => {
            if (error) {
                reject(error);
                return;
            }
            resolve(result);
        });
    });
}

function executeWithParameters(sql, parameters) {
    return new Promise((resolve, reject) => {
        dbConnection.query(sql, parameters, (error, result) => {
            if (error) {
                console.log("Failed interacting with DB, calling reject");
                reject(error);
                return;
            }
            resolve(result);
        });
    });
}

module.exports = {
    execute,
    executeWithParameters
};