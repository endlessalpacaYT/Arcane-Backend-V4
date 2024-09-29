const fs = require("fs");
const path = require("path");
const Profile = require("../Models/profile/profile.js"); 

function createProfiles(accountId) {
    let profiles = {};

    const profilesPath = path.join(__dirname, "../responses/DefaultProfiles");
    fs.readdirSync(profilesPath).forEach(fileName => {
        const profile = require(path.join(profilesPath, fileName));

        profile.accountId = accountId;
        profile.created = new Date().toISOString();
        profile.updated = new Date().toISOString();

        profiles[profile.profileId] = profile;
    });

    return profiles;
}

async function validateProfile(profileId, profiles) {
    if (!profileId || !profiles.profiles[profileId]) {
        return false;
    }
    return true;
}

module.exports = {
    createProfiles,
    validateProfile
};