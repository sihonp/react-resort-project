const usersDao = require("../dao/users-dao");
const cacheModule = require("./cache-module");
const jwt = require('jsonwebtoken');
const config = require('../config.json');
const crypto = require("crypto");
const ServerError = require("../errors/server-error");
const ErrorType = require("../errors/error-type");

const RIGHT_SALT = "ksdjfhbAWEDCAS29!@$addlkmn";
const LEFT_SALT = "32577098ASFKJkjsdhfk#$dc";

let validateRegisterInputFeilds = (user) => {
    if (user.firstName.trim() === "" || user.lastName.trim() === "" || user.userName.trim() === "" || user.password.trim() === "" || user.email.trim() === "") {
        ErrorType.INVALID_INPUT_FEILD.message = "All fields are required";
        throw new ServerError(ErrorType.INVALID_INPUT_FEILD);
    }

    if (user.firstName.length > 25 || user.lastName.length > 25 || user.userName.length > 25 || user.password.length > 25) {
        ErrorType.INVALID_INPUT_FEILD.message = "Fields can include maximum of 25 characters";
        throw new ServerError(ErrorType.INVALID_INPUT_FEILD);
    }

    if (user.password.length < 5) {
        ErrorType.INVALID_INPUT_FEILD.message = "Password must include minimum of 5 characters";
        throw new ServerError(ErrorType.INVALID_INPUT_FEILD);
    }

    if (!user.email.match(/[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,25}/g)) {
        ErrorType.INVALID_INPUT_FEILD.message = "Email should be in this form: exemple@mail.com";
        throw new ServerError(ErrorType.INVALID_INPUT_FEILD);
    }
}

// do registration 
async function register(user) {
    validateRegisterInputFeilds(user);
    if (await usersDao.isUserExistByName(user.userName)) {
        throw new ServerError(ErrorType.USER_NAME_ALREADY_EXIST);
    }

    user.password = crypto.createHash("md5").update(LEFT_SALT + user.password + RIGHT_SALT).digest("hex");
    console.log("Hashed password : " + user.password);
    let userRegisterData = await usersDao.register(user);
    return userRegisterData

}

let validateLoginInputFeilds = (user) => {
    if (user.userName.trim() === "" || user.password.trim() === "") {
        ErrorType.INVALID_INPUT_FEILD.message = "All fields are required";
        throw new ServerError(ErrorType.INVALID_INPUT_FEILD);
    }
    if (user.password.length < 5) {
        ErrorType.INVALID_INPUT_FEILD.message = "Password must include minimum of 5 characters";
        throw new ServerError(ErrorType.INVALID_INPUT_FEILD);
    }
}

// do login
async function login(user) {
    validateLoginInputFeilds(user);
    user.password = crypto.createHash("md5").update(LEFT_SALT + user.password + RIGHT_SALT).digest("hex");
    console.log("Hashed password : " + user.password);

    let userLoginData = await usersDao.login(user);
    let saltedUserName = LEFT_SALT + user.userName + RIGHT_SALT;
    const jwtToken = jwt.sign({ sub: saltedUserName }, config.secret);

    console.log("Token before adding to cache : " + jwtToken);
    console.log("User Data before adding to cache : " + JSON.stringify(userLoginData));
    cacheModule.set(jwtToken, userLoginData);

    let successfullLoginResponse = { token: jwtToken, userType: userLoginData.userType, userName: userLoginData.userName };
    return successfullLoginResponse;
}


//get resort by admin
async function getAdminResorts(request) {
    let userInfoArray = extractUserDataFromCache(request)
    if (userInfoArray[0] == undefined) {
        throw new ServerError(ErrorType.GENERAL_ERROR);
    } else {
        let jwtToken = userInfoArray[1]
        try {
            let resortsData = await usersDao.getAdminResorts(cacheModule.get(jwtToken));
            return resortsData;
        }
        catch (error) {
        }
    }
}

//get resort chart by admin
async function getChart(jwtToken) {
    try {
        let resortsData = await usersDao.getChart(cacheModule.get(jwtToken));
        return resortsData;
    }
    catch (error) {
    }
}

//get resort by client
async function getClientResorts(request) {
    let userInfoArray = extractUserDataFromCache(request)
    if (userInfoArray[0] == undefined) {
        throw new ServerError(ErrorType.GENERAL_ERROR);
    } else {
        let jwtToken = userInfoArray[1]
        try {
            let resortsData = await usersDao.getClientResorts(cacheModule.get(jwtToken));
            for (let index = 0; index < resortsData.length; index++) {
                if (resortsData[index].userId == null) {
                    resortsData[index].followBtn = false;
                }
                else {
                    resortsData[index].followBtn = true;
                }
            }
            return resortsData;
        }
        catch (error) {
        }
    }
}

// follow resort by client
async function followResort(resort, jwtToken) {
    try {
        let userId = cacheModule.get(jwtToken).userId
        let followData = await usersDao.followResort(userId, resort);
        return followData;
    }
    catch (error) {
    }
}

// unfollow resort by client
async function unfollowResort(resort, jwtToken) {
    try {
        let userId = cacheModule.get(jwtToken).userId
        let unfollowData = await usersDao.unfollowResort(userId, resort);
        return unfollowData;
    }
    catch (error) {
    }
}

// followCounter resort by client
async function followCounter(resort, jwtToken) {
    try {
        let userId = cacheModule.get(jwtToken).userId
        let followCounterData = await usersDao.followCounter(userId, resort);
        return followCounterData;
    }
    catch (error) {
    }
}

// delete resort by admin
async function deleteResort(resortId,imgFileNameToRemove) {
    let response = await usersDao.deleteResort(resortId,imgFileNameToRemove);
    return response;
}

let validatResortModalInputFeilds = (resort) => {
    if (resort.resortName.trim() === "" || resort.resortPrice === +"" || resort.resortInfo.trim() === "") {
        ErrorType.MISSING_RESORT_DATA.message = "All fields are required";
        throw new ServerError(ErrorType.MISSING_RESORT_DATA);
    }
    if (Date.parse(resort.resortStartDate) >= Date.parse(resort.resortEndDate)) {
        ErrorType.MISSING_RESORT_DATA.message = "Wrong date please check your input and try again";
        throw new ServerError(ErrorType.MISSING_RESORT_DATA);
    }
    if (resort.resortImg === null) {
        ErrorType.MISSING_RESORT_DATA.message = "Please add an image";
        throw new ServerError(ErrorType.MISSING_RESORT_DATA);
    }
}

// add resort by admin
async function addResort(resort,file) {
    validatResortModalInputFeilds(resort);
    let response = await usersDao.addResort(resort,file);
    return response
}

// update resort by admin
async function updateResort(resort,file) {
    validatResortModalInputFeilds(resort);
    let response = await usersDao.updateResort(resort,file);
    return response
}

function extractUserDataFromCache(request) {
    let authorizationString = request.headers["authorization"]
    let token = authorizationString.substring("Bearer ".length)
    let userData = cacheModule.get(token)
    return [userData, token]
}

module.exports = {
    login,
    getChart,
    register,
    addResort,
    deleteResort,
    followResort,
    updateResort,
    followCounter,
    unfollowResort,
    getAdminResorts,
    getClientResorts,
};