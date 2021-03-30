const request = require('request');
const cheerio = require('cheerio');
const fs = require('fs');
const readline = require('readline');


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
const APRI_CANCELLO_2 = "\ud83d\udde3 Apri cancello 2"


inline_keyboard = [];

// Here starts everything
bot.onText(/\/start/, (msg) => {
    var telegramUser = msg.from
        //  $.sendMessage("Utente (" + telegramUser.firstName + " " + telegramUser.lastName + ")  " + body.message)

    // Aggiorno il file 
    const usersFile = fs.readFileSync('users.txt').toString()
    if (!usersFile.includes(msg.chat.id)) {
        fs.writeFile('users.txt', usersFile + msg.chat.id + "\n", 'utf-8', function(err) {
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
        request('https://www.adm.gov.it/portale/dogane/operatore/servizi-online/servizio-telematico-doganale-e.d.i./web-service/webservice-ambienteprova#sez-daselettronico', (error, response, html) => {
            if (!error && response.statusCode == 200) {
                const $ = cheerio.load(html);

                let main = $('ul').eq(5)

                bot.sendMessage(msg.chat.id, main.html())
            };
            console.log('Scraping Done...');
        });
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

            const $ = cheerio.load(html);
            let main = $('ul').eq(4)

            // console.log( main.html())

            const fileContents = fs.readFileSync('content.txt').toString()
                // se ci sono modifiche
            if (fileContents.replace(/\s/g, '') !== main.html().replace(/\s/g, '')) {
                // Send bradcast
                var lineReader = readline.createInterface({
                    input: require('fs').createReadStream('users.txt')
                });
                lineReader.on('line', function(line) {
                    if (line !== "")
                        bot.sendMessage(line, main.html())
                });

                // Aggiorno il file 
                fs.writeFile('content.txt', main.html(), 'utf-8', function(err) {
                    if (err) throw err;
                    console.log('filelistAsync complete');
                });
            }
        } else
            bot.sendMessage(145645559, "Controlla il Link delle Dogane")
    })




    request('https://www.adm.gov.it/portale/dogane/operatore/accise/telematizzazione-delle-accise/settore-prodotti-energetici/tabelle-di-riferimento', (error, response, html) => {
        if (!error && response.statusCode == 200) {
            const $ = cheerio.load(html);
            let main = $('.journal-content-article')
                //  console.log( main.html().replace(/\s/g, ''))
            const fileContents = fs.readFileSync('tabella_energetici.txt').toString()
                // se ci sono modifiche
            if (fileContents.replace(/\s/g, '') !== main.html().replace(/\s/g, '')) {
                // Send bradcast
                var lineReader = readline.createInterface({
                    input: require('fs').createReadStream('users.txt')
                });
                lineReader.on('line', function(line) {
                    if (line !== "")
                        bot.sendMessage(line, 'https://www.adm.gov.it/portale/dogane/operatore/accise/telematizzazione-delle-accise/settore-prodotti-energetici/tabelle-di-riferimento')
                });

                // Aggiorno il file 
                fs.writeFile('tabella_energetici.txt', main.html().replace(/\s/g, ''), 'utf-8', function(err) {
                    if (err) throw err;
                    console.log('filelistAsync complete');
                });
            }

        } else
            bot.sendMessage(145645559, "Controlla il Link delle Dogane")
    })



    //###########################################################################################################à

    /**
    request('https://www.adm.gov.it/portale/en/das-elettronico', (error, response, html) => {
        if (!error && response.statusCode == 200) {
            const $ = cheerio.load(html);

            let main = $('.journal-content-article')

            const home_content = fs.readFileSync('CONTAINER//home_content.txt').toString()

            // se ci sono modifiche
            if (home_content.replace(/\s/g, '') !== main.html().replace(/\s/g, '')) {
                // Send bradcast
                var lineReader = readline.createInterface({
                    input: require('fs').createReadStream('users.txt')
                });
                lineReader.on('line', function (line) {
                    if (line !== "")
                        bot.sendMessage(line, main.text())
                });

                // Aggiorno il file 
                fs.writeFile('CONTAINER//home_content.txt', main.html().replace(/\s/g, ''), 'utf-8', function (err) {
                    if (err) throw err;
                    console.log('filelistAsync complete');
                });
            }
            //     console.log(main.html().replace(/\s/g, ''))
        }
        else
            bot.sendMessage(145645559, "Controlla il Link delle Dogane")
        console.log('Scraping Done...');
    });

    **/




});