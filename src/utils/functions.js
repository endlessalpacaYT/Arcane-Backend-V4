const XMLBuilder = require("xmlbuilder");
const uuid = require("uuid");
const bcrypt = require("bcrypt");
const fs = require("fs");
const crypto = require("crypto");
const path = require("path");

function timeout(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

function GetVersionInfo(req) {
    var memory = {
        season: 0,
        build: 0.0,
        CL: "",
        lobby: ""
    }

    if (req.headers["user-agent"])
    {
        var CL = "";

        try {
            var BuildID = req.headers["user-agent"].split("-")[3].split(",")[0]
            if (!Number.isNaN(Number(BuildID))) {
                CL = BuildID;
            }

            if (Number.isNaN(Number(BuildID))) {
                var BuildID = req.headers["user-agent"].split("-")[3].split(" ")[0]
                if (!Number.isNaN(Number(BuildID))) {
                    CL = BuildID;
                }
            }
        } catch (err) {
            try {
                var BuildID = req.headers["user-agent"].split("-")[1].split("+")[0]
                if (!Number.isNaN(Number(BuildID))) {
                    CL = BuildID;
                }
            } catch (err) {}
        }

        try {
            var Build = req.headers["user-agent"].split("Release-")[1].split("-")[0];

            if (Build.split(".").length == 3) {
                Value = Build.split(".");
                Build = Value[0] + "." + Value[1] + Value[2];
            }

            memory.season = Number(Build.split(".")[0]);
            memory.build = Number(Build);
            memory.CL = CL;
            memory.lobby = `LobbySeason${memory.season}`;

            if (Number.isNaN(memory.season)) {
                throw new Error();
            }
        } catch (err) {
            memory.season = 2;
            memory.build = 2.0;
            memory.CL = CL;
            memory.lobby = "LobbyWinterDecor";
        }
    }

    return memory;
}

function DecodeBase64(str) {
    return Buffer.from(str, 'base64').toString();
}

function MakeID() {
    return uuid.v4();
}

module.exports = {
    timeout,
    GetVersionInfo,
    DecodeBase64,
    MakeID
}