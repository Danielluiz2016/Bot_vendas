module.exports = {
    name: 'ready',
    once: true,

    /**
     * @param {Client} client 
     */
    async execute(client) {
        
        
        client.user.setActivity(`Vendas Automaticas | `, { type: "STREAMING", url: "https://twitch.tv/discord"});
    
    }
}



