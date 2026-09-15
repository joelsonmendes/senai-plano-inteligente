# SENAI • Plano Inteligente V3 — Modo Ana

Ferramenta pessoal para criação de **Planos de Ensino SENAI por competências**, preparada para trabalhar com a sua assinatura do ChatGPT **sem OPENAI_API_KEY e sem cobrança separada de API**.

## Como funciona

1. Abra a ferramenta.
2. Envie o Plano de Curso em PDF/DOCX/TXT/Markdown.
3. Selecione ou digite a Unidade Curricular.
4. Informe a carga horária da UC e a duração de cada aula.
5. A ferramenta calcula automaticamente a quantidade de aulas.
6. Você pode:
   - criar um **rascunho local imediato**, sem IA; ou
   - clicar em **Copiar pedido para Ana**, colar o pedido no ChatGPT junto do Plano de Curso e receber um JSON inteligente.
7. Cole o JSON devolvido pela Ana na ferramenta.
8. Revise/edite cada aula.
9. Use a auditoria de cobertura, carga horária e rastreabilidade.
10. Exporte para **Word (.docx)**, **PDF** ou **JSON**.

## O que não precisa mais

- `OPENAI_API_KEY`
- `OPENAI_MODEL`
- conta de API
- cobrança adicional da API
- login ou banco de dados

## Recursos

- Cabeçalho institucional SENAI com a arte fornecida.
- Leitura local/servidor do Plano de Curso.
- Extração básica de Unidades Curriculares.
- Cálculo automático: `quantidade de aulas = carga da UC / carga por encontro`.
- Geração de rascunho local.
- Integração manual rápida com ChatGPT pelo botão **Copiar pedido para Ana**.
- Importação do JSON devolvido pelo ChatGPT.
- Situação de Aprendizagem.
- Plano de Aula com:
  - capacidades técnicas/básicas;
  - capacidades socioemocionais;
  - conhecimentos;
  - estratégia de ensino com passo a passo;
  - recursos e ambientes;
  - critérios de avaliação;
  - instrumentos de avaliação.
- Auditoria pedagógica.
- Edição manual completa.
- Salvamento local no navegador.
- Exportação Word/PDF/JSON.
- PWA instalável.

## Instalação local

Requer Node.js 20+.

```bash
npm install
npm run dev
```

Abra `http://localhost:3000`.

## GitHub

```bash
git init
git add .
git commit -m "SENAI Plano Inteligente V3 - Modo Ana"
git branch -M main
git remote add origin https://github.com/SEU-USUARIO/SEU-REPOSITORIO.git
git push -u origin main
```

## Vercel

1. Importe o repositório do GitHub na Vercel.
2. Clique em Deploy.
3. **Não precisa cadastrar nenhuma variável de ambiente.**

## Observação importante

A extração automática do arquivo usa regras locais para acelerar o fluxo. O botão **Modo Ana** existe justamente para fazer a interpretação pedagógica mais sofisticada dentro do ChatGPT, usando o Plano de Curso anexado na conversa.
