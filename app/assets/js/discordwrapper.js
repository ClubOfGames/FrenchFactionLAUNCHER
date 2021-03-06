// Work in progress
const logger = require('./loggerutil')('%c[DiscordWrapper]', 'color: #7289da; font-weight: bold')

const {Client} = require('discord-rpc-patch')

let client
let activity

exports.initRPC = function(genSettings, servSettings, initialDetails = 'En attente du client..'){
    client = new Client({ transport: 'ipc' })

    activity = {
        details: initialDetails,
        state: 'Serveur: ' + servSettings.shortId,
        largeImageKey: servSettings.largeImageKey,
        largeImageText: servSettings.largeImageText,
        smallImageKey: genSettings.smallImageKey,
        smallImageText: genSettings.smallImageText,
        startTimestamp: new Date().getTime(),
        instance: false
    }

    client.on('ready', () => {
        logger.log('Connexion avec Discord effectué !')
        client.setActivity(activity)
    })
    
    client.login({clientId: genSettings.clientId}).catch(error => {
        if(error.message.includes('ENOENT')) {
            logger.log('Impossible d\'initialiser Discord Rich Presence, aucun client détecté.')
        } else {
            logger.log('Impossible d\'initialiser Discord Rich Presence : ' + error.message, error)
        }
    })
}

exports.updateDetails = function(details){
    activity.details = details
    client.setActivity(activity)
}

exports.shutdownRPC = function(){
    if(!client) return
    client.clearActivity()
    client.destroy()
    client = null
    activity = null
}