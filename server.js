const request = require('request');
const cheerio = require('cheerio');
const fs = require('fs');
const readline = require('readline');
const axios = require('axios');
const xpath = require('xpath');
const dom = require('xmldom').DOMParser;


const TelegramBot = require('node-telegram-bot-api');
//E-das Token
const token = '1294134868:AAG9xJj92qzZMh_RSuU9aotkSxtSw7HTDns'
//Toams_prova_bot   1748123452:AAE2E9gCJWoeXyrUweYF6XM3m7jTJiOUVVg
// 676793933:AAFSqroVLFsRsYU1nk12-gmVWrYprDN2q-I     test2tomas
// 1294134868:AAG9xJj92qzZMh_RSuU9aotkSxtSw7HTDns     edas_dogane
const bot = new TelegramBot(token, { polling: true });
exports.bot = bot;


var cron = require('node-cron');


const EDAS = "\ud83d\udde3 E-Das_HTML_format"


inline_keyboard = [];

// Here starts everything
bot.onText(/\/start/, (msg) => {
    var telegramUser = msg.from
    //  $.sendMessage("Utente (" + telegramUser.firstName + " " + telegramUser.lastName + ")  " + body.message)

    // Aggiorno il file 
    const usersFile = fs.readFileSync('users.txt').toString()
    if (!usersFile.includes(msg.chat.id)) {
        fs.writeFile('users.txt', usersFile + msg.chat.id + "\n", 'utf-8', function (err) {
            if (err) throw err;
            console.log('UsersAsinc complete');
        });
    }

    bot.sendMessage(msg.chat.id, "Welcome " + msg.from.first_name + ", Notifiche On!", {
        "reply_markup": {
            "keyboard": [
                [EDAS]

            ]
        }
    });


});


// Catch every messagge text 
bot.on('message', (msg) => {

    if (msg.text.toString() === EDAS) {
       // const fileContents = fs.readFileSync('content.txt').toString()
        bot.sendMessage(msg.chat.id, "https://www.adm.gov.it/portale/dogane/operatore/accise/telematizzazione-delle-accise/settore-prodotti-energetici/tabelle-di-riferimento")
    } else {
        if (msg.text.toString() != "/start") {

            //   bot.sendPhoto(145645559, bot.getUserProfilePhotos(929305432, 0, 0), { caption: "It's your photo!" });
            //    bot.getUserProfilePhotos(969131155, 0, 1).then(function(data) {
            //      bot.sendPhoto(145645559, data.photos[0][0].file_id, { caption: "It's your photo!" });
            // });

            //  curl -X POST "https://api.telegram.org/bot1294134868:AAG9xJj92qzZMh_RSuU9aotkSxtSw7HTDns/sendMessage" -d "chat_id=-145645559&text=my sample text"

            //console.log(msg)
            bot.sendMessage(msg.chat.id, "Commando non riconosciuto!")
        }
    }

})




/**
 * Crontab Job Scheduler
 * Ogni 20 minuti, dalle 8alle20, ogni settima, ogni mese, da lunedi a venerdi
 */
cron.schedule('*/20 8-20 * * 1-5', () => {

    console.log('running a task every 20 minutes');

    request('https://www.adm.gov.it/portale/dogane/operatore/servizi-online/servizio-telematico-doganale-e.d.i./web-service/webservice-ambienteprova#sez-daselettronico', (error, response, html) => {
        if (!error && response.statusCode == 200) {

            (async () => {
                const response = await axios.get('https://www.adm.gov.it/portale/dogane/operatore/servizi-online/servizio-telematico-doganale-e.d.i./web-service/webservice-ambienteprova#sez-daselettronico');
                const $ = cheerio.load(response.data);

                // Use an XPath selector to get the ul element with the class "default"
                const ulElement = xpath.select('//*[@id="portlet_com_liferay_asset_publisher_web_portlet_AssetPublisherPortlet_INSTANCE_HtVDzRCPDnG4"]/div/div[2]/div/div/div[2]/div/div/div/ul[2]', new dom().parseFromString($.html()));
                // Use the `cheerio.load()` method to create a Cheerio instance from the first result of the XPath query
                const $ulElement = cheerio.load(ulElement[0].toString());
                // Use the `find()` method to get all the li elements inside the ul element
                const liElements = $ulElement('li');
                // Use the `map()` method to extract the HTML content of each li element
                const liHtmls = liElements.map((index, li) => $(li).html()).get();


                const ulElement1 = xpath.select('//*[@id="portlet_com_liferay_asset_publisher_web_portlet_AssetPublisherPortlet_INSTANCE_HtVDzRCPDnG4"]/div/div[2]/div/div/div[2]/div/div/div/ul[3]', new dom().parseFromString($.html()));
                const $ulElement1 = cheerio.load(ulElement1[0].toString());
                const liElements1 = $ulElement1('li');
                const liHtmls1 = liElements1.map((index, li) => $(li).html()).get();

                const ulElement2 = xpath.select('//*[@id="portlet_com_liferay_asset_publisher_web_portlet_AssetPublisherPortlet_INSTANCE_HtVDzRCPDnG4"]/div/div[2]/div/div/div[2]/div/div/div/ul[4]', new dom().parseFromString($.html()));
                const $ulElement2 = cheerio.load(ulElement2[0].toString());
                const liElements2 = $ulElement2('li');
                const liHtmls2 = liElements2.map((index, li) => $(li).html()).get();

                const fileContents = fs.readFileSync('content.txt').toString()
                const updatedContentArray = [];

                // This is the first root
                liHtmls.forEach(x => {
                    // se ci sono modifiche
                    if (!fileContents.includes(x)) {
                        // Send bradcast
                        var lineReader = readline.createInterface({
                            input: require('fs').createReadStream('users.txt')
                        });
                        lineReader.on('line', function (line) {
                            if (line !== "")
                                bot.sendMessage(line, x)
                        });

                        updatedContentArray.push(x);
                    }
                })
                // This is the second root
                liHtmls1.forEach(x => {
                    // se ci sono modifiche
                    if (!fileContents.includes(x)) {
                        // Send bradcast
                        var lineReader = readline.createInterface({
                            input: require('fs').createReadStream('users.txt')
                        });
                        lineReader.on('line', function (line) {
                            if (line !== "")
                                bot.sendMessage(line, x)
                        });

                        updatedContentArray.push(x);
                    }

                })
                // This is the third root
                liHtmls2.forEach(x => {
                    // se ci sono modifiche
                    if (!fileContents.includes(x)) {
                        // Send bradcast
                        var lineReader = readline.createInterface({
                            input: require('fs').createReadStream('users.txt')
                        });
                        lineReader.on('line', function (line) {
                            if (line !== "")
                                bot.sendMessage(line, x)
                        });

                        updatedContentArray.push(x);
                    }

                })

                //###############################

                const response1 = await axios.get('https://www.adm.gov.it/portale/dogane/operatore/accise/telematizzazione-delle-accise/settore-prodotti-energetici/tabelle-di-riferimento');
                const $1 = cheerio.load(response1.data);

                // Use an XPath selector to get the ul element with the class "default"
                const ulElement_t = xpath.select('//*[@id="portlet_com_liferay_asset_publisher_web_portlet_AssetPublisherPortlet_INSTANCE_HtVDzRCPDnG4"]/div/div[2]/div/div/div[2]/div/div/div/ul', new dom().parseFromString($1.html()));
                // Use the `cheerio.load()` method to create a Cheerio instance from the first result of the XPath query
                const $ulElement_t = cheerio.load(ulElement_t[0].toString());
                // Use the `find()` method to get all the li elements inside the ul element
                const liElements_t = $ulElement_t('li');
                // const liHtmls_t2 = liElements_t.map((index, li) => $(li).html()).get();
                // console.log(liHtmls_t2);

                // Use the `map()` method to extract the HTML content of each li element
                const liHtmls_t = liElements_t.map((index, li) => {
                    // Create a Cheerio instance from the current li element
                    const $li = $(li);
                    // Use the `find()` method to get all the a elements inside the current li element
                    const aElements = $li.find('a');
                    // Use the `map()` method to extract the HTML content of each a element
                    const aHtmls = aElements.map((index, a) => $.html(a)).get();

                    // Return the a HTML content as a string
                    return aHtmls.join('');
                }).get();

                // console.log(liHtmls_t);

                // This is the first root
                liHtmls_t.forEach(x => {
                    // se ci sono modifiche
                    if (!fileContents.includes(x)) {
                        // Send bradcast
                        var lineReader = readline.createInterface({
                            input: require('fs').createReadStream('users.txt')
                        });
                        lineReader.on('line', function (line) {
                            if (line !== "")
                                bot.sendMessage(line, x)
                        });
                        updatedContentArray.push(x);
                    }
                })
                // Write the final array
                if (updatedContentArray.length > 0) {
                    const updatedContent = fileContents + '\n' + updatedContentArray.join('\n');
                    fs.writeFile('content.txt', updatedContent, 'utf-8', function (err) {
                        if (err) throw err;
                    });
                }

            })();

        } else
            bot.sendMessage(145645559, "Controlla il Link delle Dogane")
    })


});