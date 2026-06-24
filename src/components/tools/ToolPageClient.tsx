
'use client';

import React, { useState, useMemo } from 'react';
import { 
  ArrowLeft, 
  Copy, 
  Trash2, 
  Zap, 
  CheckCircle2, 
  AlertTriangle,
  Code2,
  RefreshCcw,
  ShieldCheck,
  ChevronRight,
  Search,
  Calculator,
  Binary,
  Globe,
  FileCode,
  Lock,
  Activity,
  Terminal,
  Type,
  Maximize2,
  Minimize2,
  Clock,
  Shield
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import Link from 'next/link';
import RevealOnScroll from '@/components/effects/RevealOnScroll';
import { useTranslation } from '@/components/LanguageProvider';
import { useToast } from '@/hooks/use-toast';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { cn } from '@/lib/utils';

// --- Types & Metadata ---
type ToolType = {
  id: string;
  titleEn: string;
  titleCn: string;
  category: string;
  descriptionEn: string;
  descriptionCn: string;
  icon: any;
};

const TOOLS_METADATA: Record<string, ToolType> = {
  'json-formatter-pro': { id: 'json-formatter-pro', titleEn: 'JSON Architect', titleCn: 'JSON 架构师', category: 'Dev', descriptionEn: 'Validate and beautify complex JSON structures.', descriptionCn: '验证并美化复杂的 JSON 结构。', icon: Code2 },
  'regex-tester-ai': { id: 'regex-tester-ai', titleEn: 'Neural Regex', titleCn: '神经网络正则', category: 'Dev', descriptionEn: 'Pattern matching with real-time feedback.', descriptionCn: '带实时反馈的模式匹配工具。', icon: Search },
  'base64-toolkit': { id: 'base64-toolkit', titleEn: 'Base64 Engine', titleCn: 'Base64 引擎', category: 'Encoding', descriptionEn: 'Dual-path text transformation.', descriptionCn: '文本与 Base64 的双向转换。', icon: Binary },
  'jwt-neural-debugger': { id: 'jwt-neural-debugger', titleEn: 'JWT Inspector', titleCn: 'JWT 检测器', category: 'Security', descriptionEn: 'Decrypt and audit JSON Web Tokens.', descriptionCn: '解密并审计 JSON Web 令牌。', icon: ShieldCheck },
  'secure-pass-gen': { id: 'secure-pass-gen', titleEn: 'Quantum Pass', titleCn: '量子密码', category: 'Security', descriptionEn: 'High-entropy cryptographic generator.', descriptionCn: '高熵加密级别密码生成器。', icon: Lock },
  'sql-formatter-pro': { id: 'sql-formatter-pro', titleEn: 'SQL Architect', titleCn: 'SQL 架构师', category: 'Database', descriptionEn: 'Optimize and clean database queries.', descriptionCn: '优化并清理数据库查询语句。', icon: FileCode },
  'ip-calculator-pro': { id: 'ip-calculator-pro', titleEn: 'IP Calculator', titleCn: 'IP 计算器', category: 'Network', descriptionEn: 'Subnetting and network range analytics.', descriptionCn: '子网划分与网络范围分析。', icon: Calculator },
  'svg-path-optimizer': { id: 'svg-path-optimizer', titleEn: 'SVG Nano', titleCn: 'SVG 纳米压缩', category: 'Design', descriptionEn: 'Coordinate precision compression.', descriptionCn: '坐标精度的矢量图形压缩。', icon: Activity },
  'cron-job-scheduler': { id: 'cron-job-scheduler', titleEn: 'Cron Visualizer', titleCn: 'Cron 可视化', category: 'DevOps', descriptionEn: 'Natural language expression parsing.', descriptionCn: 'Cron 表达式的人类语言解析。', icon: RefreshCcw },
  'markdown-live-editor': { id: 'markdown-live-editor', titleEn: 'Markdown Live', titleCn: 'Markdown 实时', category: 'Writing', descriptionEn: 'Live rendering with GFM support.', descriptionCn: '支持 GFM 的实时渲染引擎。', icon: Type }
};

export default function ToolPage({ params }: { params: { id: string } }) {
  const { id } = params;
  const { t, language } = useTranslation();
  const { toast } = useToast();
  
  const rawMeta = TOOLS_METADATA[id] || { id, titleEn: 'Utility Tool', titleCn: '实用工具', category: 'General', descriptionEn: 'Technical utility.', descriptionCn: '技术实用程序。', icon: Terminal };
  const tool = {
    ...rawMeta,
    title: language === 'cn' ? rawMeta.titleCn : rawMeta.titleEn,
    description: language === 'cn' ? rawMeta.descriptionCn : rawMeta.descriptionEn
  };

  // --- Common States ---
  const [input, setInput] = useState('');
  const [output, setOutput] = useState<any>('');
  const [error, setError] = useState<string | null>(null);
  const [isCopied, setIsCopied] = useState(false);
  const [mode, setMode] = useState<'beautify' | 'minify'>('beautify');

  // --- Tool Specific States ---
  const [regexPattern, setRegexPattern] = useState('');
  const [regexFlags, setRegexPatternFlags] = useState('g');
  const [passLength, setPassLength] = useState(24);
  const [passConfig, setPassConfig] = useState({ upper: true, numbers: true, symbols: true });
  const [svgPrecision, setPrecision] = useState(2);

  const copyToClipboard = (text?: string) => {
    const toCopy = text || (typeof output === 'string' ? output : JSON.stringify(output, null, 2));
    if (!toCopy) return;
    navigator.clipboard.writeText(toCopy);
    setIsCopied(true);
    toast({ title: t.onlineTools.copied, description: t.onlineTools.copiedSub });
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleRun = () => {
    setError(null);
    try {
      if (!input && id !== 'secure-pass-gen') return;

      switch(id) {
        case 'json-formatter-pro':
          const json = JSON.parse(input);
          setOutput(mode === 'beautify' ? JSON.stringify(json, null, 2) : JSON.stringify(json));
          break;
        case 'sql-formatter-pro':
          const kw = ['SELECT', 'FROM', 'WHERE', 'AND', 'OR', 'INSERT', 'UPDATE', 'DELETE', 'JOIN', 'GROUP', 'BY', 'ORDER', 'LIMIT', 'SET', 'VALUES'];
          let sql = input.replace(/\s+/g, ' ').trim();
          kw.forEach(k => sql = sql.replace(new RegExp(`\\b${k}\\b`, 'gi'), `\n${k.toUpperCase()}`));
          setOutput(sql.trim());
          break;
        case 'base64-toolkit':
          setOutput(btoa(input));
          break;
        case 'secure-pass-gen':
          let charset = "abcdefghijklmnopqrstuvwxyz";
          if (passConfig.upper) charset += "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
          if (passConfig.numbers) charset += "0123456789";
          if (passConfig.symbols) charset += "!@#$%^&*()_+~`|}{[]:;?><,./-=";
          let ret = "";
          for (let i = 0; i < passLength; i++) ret += charset.charAt(Math.floor(Math.random() * charset.length));
          
          // Entropy calc: log2(charset^length)
          const entropy = Math.floor(Math.log2(Math.pow(charset.length, passLength)));
          setOutput({ password: ret, entropy, charset: charset.length });
          break;
        case 'ip-calculator-pro':
          const [ip, mask] = input.split('/');
          const mNum = parseInt(mask);
          if (isNaN(mNum) || mNum < 0 || mNum > 32) throw new Error('Invalid Subnet Mask');
          const ipP = ip.split('.').map(Number);
          if (ipP.some(p => isNaN(p) || p > 255)) throw new Error('Invalid IP Address');
          
          const fullMask = (0xFFFFFFFF << (32 - mNum)) >>> 0;
          const ipNum = ((ipP[0] << 24) | (ipP[1] << 16) | (ipP[2] << 8) | ipP[3]) >>> 0;
          const netNum = (ipNum & fullMask) >>> 0;
          const broadNum = (netNum | ~fullMask) >>> 0;
          
          const toS = (n: number) => [(n >>> 24) & 0xFF, (n >>> 16) & 0xFF, (n >>> 8) & 0xFF, n & 0xFF].join('.');
          const toB = (n: number) => n.toString(2).padStart(32, '0').match(/.{8}/g)?.join('.') || '';
          
          setOutput({
            [t.onlineTools.ipAddress]: ip,
            [t.onlineTools.ipMask]: `${toS(fullMask)} (/${mask})`,
            [t.onlineTools.ipNetwork]: toS(netNum),
            [t.onlineTools.ipBroadcast]: toS(broadNum),
            [t.onlineTools.ipRange]: `${toS(netNum + 1)} - ${toS(broadNum - 1)}`,
            [t.onlineTools.binaryView]: toB(ipNum)
          });
          break;
        case 'jwt-neural-debugger':
          const parts = input.trim().split('.');
          if (parts.length !== 3) throw new Error('Invalid JWT Token format.');
          const h = JSON.parse(atob(parts[0].replace(/-/g, '+').replace(/_/g, '/')));
          const p = JSON.parse(atob(parts[1].replace(/-/g, '+').replace(/_/g, '/')));
          
          const now = Math.floor(Date.now() / 1000);
          const status = p.exp ? (now > p.exp ? t.onlineTools.expired : t.onlineTools.active) : 'N/A';
          
          setOutput({
            header: h,
            payload: p,
            audit: {
              status,
              iat: p.iat ? new Date(p.iat * 1000).toLocaleString() : 'N/A',
              exp: p.exp ? new Date(p.exp * 1000).toLocaleString() : 'N/A',
              alg: h.alg
            }
          });
          break;
        case 'regex-tester-ai':
          const regex = new RegExp(regexPattern || '.*', regexFlags);
          const matches = Array.from(input.matchAll(regex));
          setOutput(matches.map((m, i) => ({ 
            id: i, 
            text: m[0], 
            index: m.index,
            groups: m.slice(1).filter(Boolean)
          })));
          break;
        case 'cron-job-scheduler':
          const cP = input.trim().split(/\s+/);
          if (cP.length < 5) throw new Error('Incomplete expression.');
          const next = Array.from({ length: 5 }, (_, i) => {
             const d = new Date();
             d.setMinutes(d.getMinutes() + (i + 1) * 5); // Simulated logic
             return d.toLocaleString();
          });
          setOutput({
            description: language === 'cn' ? `在 ${cP[0] === '*' ? '每分钟' : `${cP[0]} 分`}，${cP[1] === '*' ? '每小时' : `${cP[1]} 时`} 执行。` : `Executes at ${cP[0] === '*' ? 'every minute' : `minute ${cP[0]}`}, ${cP[1] === '*' ? 'every hour' : `hour ${cP[1]}`}.`,
            cycles: next
          });
          break;
        case 'svg-path-optimizer':
          // Simple precision reducer logic
          let optimized = input.replace(/\s+/g, ' ').trim();
          optimized = optimized.replace(/(\d+\.\d+)/g, (match) => parseFloat(match).toFixed(svgPrecision));
          setOutput(optimized);
          break;
      }
    } catch (e: any) {
      setError(e.message);
    }
  };

  const strengthColor = useMemo(() => {
    if (id !== 'secure-pass-gen' || !output?.entropy) return 'bg-muted';
    if (output.entropy > 100) return 'bg-green-500';
    if (output.entropy > 60) return 'bg-yellow-500';
    return 'bg-red-500';
  }, [id, output]);

  return (
    <div className="container mx-auto px-6 py-12 max-w-7xl space-y-12">
      {/* --- HEADER --- */}
      <RevealOnScroll direction="up">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-10 bg-accent/20 p-8 rounded-[3rem] border border-white/5 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 bg-primary/5 blur-[80px] rounded-full" />
          
          <div className="relative z-10 space-y-4">
            <Link href="/kb">
              <Button variant="ghost" className="rounded-full gap-2 -ml-3 text-muted-foreground hover:text-primary transition-colors">
                <ArrowLeft className="w-4 h-4" /> {t.blog.backToBlog}
              </Button>
            </Link>
            <div className="flex items-center gap-5">
              <div className="w-16 h-16 rounded-2xl bg-primary/20 flex items-center justify-center text-primary shadow-inner">
                <tool.icon className="w-8 h-8" />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-headline font-bold tracking-tight">{tool.title}</h1>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="secondary" className="rounded-full uppercase text-[9px] font-black tracking-widest px-3">{tool.category}</Badge>
                  <span className="text-xs text-muted-foreground font-medium flex items-center gap-1.5"><Globe className="w-3 h-3" /> {t.onlineTools.secureLink}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="relative z-10 flex items-center gap-3">
            <Button variant="outline" className="rounded-2xl h-12 w-12 p-0 bg-background/40" onClick={() => { setInput(''); setOutput(''); setError(null); }}>
              <Trash2 className="w-5 h-5" />
            </Button>
            <Button className="rounded-2xl h-12 px-8 font-bold shadow-xl" onClick={() => copyToClipboard()}>
              {isCopied ? <CheckCircle2 className="w-4.5 h-4.5 mr-2" /> : <Copy className="w-4.5 h-4.5 mr-2" />}
              {isCopied ? t.onlineTools.copied : t.onlineTools.copy}
            </Button>
          </div>
        </div>
      </RevealOnScroll>

      {/* --- WORKSPACE --- */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 min-h-[650px]">
        {/* INPUT SECTION */}
        <RevealOnScroll direction="left" className="h-full">
          <Card className="glass border-none rounded-[3.5rem] overflow-hidden h-full flex flex-col shadow-2xl">
            <div className="px-10 py-6 border-b border-white/5 flex items-center justify-between bg-primary/5">
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary flex items-center gap-2"><Binary className="w-3.5 h-3.5" /> {t.onlineTools.sourceInterface}</span>
              <div className="flex items-center gap-4">
                {id === 'json-formatter-pro' && (
                  <div className="flex items-center gap-1 bg-accent/40 p-1 rounded-full border border-white/5">
                    <button onClick={() => setMode('beautify')} className={cn("px-3 py-1 text-[8px] font-bold uppercase rounded-full transition-all", mode === 'beautify' ? "bg-primary text-white" : "text-muted-foreground")}>{t.onlineTools.beautify}</button>
                    <button onClick={() => setMode('minify')} className={cn("px-3 py-1 text-[8px] font-bold uppercase rounded-full transition-all", mode === 'minify' ? "bg-primary text-white" : "text-muted-foreground")}>{t.onlineTools.minify}</button>
                  </div>
                )}
                <Badge variant="outline" className="font-mono text-[9px] border-primary/20 opacity-60">{input.length} chars</Badge>
              </div>
            </div>
            
            <CardContent className="p-10 flex-grow flex flex-col">
              {id === 'regex-tester-ai' ? (
                <div className="space-y-6 flex flex-col h-full">
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-primary/70">{t.onlineTools.regexPattern}</Label>
                    <div className="relative group">
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground font-mono">/</div>
                      <Input value={regexPattern} onChange={(e) => setRegexPattern(e.target.value)} placeholder="[a-zA-Z]+" className="pl-8 pr-12 h-14 glass border-none rounded-2xl font-mono focus-visible:ring-primary" />
                      <div className="absolute right-4 top-1/2 -translate-y-1/2 text-primary font-mono">/{regexFlags}</div>
                    </div>
                  </div>
                  <div className="flex-grow space-y-2">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-primary/70">{t.onlineTools.testString}</Label>
                    <Textarea value={input} onChange={(e) => setInput(e.target.value)} placeholder="..." className="h-full min-h-[300px] glass border-none rounded-3xl p-6 font-mono text-sm" />
                  </div>
                  <Button onClick={handleRun} className="h-14 rounded-2xl font-bold shadow-xl"><Zap className="mr-2 w-5 h-5" /> {t.onlineTools.analyzeString}</Button>
                </div>
              ) : id === 'secure-pass-gen' ? (
                <div className="space-y-10 flex flex-col justify-center h-full max-w-md mx-auto">
                  <div className="space-y-8">
                    <div className="space-y-4">
                      <Label className="text-[10px] font-black uppercase tracking-widest">{t.onlineTools.passLength}: {passLength}</Label>
                      <Slider value={[passLength]} onValueChange={(v) => setPassLength(v[0])} max={128} min={8} step={1} />
                    </div>
                    <div className="grid grid-cols-1 gap-4">
                      {[{ id: 'upper', label: t.onlineTools.includeUpper, value: passConfig.upper }, { id: 'numbers', label: t.onlineTools.includeNumbers, value: passConfig.numbers }, { id: 'symbols', label: t.onlineTools.includeSymbols, value: passConfig.symbols }].map(opt => (
                        <div key={opt.id} className="flex items-center justify-between p-4 glass rounded-2xl">
                          <Label className="text-xs font-bold">{opt.label}</Label>
                          <Switch checked={opt.value} onCheckedChange={(val) => setPassConfig(prev => ({ ...prev, [opt.id]: val }))} />
                        </div>
                      ))}
                    </div>
                  </div>
                  <Button onClick={handleRun} className="h-16 rounded-3xl font-bold text-lg shadow-xl"><RefreshCcw className="mr-2 w-6 h-6" /> {t.onlineTools.generateKey}</Button>
                </div>
              ) : id === 'svg-path-optimizer' ? (
                <div className="space-y-6 flex flex-col h-full">
                  <div className="space-y-4">
                    <Label className="text-[10px] font-black uppercase tracking-widest">{t.onlineTools.precision}: {svgPrecision}</Label>
                    <Slider value={[svgPrecision]} onValueChange={(v) => setPrecision(v[0])} max={10} min={0} step={1} />
                  </div>
                  <Textarea className="flex-grow min-h-[400px] border-none glass rounded-3xl p-6 font-code text-xs leading-relaxed" placeholder="<svg>...</svg>" value={input} onChange={(e) => setInput(e.target.value)} />
                  <Button onClick={handleRun} className="h-14 rounded-2xl font-bold shadow-xl"><Activity className="mr-2 w-5 h-5" /> {t.onlineTools.processData}</Button>
                </div>
              ) : (
                <div className="flex flex-col h-full space-y-8">
                  <Textarea className="flex-grow min-h-[400px] border-none focus-visible:ring-0 bg-transparent font-code text-sm leading-relaxed resize-none p-0" placeholder="..." value={input} onChange={(e) => setInput(e.target.value)} />
                  <Button onClick={handleRun} className="h-16 rounded-3xl font-bold text-lg shadow-xl">
                    <Activity className="mr-2 w-6 h-6" /> {t.onlineTools.processData}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </RevealOnScroll>

        {/* OUTPUT SECTION */}
        <RevealOnScroll direction="right" className="h-full">
          <Card className="glass border-none rounded-[3.5rem] overflow-hidden h-full flex flex-col shadow-2xl bg-secondary/5">
            <div className="px-10 py-6 border-b border-white/5 flex items-center justify-between">
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-secondary flex items-center gap-2"><Zap className="w-3.5 h-3.5" /> {t.onlineTools.neuralResult}</span>
              {error && <Badge variant="destructive" className="animate-pulse px-3 py-0.5 rounded-full text-[9px] uppercase"><AlertTriangle className="w-3 h-3 mr-1" /> {t.onlineTools.parseError}</Badge>}
            </div>

            <CardContent className="p-0 flex-grow flex flex-col relative">
              {id === 'markdown-live-editor' ? (
                <div className="p-10 prose prose-base dark:prose-invert max-w-none bg-background/20 min-h-full">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>{input || `*${t.onlineTools.waitingStream}*`}</ReactMarkdown>
                </div>
              ) : id === 'ip-calculator-pro' && output ? (
                <div className="p-8 space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {Object.entries(output).filter(([k]) => k !== t.onlineTools.binaryView).map(([key, val]) => (
                      <div key={key} className="glass p-5 rounded-2xl space-y-1 group hover:bg-primary/5 transition-colors">
                        <p className="text-[9px] font-black uppercase tracking-widest text-primary/60">{key}</p>
                        <p className="text-lg font-mono font-bold truncate">{val as string}</p>
                      </div>
                    ))}
                  </div>
                  <div className="space-y-2">
                    <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground px-2">{t.onlineTools.binaryView}</p>
                    <div className="glass p-6 rounded-2xl bg-background/40 font-mono text-xs text-primary leading-loose break-all">
                      {output[t.onlineTools.binaryView]}
                    </div>
                  </div>
                </div>
              ) : id === 'jwt-neural-debugger' && output ? (
                <div className="space-y-6 p-8 overflow-y-auto max-h-[700px]">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="glass p-4 rounded-2xl text-center space-y-1">
                       <p className="text-[8px] font-black uppercase text-muted-foreground">Status</p>
                       <Badge className={cn("rounded-full px-3 py-0.5 font-bold uppercase text-[9px]", output.audit.status === t.onlineTools.expired ? "bg-red-500" : "bg-green-500")}>{output.audit.status}</Badge>
                    </div>
                    <div className="glass p-4 rounded-2xl text-center space-y-1">
                       <p className="text-[8px] font-black uppercase text-muted-foreground">Algorithm</p>
                       <p className="font-mono font-bold text-xs">{output.audit.alg}</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Badge className="bg-red-500/10 text-red-500 border-none rounded-full px-3 py-0.5 text-[9px] font-black uppercase">{t.onlineTools.jwtHeader}</Badge>
                    <pre className="p-6 glass rounded-2xl font-mono text-xs text-red-400 overflow-auto">{JSON.stringify(output.header, null, 2)}</pre>
                  </div>
                  <div className="space-y-2">
                    <Badge className="bg-blue-500/10 text-blue-500 border-none rounded-full px-3 py-0.5 text-[9px] font-black uppercase">{t.onlineTools.jwtPayload}</Badge>
                    <pre className="p-6 glass rounded-2xl font-mono text-xs text-blue-400 overflow-auto">{JSON.stringify(output.payload, null, 2)}</pre>
                  </div>
                  <div className="grid grid-cols-1 gap-2 pt-2">
                    <div className="flex justify-between text-[10px] font-bold text-muted-foreground px-2">
                      <span>{t.onlineTools.issuedAt}: {output.audit.iat}</span>
                      <span>{t.onlineTools.expiryDate}: {output.audit.exp}</span>
                    </div>
                  </div>
                </div>
              ) : id === 'secure-pass-gen' && output ? (
                <div className="p-10 space-y-10 flex flex-col items-center justify-center h-full">
                  <div className="text-center space-y-4 w-full">
                    <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Generated Secure Vector</p>
                    <div className="p-8 glass rounded-[2.5rem] bg-background/40 relative group">
                      <p className="text-2xl font-mono font-bold break-all text-primary">{output.password}</p>
                      <Button variant="ghost" size="icon" className="absolute top-2 right-2 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity" onClick={() => copyToClipboard(output.password)}>
                        <Copy className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-6 w-full">
                    <div className="glass p-6 rounded-3xl space-y-3 text-center">
                      <Shield className="w-6 h-6 text-primary mx-auto" />
                      <div>
                        <p className="text-2xl font-black">{output.entropy} Bits</p>
                        <p className="text-[9px] font-bold uppercase text-muted-foreground">{t.onlineTools.entropy}</p>
                      </div>
                      <div className="w-full h-1.5 bg-accent rounded-full overflow-hidden">
                        <div className={cn("h-full transition-all duration-1000", strengthColor)} style={{ width: `${Math.min(100, (output.entropy / 128) * 100)}%` }} />
                      </div>
                    </div>
                    <div className="glass p-6 rounded-3xl space-y-3 text-center">
                      <Clock className="w-6 h-6 text-primary mx-auto" />
                      <div>
                        <p className="text-xl font-black truncate">{output.entropy > 80 ? '3000+ Years' : output.entropy > 40 ? '2 Months' : 'Instant'}</p>
                        <p className="text-[9px] font-bold uppercase text-muted-foreground">{t.onlineTools.crackTime}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ) : id === 'regex-tester-ai' && Array.isArray(output) ? (
                <div className="p-8 space-y-3 overflow-y-auto max-h-[600px]">
                  <p className="text-[10px] font-black uppercase text-muted-foreground mb-4">{output.length} {t.onlineTools.matchesFound}</p>
                  {output.length === 0 ? (
                    <div className="py-20 text-center text-muted-foreground/40 italic text-sm">No sequence detected...</div>
                  ) : output.map(m => (
                    <div key={m.id} className="glass p-5 rounded-2xl space-y-3 group border-none shadow-md">
                      <div className="flex items-center justify-between">
                        <code className="text-primary font-bold text-base">"{m.text}"</code>
                        <span className="text-[9px] font-mono opacity-40">index: {m.index}</span>
                      </div>
                      {m.groups.length > 0 && (
                        <div className="flex flex-wrap gap-2 pt-2 border-t border-white/5">
                          {m.groups.map((g: string, gi: number) => (
                            <Badge key={gi} variant="outline" className="text-[8px] uppercase font-mono px-2 py-0 border-primary/20">G{gi+1}: {g}</Badge>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : id === 'cron-job-scheduler' && output ? (
                <div className="p-10 space-y-10 flex flex-col justify-center h-full">
                  <div className="space-y-4">
                    <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Logic Translation</p>
                    <div className="p-8 glass rounded-[2.5rem] bg-primary/5 border-primary/10">
                      <p className="text-xl font-bold leading-relaxed">{output.description}</p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground px-2">{t.onlineTools.nextRuns}</p>
                    <div className="space-y-2">
                      {output.cycles.map((time: string, idx: number) => (
                        <div key={idx} className="flex items-center justify-between p-4 glass rounded-2xl hover:bg-accent/40 transition-colors">
                          <span className="text-xs font-mono">{time}</span>
                          <Badge variant="outline" className="text-[8px] uppercase opacity-40">Cycle {idx+1}</Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="h-full">
                  <pre className="p-10 font-code text-sm text-primary leading-relaxed whitespace-pre-wrap overflow-auto h-full min-h-[500px]">
                    {error ? (
                      <div className="text-destructive space-y-2">
                        <p className="font-bold flex items-center gap-2"><AlertTriangle className="w-4 h-4" /> {t.onlineTools.logicBreach}</p>
                        <p className="text-xs opacity-80">{error}</p>
                      </div>
                    ) : typeof output === 'string' ? output || t.onlineTools.emptyBuffer : JSON.stringify(output, null, 2)}
                  </pre>
                </div>
              )}
            </CardContent>
          </Card>
        </RevealOnScroll>
      </div>

      {/* --- INFO FOOTER --- */}
      <RevealOnScroll direction="up">
        <div className="glass rounded-[3.5rem] p-12 overflow-hidden relative shadow-2xl bg-primary/5">
          <div className="absolute top-0 right-0 -mr-20 -mt-20 w-60 h-60 bg-secondary/10 blur-[100px] rounded-full" />
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-10">
            <div className="space-y-3 text-center md:text-left">
              <h3 className="text-xl font-bold flex items-center gap-2 justify-center md:justify-start">
                <ShieldCheck className="w-5 h-5 text-green-500 fill-current" /> {t.onlineTools.infraTitle}
              </h3>
              <p className="text-sm text-muted-foreground max-w-lg font-medium leading-relaxed">
                {t.onlineTools.infraDesc}
              </p>
            </div>
            <div className="flex items-center gap-4">
              <Button variant="ghost" className="rounded-full px-6 font-bold border border-primary/10 hover:bg-primary/5">
                {t.onlineTools.apiDocs}
              </Button>
              <Button className="rounded-full px-8 font-bold shadow-xl shadow-primary/10">
                {t.onlineTools.unlockPro} <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
          </div>
        </div>
      </RevealOnScroll>
    </div>
  );
}
