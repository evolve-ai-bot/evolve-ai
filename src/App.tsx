import { useEffect, useState } from 'react';

type Msg = {role:'user'|'ai'; text:string};

const tg = (window as any).Telegram?.WebApp;

export default function App(){
  const [tab,setTab]=useState('chat');
  const [mode,setMode]=useState('Chat');
  const [input,setInput]=useState('');
  const [messages,setMessages]=useState<Msg[]>([
    {role:'ai',text:'Привет! Я EVOLVE AI. Могу помогать с текстами, идеями, учёбой, файлами, изображениями и поиском информации.'}
  ]);
  const [busy,setBusy]=useState(false);
  const [fileName,setFileName]=useState('');
  const userName=tg?.initDataUnsafe?.user?.first_name || 'Пользователь';

  useEffect(()=>{ try{tg?.ready?.();tg?.expand?.();}catch{} },[]);

  async function send(){
    const text=input.trim();
    if(!text || busy)return;
    setMessages(m=>[...m,{role:'user',text}]); setInput(''); setBusy(true);
    try{
      const r=await fetch('/api/chat',{method:'POST',headers:{'Content-Type':'application/json'},
        body:JSON.stringify({message:text,mode,user:{id:tg?.initDataUnsafe?.user?.id??null,first_name:userName}})});
      const d=await r.json();
      if(!r.ok) throw new Error(d.error||'Ошибка');
      setMessages(m=>[...m,{role:'ai',text:d.reply}]);
    }catch(e){
      setMessages(m=>[...m,{role:'ai',text:'Сервер AI сейчас недоступен. Проверь настройки backend и API-ключ.'}]);
    }finally{setBusy(false);}
  }

  async function upload(e:any){
    const f=e.target.files?.[0]; if(!f)return;
    setFileName(f.name);
    setMessages(m=>[...m,{role:'user',text:`📎 Загружен файл: ${f.name}`}]);
    setMessages(m=>[...m,{role:'ai',text:'Файл принят в интерфейсе. В следующем этапе backend можно подключить к File Search для полноценного анализа содержимого.'}]);
  }

  return <div className="shell">
    <header className="header">
      <div><div className="logo">EVOLVE <span>AI</span></div><div className="sub">AI workspace в Telegram</div></div>
      <div className="user">{userName.slice(0,1).toUpperCase()}</div>
    </header>

    <main className="content">
      {tab==='chat' && <>
        <div className="modes">
          {['Chat','Web','Images','Files'].map(x=><button className={mode===x?'sel':''} onClick={()=>setMode(x)} key={x}>{x}</button>)}
        </div>
        <section className="chat">
          <div className="chathead"><div><b>{mode}</b><small> • AI</small></div><span>{busy?'генерирую…':'готов'}</span></div>
          <div className="messages">
            {messages.map((m,i)=><div key={i} className={'msg '+m.role}>{m.text}</div>)}
          </div>
          <div className="inputrow">
            <label className="attach">＋<input type="file" onChange={upload}/></label>
            <input value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>e.key==='Enter'&&send()} placeholder="Спроси что-нибудь…"/>
            <button onClick={send} disabled={busy}>↑</button>
          </div>
          {fileName && <div className="filename">📎 {fileName}</div>}
        </section>
      </>}

      {tab==='home' && <section className="cards">
        <div className="hero"><small>EVOLVE AI</small><h1>Твой AI-инструмент<br/>внутри Telegram.</h1><p>Чат, поиск, работа с файлами и изображения — в одном интерфейсе.</p><button onClick={()=>setTab('chat')}>Открыть AI →</button></div>
        <div className="tiles"><div><b>🧠 AI Chat</b><span>Ответы и идеи</span></div><div><b>🌐 Web</b><span>Актуальная информация</span></div><div><b>🖼 Images</b><span>Работа с изображениями</span></div><div><b>📎 Files</b><span>Документы и анализ</span></div></div>
      </section>}

      {tab==='profile' && <section className="cards"><div className="profile"><div className="big">{userName.slice(0,1).toUpperCase()}</div><h2>{userName}</h2><p>Telegram-профиль</p></div><div className="list"><div>🧠 Память AI <span>В разработке</span></div><div>🎯 Цели <span>В разработке</span></div><div>⚙️ Настройки <span>›</span></div></div></section>}
    </main>

    <nav>{[['home','⌂','Главная'],['chat','✦','AI'],['profile','●','Профиль']].map(([id,ic,l])=><button className={tab===id?'active':''} onClick={()=>setTab(id)} key={id}><i>{ic}</i>{l}</button>)}</nav>
  </div>
}
