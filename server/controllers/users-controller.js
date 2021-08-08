const express = require("express");
const usersLogic = require("../logic/users-logic");
const router = express.Router();
const fs = require('fs');

if (!fs.existsSync("./uploads")) { // Must create "/uploads" folder if not exist.
    fs.mkdirSync("./uploads");
}

let jwtToken

// register to be a user
router.post("/register", async (request, response, next) => {
    let user = request.body;
    try { 
        let successfullRegisterData = await usersLogic.register(user);
        response.json(successfullRegisterData);
    }
    catch (error) {
        return next(error);
    }
});

//login
router.post("/login", async (request, response, next) => {
    let user = request.body;
    try {
        let successfullLoginData = await usersLogic.login(user);
        response.json(successfullLoginData);
        jwtToken = successfullLoginData.token
    }
    catch (error) {
        return next(error);
    }
});

// get resort by admin
router.get("/admin/resorts", async (request, response, next) => {
    try {
        let successfullResortsData = await usersLogic.getAdminResorts(request);
        response.json(successfullResortsData);
    }
    catch (error) {
        return next(error);
    }
});

// get resort chart on deshboard
router.post("/dashboard/chart", async (request, response, next) => {
    try {
        let successfullChartData = await usersLogic.getChart(jwtToken);
        response.json(successfullChartData);
    }
    catch (error) {
        return next(error);
    }
});

//get resort by client
router.get("/client/resorts", async (request, response, next) => {
    try {
        let successfullResortsData = await usersLogic.getClientResorts(request);
        response.json(successfullResortsData);
    }
    catch (error) {
        return next(error)
    }
});

// follow resort by client
router.post("/client/follow", async (request, response, next) => {
    let follow = request.body
    let resort = follow.resortId
    try {
        let followData = await usersLogic.followResort(resort, jwtToken);
        response.json(followData);
    }
    catch (error) {
        return next(error)
    }
})

// unfollow resort by client
router.delete("/client/unfollow", async (request, response, next) => {
    let unfollow = request.body
    let resort = unfollow.resortId
    try {
        let unfollowData = await usersLogic.unfollowResort(resort, jwtToken);
        response.json(unfollowData);
    }
    catch (error) {
        return next(error)
    }
})

// followCounter resort by client
router.post("/client/followCounter", async (request, response, next) => {
    let followCounter = request.body
    let resort = followCounter.resortId
    try {
        let followCounterData = await usersLogic.followCounter(resort, jwtToken);
        response.json(followCounterData);
    }
    catch (error) {
        return next(error)
    }
})

//add resort by admin
router.post("/admin/addresort", async (request, response, next) => {
    try {
    let resort = request.body;
    console.log(resort)
    const file = request.files.image;
    console.log(file)
    let successfullAddResort= await usersLogic.addResort(resort,file);
        response.json(successfullAddResort);
    }
    catch (error) {
        return next(error);
    }
});

// delete resort by Admin
router.delete("/admin/delete", async (request, response, next) => {
  
    let resort = request.body;
    try {
        let imgFileNameToRemove = request.body.imgFileToRemove;
        let resortId = resort.resortId
        let responseDelete = await usersLogic.deleteResort(resortId,imgFileNameToRemove);
        response.json(responseDelete);
    }
    catch (error) {
        return next(error)
    }
})

// edit resort by Admin
router.put("/admin/updateresort", async (request, response, next) => {
    let resort = request.body;
    let file;
    if (resort.imageFile != 'undefined') {
        file = request.files.imageFile;
    }
    try {
        let successfullUpdateResortData = await usersLogic.updateResort(resort,file);
        response.json(successfullUpdateResortData);
    }
    catch (error) {
        return next(error)
    }
})

module.exports = router;