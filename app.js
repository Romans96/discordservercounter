require("dotenv").config();
const express = require("express"),
    session = require("express-session"),
    app = express(),
    path = require("path"),
    PORT = process.env.PORT || 3000;

app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "views")));

app.use(
    session({
        key: "discord",
        secret: "discordservers_counter",
        resave: false,
        saveUninitialized: false,
    })
);

app.get("/", (req, res) => {
    let userlogged = req.session.discord || null,
        text;
    if (userlogged) {
        req.session.destroy();
        userlogged = null;
    } else {
        text = "You have to Log In";
    }

    res.render(__dirname + "/views/index", {});
});

app.get("/servers", (req, res) => {
    let userlogged = req.session.discord || null,
        serverCounter,
        guildsList,
        images,
        text,
        logged;

    if (userlogged) {
        text =
            "Logged as " +
            req.session.discord.userInfo.username +
            ":" +
            req.session.discord.userInfo.discriminator;
        serverCounter = req.session.discord.guildsCounter;
        guildsList = req.session.discord.userGuilds,
        logged = true;
        // console.log(guildsList)
    } else {
        text = "You have to Log In";
        logged = false;
    }

    res.render(__dirname + "/views/servers", {
        loggedMsg: text,
        serverCounter: serverCounter,
        guildsList: guildsList,
        logged: logged
    });
});

// Routes
app.use("/api/discord", require("./api/discord"));

// 404
app.all("*", function (req, res) {
    res.status(404).send({ error: 404, message: "Page not found" });
});

app.listen(PORT, () => {
    console.log("Listen on port", PORT);
});

app.use((err, req, res, next) => {
    switch (err.message) {
        case "NoCodeProvided":
            return res.status(400).send({
                status: "ERROR",
                error: err.message,
            });
        default:
            return res.status(500).send({
                status: "ERROR",
                error: err.message,
            });
    }
});
