import { useEffect, useState, useCallback, useMemo } from 'react';
import { 
  Activity, Database, HardDrive, Loader2, Search, 
  RefreshCw, DollarSign, Globe, TrendingUp, // Removed Cloud
  LayoutDashboard, Server, Shield, PieChart, Info, Cpu
} from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer 
} from 'recharts';

interface Resource {
  id: string;
  name: string;
  type: string;
  provider: string;
  status: string;
  costs: { amount: number }[];
}

export default function App() {
  const [data, setData] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('http://localhost:3001/api/analytics');
      const json = await res.json();
      setData(json.data || []);
    } catch (err) { console.error(err); } finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const totalSpend = useMemo(() => data.reduce((acc, item) => acc + (item.costs[0]?.amount || 0), 0), [data]);
  const filteredData = data.filter(item => 
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.provider.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getProvStyle = (p: string) => {
    const s = p.toUpperCase();
    if(s === 'AWS') return 'text-orange-400 border-orange-400/20 bg-orange-400/10';
    if(s === 'AZURE') return 'text-blue-400 border-blue-400/20 bg-blue-400/10';
    if(s === 'GCP') return 'text-red-400 border-red-400/20 bg-red-400/10';
    return 'text-slate-400 border-slate-400/20 bg-slate-400/10';
  };

  if (loading && data.length === 0) return (
    <div className="h-screen w-full flex items-center justify-center bg-[#020617]">
      <div className="text-center">
        <Loader2 className="animate-spin text-blue-500 mb-4 mx-auto" size={40} />
        <p className="text-blue-500 font-black tracking-widest text-xs uppercase">Initializing AuraScale</p>
      </div>
    </div>
  );

  return (
    <div className="h-screen w-full bg-[#020617] text-slate-400 flex overflow-hidden p-3 font-sans selection:bg-blue-500/30">
      
      {/* 1. ULTRA-COMPACT NAV BAR */}
      <aside className="w-16 flex flex-col items-center py-6 bg-[#0f172a]/40 border border-slate-800/50 rounded-2xl mr-3 shrink-0 backdrop-blur-xl">
        <div className="mb-10 text-blue-500 drop-shadow-[0_0_8px_rgba(59,130,246,0.5)]">
          <LayoutDashboard size={28} />
        </div>
        <div className="flex-1 space-y-8">
          {[PieChart, Server, Shield, Cpu, Info].map((Icon, i) => (
            <Icon key={i} size={20} className={i === 0 ? "text-blue-400" : "text-slate-600 hover:text-slate-400 cursor-pointer transition-colors"} />
          ))}
        </div>
        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(34,197,94,0.8)]" />
      </aside>

      {/* 2. MAIN HUB */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* BRANDED HEADER */}
        <header className="h-16 flex items-center justify-between px-4 mb-3">
          <div className="flex items-baseline gap-2">
            <h1 className="text-2xl font-black tracking-tighter text-white">
              AURA<span className="text-blue-500">SCALE</span>
            </h1>
            <span className="text-[10px] font-bold text-slate-600 tracking-[0.3em] uppercase">Cloud Analytics</span>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={14} />
              <input 
                type="text" placeholder="Filter fleet..." 
                className="w-64 pl-9 pr-4 py-2 bg-slate-900/50 border border-slate-800 rounded-xl outline-none focus:border-blue-500/50 text-xs transition-all placeholder:text-slate-700"
                value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <button onClick={fetchData} className="p-2 hover:bg-slate-800 rounded-xl transition-colors text-slate-500">
              <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
            </button>
          </div>
        </header>

        {/* 3. BENTO COMMAND GRID */}
        <div className="flex-1 grid grid-cols-4 grid-rows-3 gap-3 overflow-hidden min-h-0">
          
          {/* BUDGET SUMMARY (Top Left) */}
          <div className="col-span-1 row-span-1 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-3xl p-6 text-white shadow-lg shadow-blue-900/20 flex flex-col justify-center relative overflow-hidden">
            <DollarSign className="absolute -right-4 -bottom-4 opacity-10 rotate-12" size={120} />
            <p className="text-[10px] font-black uppercase tracking-widest text-blue-100 mb-1">Fleet Total Spend</p>
            <h2 className="text-4xl font-black tracking-tighter">${totalSpend.toLocaleString(undefined, { minimumFractionDigits: 2 })}</h2>
            <div className="mt-4 flex items-center gap-2 text-[10px] font-bold text-blue-100">
              <span className="px-1.5 py-0.5 bg-blue-500/30 rounded underline decoration-white/30 underline-offset-2">Monthly Cycle</span>
              <span className="text-white">+4.2% Trend</span>
            </div>
          </div>

          {/* TREND CHART (Top Middle/Right) */}
          <div className="col-span-3 row-span-1 bg-[#0f172a]/40 border border-slate-800/50 rounded-3xl p-6 backdrop-blur-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xs font-black uppercase tracking-widest text-slate-500 flex items-center gap-2">
                <TrendingUp size={14} className="text-blue-500" /> Operational Trends
              </h3>
              <div className="flex gap-4 text-[10px] font-bold">
                <span className="text-blue-400">● Live Cost</span>
                <span className="text-slate-700">● Forecast</span>
              </div>
            </div>
            <div className="h-full max-h-[140px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={[
                  {n: 'Oct', c: totalSpend * 0.7}, {n: 'Nov', c: totalSpend * 0.8}, 
                  {n: 'Dec', c: totalSpend * 0.95}, {n: 'Jan', c: totalSpend}
                ]}>
                  <defs>
                    <linearGradient id="g" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/><stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/></linearGradient>
                  </defs>
                  <CartesianGrid vertical={false} stroke="#1e293b" strokeDasharray="3 3" />
                  <XAxis dataKey="n" hide />
                  <YAxis hide />
                  <Tooltip contentStyle={{background:'#020617', border:'none', borderRadius:'8px', fontSize:'10px'}} />
                  <Area type="monotone" dataKey="c" stroke="#3b82f6" strokeWidth={3} fill="url(#g)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* RESOURCE GRID (Bottom Left/Middle) */}
          <div className="col-span-3 row-span-2 overflow-y-auto pr-2 space-y-3 custom-scrollbar">
            <div className="grid grid-cols-2 gap-3">
              {filteredData.map((item) => (
                <div key={item.id} className="bg-[#0f172a]/40 border border-slate-800/50 p-4 rounded-2xl hover:border-blue-500/30 transition-all flex items-center justify-between group">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-slate-800/50 rounded-xl text-blue-400 group-hover:bg-blue-600 group-hover:text-white transition-all">
                      {item.type === 'Database' ? <Database size={18}/> : item.type === 'Storage' ? <HardDrive size={18}/> : <Activity size={18}/>}
                    </div>
                    <div>
                      <h4 className="font-bold text-white text-xs tracking-tight">{item.name}</h4>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className={`text-[8px] font-black uppercase px-1.5 py-0.5 rounded border ${getProvStyle(item.provider)}`}>{item.provider}</span>
                        <span className="text-[9px] text-slate-600 font-bold uppercase">{item.type}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-black text-white leading-none">${item.costs[0]?.amount.toLocaleString()}</p>
                    <span className="text-[8px] text-green-500 font-black uppercase tracking-widest mt-1 inline-block">● Online</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* REGIONAL STATS (Bottom Right) */}
          <div className="col-span-1 row-span-2 bg-[#0f172a]/40 border border-slate-800/50 rounded-3xl p-6 flex flex-col">
            <h3 className="text-xs font-black uppercase tracking-widest text-slate-500 mb-6 flex items-center gap-2">
              <Globe size={14} /> Connectivity
            </h3>
            <div className="flex-1 space-y-6">
              {[ {n:'US-East Cluster', v:82}, {n:'EU-Central Node', v:45}, {n:'APAC-South Edge', v:12} ].map(r => (
                <div key={r.n}>
                  <div className="flex justify-between text-[9px] font-black mb-2 uppercase text-slate-400">
                    <span>{r.n}</span><span>{r.v}%</span>
                  </div>
                  <div className="h-1 w-full bg-slate-800/50 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-500 rounded-full transition-all duration-1000 shadow-[0_0_8px_rgba(59,130,246,0.5)]" style={{ width: `${r.v}%` }} />
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-auto p-4 bg-blue-500/5 border border-blue-500/10 rounded-2xl">
              <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest">Network Pulse</p>
              <p className="text-sm font-bold text-blue-400 mt-1">42ms Latency</p>
            </div>
          </div>

        </div>
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #1e293b; border-radius: 10px; }
      `}</style>
    </div>
  );
}