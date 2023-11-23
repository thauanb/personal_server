const express    = require('express');
const si         = require('systeminformation');
const {exec}     = require('child_process');

function shutdown(){
   // Comando para desligar o computador
let shutdownCommand = '';
// Verifica o sistema operacional e define o comando apropriado
if (process.platform === 'win32') {
  shutdownCommand = 'shutdown /s /t 0';
} else if (process.platform === 'linux') {
  shutdownCommand = 'shutdown now';
} else if (process.platform === 'darwin') {
  shutdownCommand = 'shutdown -h now';
} else {
  console.error('Sistema operacional não suportado para desligamento remoto.');
}
// Executa o comando de desligamento
if (shutdownCommand !== '') {
  exec(shutdownCommand, (error, stdout, stderr) => {
    if (error) {
      console.error(`Erro ao desligar o computador: ${error.message}`);
      return;
    }
    console.log('Computador desligado com sucesso!');
  });
}
}

async function getBatteryInfo() {
   try {
       const batteryData = await si.battery();
       return batteryData;
   } catch (error) {
       console.error('Erro ao obter informações da bateria:', error);
   }
}


const app     = express()
// envia arquivos estáticos da pasta public.
app.use(express.static('public'))
// utilizado para rendenizar páginas dinâmicas , por meio dele que é possível enviar dados do servidor para páginas estáticas
app.set('view engine', 'ejs'); 

const PORT = 3695;
const color = {
   reset: "\x1b[0m",
   red: "\x1b[31m",
   green: "\x1b[32m",
   orange: "\x1b[33m",
   blue: "\x1b[34m",
   white: "\x1b[37m",
 };
const simbol = {
   ok       : `${color.green}[+]${color.reset}`,
   fail     : `${color.red}[-]${color.reset}`,
   atention : `${color.orange}[!]${color.reset}`
}

app.get('/', async(req, res) => {
   const info = {
      host: req.hostname,
      battery: await getBatteryInfo()
    };
   // Renderiza a página estática e envia dados para o arquivo EJS
   res.render('index', { info });
 });

app.get('/desligar',(req,res)=>{
   shutdown();
   res.send('Executado');
})

app.listen(PORT , ()=>{
   console.clear();
   console.log(`${simbol.atention} Servidor conectado na porta ${PORT}`);
   console.log(`${simbol.ok} http://${color.blue}127.0.0.1${color.reset}:${PORT}`);
})


