let ErrorType = {
    
    GENERAL_ERROR : {id: 1, httpCode: 700, message : "Communication with the database server failed. It either was not possible to connect to the server or the connection was terminated unexpectedly.", isShowStackTrace: true},
    USER_NAME_ALREADY_EXIST : {id: 2, httpCode: 601, message : "User name already exist", isShowStackTrace: false},
    UNAUTHORIZED : {id: 3, httpCode: 401, message : "Login failed, invalid user name or password", isShowStackTrace: false},
    INVALID_INPUT_FEILD : {id: 4, httpCode: 400, message : "", isShowStackTrace: false},
    MISSING_RESORT_DATA : {id: 5, httpCode: 500, message : "", isShowStackTrace: false},
}

module.exports = ErrorType;