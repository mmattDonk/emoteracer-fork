const fs = require("fs");

let str = `...`;

const emoteArr = str.split("\n");
emoteArr.shift();

let final = [];

for (let emote of emoteArr) {
    let name = emote.split(": ")[0];
    let url = emote.split(": ")[1];

    if (url.match(/betterttv.com\/emotes\/[A-z0-9]+/)) {
        url = url.replace("betterttv.com/emotes/", "");
        final.push({
            id: url,
            name: name,
            provider: "bttv",
        });
    } else if (url.match(/frankerfacez.com\/emoticon\/[A-z0-9]+/)) {
        url = url.replace("frankerfacez.com/emoticon/", "");
        url = url.split("-")[0];
        final.push({
            id: url,
            name: name,
            provider: "ffz",
        });
    } else if (url.match(/7tv.app\/emotes\/[A-z0-9]+/)) {
        url = url.replace("7tv.app/emotes/", "");
        final.push({
            id: url,
            name: name,
            provider: "7tv",
        });
    }
}

fs.writeFileSync("./emotes.json", JSON.stringify(final));
