const connection = require("./connection-wrapper");
const ServerError = require("./../errors/server-error");
const ErrorType = require("./../errors/error-type");
const uuid = require("uuid");
const fs = require("fs");

// check if user exist in database
async function isUserExistByName(name) {
    let usersRegisterResult;
    try {
        let sql = "SELECT * FROM users WHERE userName =?";
        let parameters = [name];
        usersRegisterResult = await connection.executeWithParameters(sql, parameters);
        if (usersRegisterResult == null || usersRegisterResult.length == 0) {
            return false;
        }
        return true;
    }
    catch (error) {
        throw new ServerError(ErrorType.USER_NAME_ALREADY_EXIST, sql, error);
    }
}

// register to be a user
async function register(user) {
    let userType = "Client"
    let sql = "INSERT INTO users (firstName, lastName, userName, password, email, userType) values(?, ?, ?, ?, ?, ?)";
    let parameters = [user.firstName, user.lastName, user.userName, user.password, user.email, userType];
    try {
        await connection.executeWithParameters(sql, parameters);
        let sql1 = "SELECT * FROM users WHERE userName =?";
        let parameter = [user.userName];
        usersRegisterResult = await connection.executeWithParameters(sql1, parameter);
        return usersRegisterResult[0];
    }
    catch (error) {
        throw new ServerError(ErrorType.GENERAL_ERROR, sql, error);
    }
}

// do login
async function login(user) {
    let sql = "SELECT * FROM users WHERE userName =? AND password =?";
    let parameters = [user.userName, user.password];
    let usersLoginResult;
    try {
        usersLoginResult = await connection.executeWithParameters(sql, parameters);
    }
    catch (error) {
        throw new ServerError(ErrorType.GENERAL_ERROR, sql, error);
    }
    if (usersLoginResult == null || usersLoginResult.length == 0) {
        throw new ServerError(ErrorType.UNAUTHORIZED);
    }
    return usersLoginResult[0];

}

// get all resort by admin
async function getAdminResorts(admin) {

    let id = admin.userId

    let sql = `SELECT  r.resortId as resortId, r.resortName, r.resortInfo, r.resortImg, DATE_FORMAT(r.resortStartDate, '%Y-%m-%d') AS resortStartDate, DATE_FORMAT(r.resortEndDate,'%Y-%m-%d') AS resortEndDate, r.resortPrice,  follow.userId AS userId, 
    (SELECT COUNT(*) FROM follow 
    WHERE resortId = r.resortId) AS count
    FROM resorts r 
    LEFT JOIN follow  ON r.resortId = follow.resortId && follow.userId = ?
    ORDER BY  follow.userId DESC`;

    let parameters = [id];
    console.log(parameters)

    try {
        const adminResortsResult = await connection.executeWithParameters(sql, parameters);
        return adminResortsResult
    }
    catch (error) {
        console.log("user dao - getAllResort " + error);
    }
}

// get all resort by admin
async function getChart(admin) {

    let id = admin.userId

    let sql = "SELECT resorts.*, follow.userId, (SELECT COUNT(*) FROM follow WHERE resortId = resorts.resortId) AS count FROM resorts LEFT JOIN follow ON resorts.resortId = follow.resortId && follow.userId=? ORDER BY follow.resortId DESC";

    let parameters = [id];
    console.log(parameters)

    try {
        const adminResortsResult = await connection.executeWithParameters(sql, parameters);
        return adminResortsResult
    }
    catch (error) {
        console.log("user dao - getAllResort " + error);
    }
}

// get client resort
async function getClientResorts(client) {

    let id = client.userId

    let sql = `SELECT  r.resortId as resortId, r.resortName, r.resortInfo, r.resortImg, DATE_FORMAT(r.resortStartDate, '%Y-%m-%d') AS resortStartDate, DATE_FORMAT(r.resortEndDate,'%Y-%m-%d') AS resortEndDate, r.resortPrice,  follow.userId AS userId, 
    (SELECT COUNT(*) FROM follow 
    WHERE resortId = r.resortId) AS count
    FROM resorts r 
    LEFT JOIN follow  ON r.resortId = follow.resortId && follow.userId = ?
    ORDER BY  follow.userId DESC`;

    let parameters = [id];
    console.log(parameters)
    try {
        const usersfollowResortsResult = await connection.executeWithParameters(sql, parameters);
        return usersfollowResortsResult
    }
    catch (error) {
        throw new ServerError(ErrorType.GENERAL_ERROR, sql, error);
    }
}

// follow resort by client
async function followResort(userId, resort) {
    let sql = "INSERT INTO follow (userId, resortId) values(?, ?)";
    console.log(sql);
    let parameters = [userId, resort];
    console.log(parameters)
    try {
        const followResortsData = await connection.executeWithParameters(sql, parameters);
        return followResortsData
    }
    catch (error) {
        throw new ServerError(ErrorType.GENERAL_ERROR, sql, error);
    }
}

// unfollow resort by client
async function unfollowResort(userId, resort) {
    let sql = "DELETE from follow where userId =? AND resortId =?";
    let parameters = [userId, resort];
    console.log(parameters)
    try {
        const unfollowResortsData = await connection.executeWithParameters(sql, parameters);
        return unfollowResortsData
    }
    catch (error) {
        throw new ServerError(ErrorType.GENERAL_ERROR, sql, error);
    }
}

// followCounter resort by client
async function followCounter(resort) {
    let index = 0
    index++
    let sql = "INSERT INTO resorts (followCounter) valuse(?)";
    let parameters = [resort, index];
    try {
        const followCounterData = await connection.executeWithParameters(sql, parameters);
        return followCounterData
    }
    catch (error) {
        throw new ServerError(ErrorType.GENERAL_ERROR, sql, error);
    }
}

// delete resort by admin
async function deleteResort(resortId,imgFileNameToRemove) {
    var filePath = "./uploads/" + imgFileNameToRemove;
    fs.unlinkSync(filePath);
    let sql = "DELETE from resorts where resortId=?";
    let parameters = [resortId];
    try {
        let response = await connection.executeWithParameters(sql, parameters);
        return response
    }
    catch (error) {
        throw new ServerError(ErrorType.GENERAL_ERROR, sql, error);
    }
}

// update resort by admin
async function updateResort(resort,file) {
    let imageNameValue
    if (file!=undefined){
        const extension = file.name.substr(file.name.lastIndexOf("."));
        let newUuidFileName = uuid.v4();
        let fileNameWithExtension = newUuidFileName + extension
        file.mv("./uploads/" + fileNameWithExtension); 
        imageNameValue = fileNameWithExtension
    }
    else{
        imageNameValue = resort.sameImageName;
    }
    let parameters = [imageNameValue, resort.resortName, resort.resortPrice, resort.resortInfo, resort.resortStartDate, resort.resortEndDate, parseInt(resort.resortId)];
    let sql = "UPDATE resorts SET resortImg =?, resortName =?, resortPrice =?, resortInfo =? ,resortStartDate =? ,resortEndDate =? where resortId =?";
    try {
        let response = await connection.executeWithParameters(sql, parameters);
        return imageNameValue
    }
    catch (error) {
        throw new ServerError(ErrorType.MISSING_RESORT_DATA, sql, error);
    }
}

// add resort by admin
async function addResort(resort,file) {
    try {
        const extension = file.name.substr(file.name.lastIndexOf("."));
        let newUuidFileName = uuid.v4();
        let fileNameWithExtension = newUuidFileName + extension
        file.mv("./uploads/" + fileNameWithExtension);
        let parameters = [fileNameWithExtension, resort.resortName, resort.resortPrice, resort.resortInfo, resort.resortStartDate, resort.resortEndDate];
        let sql = "INSERT INTO resorts (resortImg, resortName, resortPrice, resortInfo, resortStartDate, resortEndDate) values(?, ?, ?, ?, ?, ?)";
        await connection.executeWithParameters(sql, parameters);
        let sql2 = " SELECT MAX(resortId) as max FROM resorts"
        let response = await connection.executeWithParameters(sql2, parameters);
        let responseToClient = {
            resortLastId: response,
            imgNameInServer: fileNameWithExtension
        }
        return responseToClient
    }
    catch (error) {
        throw new ServerError(ErrorType.MISSING_RESORT_DATA, sql, error);
    }
}

module.exports = {
    login,
    getChart,
    register,
    addResort,
    followResort,
    deleteResort,
    updateResort,
    followCounter,
    unfollowResort,
    getAdminResorts,
    isUserExistByName,
    getClientResorts,
};