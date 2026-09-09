import express from 'express';
import OpenAI from 'openai';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const app=express();
app.use(express.json({limit:'2mb'}));
const __dirname=path.dirname(fileURLToPath(import.meta.url));
const client=new OpenAI({apiKey:process.env.OPENAI_API_KEY});

const instructions=`Ты EVOLVE AI — универсальный AI-помощник внутри Telegram Mini App.
Отвечай на русском, если пользователь не просит другой язык.
Будь полезным, точным и конкретным. Учитывай режим запроса.
Не утверждай, что ты человек. Не выдумывай источники.
Для запросов, где нужна актуальная информация, используй доступный веб-поиск.
Если пользователь просит опасные или запрещённые инструкции, откажись и предложи безопасную альтернативу.`;

app.post('/api/chat',async(req,res)=>{
 try{
  const {message,mode='Chat',user={}}=req.body||{};
  if(!message)return res.status(400).json({error:'Message is required'});
  if(!process.env.OPENAI_API_KEY)return res.status(500).json({error:'OPENAI_API_KEY is not configured'});
  const tools=mode==='Web'?[{type:'web_search'}]:[];
  const r=await client.responses.create({
    model:process.env.OPENAI_MODEL||'gpt-5',
    instructions,
    tools,
    input:`Режим: ${mode}
Пользователь: ${user.first_name||'пользователь'}
Запрос: ${message}`,
    max_output_tokens:900
  });
  res.json({reply:r.output_text});
 }catch(e){console.error(e);res.status(500).json({error:'AI request failed'});}
});

app.get('/api/health',(req,res)=>res.json({ok:true}));

// Serve the Vite frontend from the same cloud service.
const distDir=path.join(__dirname,'..','dist');
app.use(express.static(distDir));
app.get(/.*/, (req,res)=>res.sendFile(path.join(distDir,'index.html')));

const port=Number(process.env.PORT||3000);
app.listen(port,'0.0.0.0',()=>console.log(`EVOLVE AI running on ${port}`));