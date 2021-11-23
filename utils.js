const fetch = require("node-fetch");
var utils = {
    // async/await error catcher
    catchAsync: (fn) => (req, res, next) => {
        const routePromise = fn(req, res, next);
        if (routePromise.catch) {
            routePromise.catch((err) => next(err));
        }
    },

    getBasicAuth: async (CLIENT_ID, CLIENT_SECRET, code, redirect) => {
        try {
            const res = await fetch(`https://discord.com/api/oauth2/token`, {
                method: "POST",
                body: new URLSearchParams({
                    client_id: CLIENT_ID,
                    client_secret: CLIENT_SECRET,
                    code: code,
                    grant_type: "authorization_code",
                    redirect_uri: redirect,
                }),
                headers: {
                    "Cache-Control": "no-cache",
                    "Content-Type": "application/x-www-form-urlencoded",
                },
            });

            if (res) return { error: null, res: res };
            else {
                console.log("Error on getBasicAuth function!", err);
                return { error: "Error on getBasicAuth function!" };
            }
        } catch (err) {
            console.log("Error on getBasicAuth function!", err);
            return { error: "Error on getBasicAuth function!" };
        }
    },
    apiAuth: async (url, token_type, access_token) => {
        try {
            const res = await fetch(url, {
                headers: {
                    'Cache-Control': 'no-cache',
                    'Content-Type': 'application/x-www-form-urlencoded',
                    authorization: `${token_type} ${access_token}`,
                },
            });

            if (res) return { error: null, res: res };
            else {
                console.log("Error on apiAuth function!", err);
                return { error: "Error on apiAuth function!" };
            }
        } catch (err) {
            console.log("Error on apiAuth function!", err);
            return { error: "Error on apiAuth function!" };
        }
    },

    getGuildBanner: async (guildId, guildIconhash) => {
        try {
            // console.log(guildId, guildIconhash);
            const guildBanner = await fetch(
                "https://cdn.discordapp.com/icons/" +
                    guildId +
                    "/" +
                    guildIconhash +
                    ".png"
            );
            // console.log(guildBanner_nojson)
            if (guildBanner && guildBanner.status == 200) {
                return { error: null, image: guildBanner.url };
            } else return { error: "Error on getGuildBanner" };
        } catch (err) {
            console.log("Error on getGuildBanner", err);
            return { error: "Error on getGuildBanner" };
        }
    },
};

module.exports = utils;
