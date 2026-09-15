import { NextRequest, NextResponse } from 'next/server';
import mammoth from 'mammoth';
import pdf from 'pdf-parse';

export const runtime = 'nodejs';

function clean(s:string){ return s.replace(/\u0000/g,'').replace(/\r/g,'').replace(/[ \t]+/g,' ').replace(/\n{3,}/g,'\n\n').trim(); }
function first(re:RegExp, text:string, fallback=''){ return clean((text.match(re)?.[1] || fallback)); }
function bullets(block:string){
  return block.split(/\n/).map(s=>s.replace(/^\s*[•\-–—]\s*/, '').trim()).filter(s=>s.length>4 && s.length<500);
}

function extractUnits(text:string){
  const parts = text.split(/Unidade\s+Curricular\s*:/i).slice(1);
  const units:any[]=[];
  const seen=new Set<string>();
  for (const p0 of parts){
    const p=clean(p0);
    const name=first(/^\s*([^\n]{3,140})/m,p).replace(/Carga Horária.*$/i,'').trim();
    if(!name || seen.has(name.toLowerCase())) continue;
    seen.add(name.toLowerCase());
    const workloadRaw=first(/Carga\s+Hor[aá]ria\s*:\s*(\d+(?:[.,]\d+)?)/i,p);
    const objective=first(/Objetivo\s+Geral\s*:\s*([\s\S]*?)(?=CONTE[ÚU]DOS\s+FORMATIVOS|Conte[úu]dos\s+Formativos|Subfun[cç][aã]o|Capacidades\s+(?:T[eé]cnicas|B[aá]sicas)|$)/i,p);
    const functionText=first(/Fun[cç][aã]o\s*:\s*([\s\S]*?)(?=Objetivo\s+Geral|CONTE[ÚU]DOS\s+FORMATIVOS|$)/i,p);
    const socioBlock=first(/Capacidades\s+Socioemocionais\s*([\s\S]*?)(?=AMBIENTES\s+PEDAG[ÓO]GICOS|M[ÓO]DULO|Unidade\s+Curricular|$)/i,p);
    const techBlock=first(/Capacidades\s+T[eé]cnicas\s*([\s\S]*?)(?=Conhecimentos|Capacidades\s+Socioemocionais|AMBIENTES\s+PEDAG[ÓO]GICOS|$)/i,p);
    const basicBlock=first(/Capacidades\s+B[aá]sicas\s*([\s\S]*?)(?=Conhecimentos|Capacidades\s+Socioemocionais|AMBIENTES\s+PEDAG[ÓO]GICOS|$)/i,p);
    const knowledgeBlock=first(/Conhecimentos\s*([\s\S]*?)(?=Capacidades\s+Socioemocionais|AMBIENTES\s+PEDAG[ÓO]GICOS|Observa[cç][oõ]es|$)/i,p);
    units.push({
      name,
      workload: workloadRaw ? Number(workloadRaw.replace(',','.')) : undefined,
      objective,
      functionText,
      technicalCapabilities: bullets(techBlock || basicBlock).slice(0,80),
      basicCapabilities: bullets(basicBlock).slice(0,80),
      socioemotionalCapabilities: bullets(socioBlock).slice(0,40),
      knowledge: bullets(knowledgeBlock).slice(0,160),
      environments: [], resources: [], notes: [`Trecho extraído automaticamente. Revise antes de usar.`, p.slice(0,18000)]
    });
  }
  return units;
}

export async function POST(req: NextRequest) {
  try {
    const form=await req.formData();
    const file=form.get('file') as File | null;
    if(!file) return NextResponse.json({error:'Arquivo não enviado.'},{status:400});
    const bytes=Buffer.from(await file.arrayBuffer());
    const lower=file.name.toLowerCase();
    let text='';
    if(lower.endsWith('.pdf')) text=(await pdf(bytes)).text;
    else if(lower.endsWith('.docx')) text=(await mammoth.extractRawText({buffer:bytes})).value;
    else if(lower.endsWith('.txt')||lower.endsWith('.md')) text=bytes.toString('utf8');
    else return NextResponse.json({error:'Use PDF, DOCX, TXT ou MD.'},{status:415});
    text=clean(text);
    const courseName=first(/Curso\s*:\s*([^\n]+)/i,text,'Curso não identificado');
    const units=extractUnits(text);
    return NextResponse.json({courseName,sourceFileName:file.name,units,rawText:text.slice(0,900000)});
  } catch(e:any){ return NextResponse.json({error:e?.message||'Falha ao ler o arquivo.'},{status:500}); }
}
