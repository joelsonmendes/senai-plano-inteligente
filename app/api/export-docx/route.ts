import { NextRequest, NextResponse } from 'next/server';
import {
  AlignmentType, BorderStyle, Document, HeadingLevel, ImageRun, Packer, PageOrientation,
  Paragraph, Table, TableCell, TableRow, TextRun, WidthType
} from 'docx';
import fs from 'node:fs';
import path from 'node:path';

export const runtime = 'nodejs';

function paragraphs(text:string, bold=false) {
  const lines = String(text || '').split('\n').filter(Boolean);
  return (lines.length ? lines : ['']).map(line => new Paragraph({
    spacing:{after:40}, children:[new TextRun({ text:line, bold, size:16 })]
  }));
}

function bullets(items:string[] = []) {
  return items.length ? items.map(x => new Paragraph({
    spacing:{after:40}, children:[new TextRun({text:`• ${x}`,size:15})]
  })) : [new Paragraph('')];
}

function labelValue(label:string, value:string) {
  return new Paragraph({ spacing:{after:70}, children:[
    new TextRun({text:label,bold:true,size:19}), new TextRun({text:value||'',size:19})
  ]});
}

export async function POST(req: NextRequest) {
  try {
    const plan = await req.json();
    const unit = plan.unit || {};
    const logoPath = path.join(process.cwd(),'public','senai-header.png');
    const logoBuffer = fs.existsSync(logoPath) ? fs.readFileSync(logoPath) : null;

    const rows = [
      new TableRow({ tableHeader:true, children: [
        'Nº de Aulas / Carga', 'Capacidades a serem trabalhadas', 'Conhecimentos relacionados',
        'Estratégias de ensino e descrição da atividade', 'Recursos e ambientes pedagógicos',
        'Critérios de avaliação', 'Instrumentos de avaliação da aprendizagem'
      ].map(t => new TableCell({
        shading:{fill:'DCE8F7'},
        children:[new Paragraph({alignment:AlignmentType.CENTER, children:[new TextRun({text:t,bold:true,size:14,color:'183B67'})]})]
      })) }),
      ...(plan.lessons || []).map((l:any) => new TableRow({ cantSplit:true, children: [
        [new Paragraph({alignment:AlignmentType.CENTER,children:[new TextRun({text:`${l.number}ª aula`,bold:true,size:15})]}),new Paragraph({alignment:AlignmentType.CENTER,children:[new TextRun({text:`${l.durationHours}h`,size:14})]})],
        [...bullets(l.capabilities||[]), ...((l.socioemotional||[]).length ? [new Paragraph({children:[new TextRun({text:'Socioemocionais',bold:true,size:14,color:'A34B00'})]})] : []), ...bullets(l.socioemotional||[])],
        bullets(l.knowledge||[]),
        [...paragraphs(l.strategyType||'',true), ...paragraphs(l.strategySteps||'')],
        bullets(l.resources||[]),
        bullets(l.criteria||[]),
        bullets(l.instruments||[])
      ].map((children:any) => new TableCell({ children:Array.isArray(children)?children:[children] })) }))
    ];

    const children:any[] = [];
    if (logoBuffer) {
      children.push(new Paragraph({ alignment:AlignmentType.CENTER, spacing:{after:130}, children:[
        new ImageRun({ data:logoBuffer, transformation:{width:720,height:78}, type:'png' })
      ]}));
    }
    children.push(
      new Paragraph({ text:'PLANO DE ENSINO', heading:HeadingLevel.TITLE, alignment:AlignmentType.CENTER, spacing:{after:140} }),
      labelValue('Curso: ', plan.courseName || 'Técnico em Eletrotécnica'),
      labelValue('Unidade Curricular: ', unit.name || ''),
      labelValue('Carga Horária: ', `${plan.totalHours}h    |    Nº de aulas: ${plan.lessonCount}`),
      labelValue('Objetivo da UCR: ', unit.objective || ''),
      labelValue('Função: ', unit.functionText || ''),
      new Paragraph({ text:'SITUAÇÃO DE APRENDIZAGEM', heading:HeadingLevel.HEADING_1, spacing:{before:130,after:80} }),
      labelValue('Estratégia de Aprendizagem Desafiadora: ', plan.learningSituation?.strategy || ''),
      labelValue('Contextualização: ', plan.learningSituation?.context || ''),
      labelValue('Cenário Profissional: ', plan.learningSituation?.scenario || ''),
      labelValue('O Desafio: ', plan.learningSituation?.challenge || ''),
      new Paragraph({children:[new TextRun({text:'Resultados Esperados:',bold:true,size:19})]}),
      ...bullets(plan.learningSituation?.expectedResults || []),
      new Paragraph({ text:'PLANO DE AULA', heading:HeadingLevel.HEADING_1, spacing:{before:170,after:80} }),
      new Table({
        width:{size:100,type:WidthType.PERCENTAGE},
        rows,
        borders:{
          top:{style:BorderStyle.SINGLE,size:3,color:'7A8797'}, bottom:{style:BorderStyle.SINGLE,size:3,color:'7A8797'},
          left:{style:BorderStyle.SINGLE,size:3,color:'7A8797'}, right:{style:BorderStyle.SINGLE,size:3,color:'7A8797'},
          insideHorizontal:{style:BorderStyle.SINGLE,size:2,color:'AAB5C2'}, insideVertical:{style:BorderStyle.SINGLE,size:2,color:'AAB5C2'}
        }
      })
    );

    const doc = new Document({
      sections:[{
        properties:{
          page:{ size:{orientation:PageOrientation.LANDSCAPE}, margin:{top:500,right:400,bottom:500,left:400} }
        },
        children
      }]
    });

    const buffer = await Packer.toBuffer(doc);
    return new NextResponse(buffer, { headers:{
      'Content-Type':'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'Content-Disposition':'attachment; filename="plano-de-ensino-senai.docx"'
    }});
  } catch (e:any) {
    return NextResponse.json({ error:e?.message || 'Falha ao exportar DOCX.' }, { status:500 });
  }
}
