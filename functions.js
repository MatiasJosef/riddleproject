const fs = require('fs');

module.exports = (bot) => {

    fs.readdir('./events/', (err, files) => {
        if (err) console.log(err);
        let jsFiles = files.filter(f => f.split(".").pop() === "js");
        console.log(`[✓] Количество загруженных модулей: ${jsFiles.length}`);
        jsFiles.forEach((f, i) => {
            let props = require(`./events/${f}`);
            console.log(` [${i + 1}] Модуль ${f} загружен`);
        })
    });

};
