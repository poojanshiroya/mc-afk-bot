const mineflayer = require('mineflayer');
const http = require('http');

// 1. Create a tiny web server to satisfy Render's free tier requirements
const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('Bot is running online 24/7!\n');
});

// Render automatically passes the port number through process.env.PORT
const PORT = process.env.PORT || 10000;
server.listen(PORT, () => {
  console.log(`Web server listening on port ${PORT}`);
});

// 2. Your Minecraft Bot configuration
const botOptions = {
  host: '144.31.46.7', 
  port: 13139,                         
  username: 'AFK_Bot_247',             
  version: false                       
};

let bot;

function initBot() {
  console.log('Connecting bot to server...');
  bot = mineflayer.createBot(botOptions);

          bot.on('spawn', () => {
            console.log('Bot successfully spawned in the world.');
            
            // This types the register command 2 seconds after spawning
            setTimeout(() => {
                bot.chat('/login 12341234');
                console.log('Sent registration command to LoginSecurity.');
            }, 2000);

            startAntiAFK();
        });

  bot.on('death', () => {
    console.log('Bot died. Respawning...');
    bot.respawn();
  });

  bot.on('end', () => {
    console.log('Disconnected. Retrying connection in 15 seconds...');
    setTimeout(initBot, 15000);
  });

  bot.on('error', (err) => console.log('Error encountered: ', err));
}

function startAntiAFK() {
  setInterval(() => {
    if (!bot || !bot.entity) return;
    bot.setControlState('jump', true);
    setTimeout(() => bot.setControlState('jump', false), 200);
    bot.setControlState('sneak', true);
    setTimeout(() => bot.setControlState('sneak', false), 500);
  }, 10000); 
}

initBot();
