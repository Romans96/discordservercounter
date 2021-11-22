require("dotenv").config();
const express = require("express");
const router = express.Router();
const fetch = require("node-fetch");
const btoa = require("btoa");
const { catchAsync } = require("../utils");

const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const PORT = process.env.PORT;
const redirect = "http://localhost:" + PORT + "/api/discord/callback";
router.get("/login", (req, res) => {
    res.redirect(
        `https://discord.com/api/oauth2/authorize?client_id=${CLIENT_ID}&scope=identify guilds&response_type=code&redirect_uri=${redirect}`
        //https://discord.com/api/oauth2/authorize?client_id=911230871393144832&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Fapi%2Fdiscord%2Fcallback&response_type=code&scope=identify
    );
});

router.get(
    "/callback",
    catchAsync(async (req, res) => {
        if (!req.query.code) throw new Error("NoCodeProvided");
        // console.log(req.query.code)
        const code = req.query.code;
        // console.log("Code:", code, CLIENT_ID, CLIENT_SECRET);
        const response = await fetch(`https://discord.com/api/oauth2/token`, {
            method: "POST",
            body: new URLSearchParams({
                client_id: CLIENT_ID,
                client_secret: CLIENT_SECRET,
                code: code,
                grant_type: "authorization_code",
                redirect_uri: redirect,
            }),
            headers: {
                'Cache-Control': 'no-cache',
                'Content-Type': 'application/x-www-form-urlencoded',
            },
        });
        const rsponsejson = await response.json();
        // console.log(rsponsejson)
        
        const user_infos_nojson = await fetch(
            "https://discord.com/api/users/@me",
            {
                headers: {
                    'Cache-Control': 'no-cache',
                    'Content-Type': 'application/x-www-form-urlencoded',
                    authorization: `${rsponsejson.token_type} ${rsponsejson.access_token}`,
                },
            }
        ),
        user_infos = await user_infos_nojson.json();
        req.session.discord = {};
        req.session.discord.userInfo = user_infos;

        const user_guilds_nojson = await fetch(
            "https://discord.com/api/users/@me/guilds",
            {
                headers: {
                    'Cache-Control': 'no-cache',
                    'Content-Type': 'application/x-www-form-urlencoded',
                    authorization: `${rsponsejson.token_type} ${rsponsejson.access_token}`,
                },
            }
        );
        const user_guilds = await user_guilds_nojson.json();
        req.session.discord.userGuilds = user_guilds;
        req.session.discord.guildsCounter = Object.keys(user_guilds).length;

        res.redirect(`/servers`);
    })
);

module.exports = router;
