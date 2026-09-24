**# Castelo Consig — Site institucional**

Site institucional inspirado na estrutura da referência (vipfinanceira.com.br), redesenhado com identidade própria: visual moderno em **\*\*azul ciano, preto, cinza e branco\*\***, com animações contínuas (ondas, faíscas e elementos flutuantes) e uma animação característica em cada seção. Focado em conversão via **\*\*WhatsApp\*\***, com botões adicionais para **\*\*Instagram\*\*** e **\*\*e-mail\*\***.

\> ⚠️ **\*\*Este projeto usa um nome fictício ("Castelo Consig") e dados de contato de exemplo.\*\*** Nenhum nome de empresa, número de WhatsApp, Instagram ou e-mail reais foram informados no pedido — troque tudo antes de publicar. A seção [Personalização]\(#personalização-obrigatória-antes-de-publicar) explica exatamente onde.

\---

**## 1. Estrutura de arquivos**

\`\`\`

projeto/

├── index.html          → estrutura e conteúdo da página

├── style.css            → todo o CSS (design system + animações)

├── script.js             → toda a lógica JS (interações + segurança)

├── README.md             → esta documentação

└── imagens/               → todas as imagens usadas no site (veja seção 4)

    ├── logo.svg

    ├── favicon.svg

    ├── hero-banner.jpg

    ├── sobre-banner.jpg

    ├── solucoes-image.jpg

    ├── servico-1.jpg

    ├── servico-2.jpg

    ├── servico-3.jpg

    ├── avatar-1.png

    ├── avatar-2.png

    ├── avatar-3.png

    ├── parceiro-1.png

    ├── parceiro-2.png

    ├── parceiro-3.png

    └── parceiro-4.png

\`\`\`

Os 4 arquivos ficam **\*\*na raiz do projeto\*\***, junto com a pasta \`imagens/\`. Não mova nem renomeie a pasta — os caminhos no HTML/CSS apontam para \`imagens/...\` de forma relativa.

Para rodar localmente, basta abrir \`index.html\` no navegador, ou servir a pasta com qualquer servidor estático (recomendado, para o \`fetch\`/CSP funcionarem exatamente como em produção):

\`\`\`bash

\# Python

python3 -m http.server 8080

\# Node

npx serve .

\`\`\`

\---

**## 2. Sequência de seções (mesma "espinha dorsal" do site de referência)**

\| # | Seção | Animação característica |

\|---|-------|--------------------------|

\| 1 | Header / navegação | Fundo com blur ao rolar; sublinhado animado nos links |

\| 2 | Hero | Ondas duplas em looping constante + camada de faíscas + imagem flutuante |

\| 3 | Faixa de estatísticas | Contadores numéricos animados ao entrar na tela |

\| 4 | Sobre nós | Reveal suave da imagem/texto ao rolar |

\| 5 | Diferenciais (cards) | Entrada escalonada (stagger) + glow/elevação no hover |

\| 6 | Soluções | Checklist com itens surgindo em sequência (da esquerda) |

\| 7 | Serviços (cards) | Zoom da imagem + borda gradiente animada no hover |

\| 8 | Depoimentos | Carrossel com autoplay, arraste e estrelas "piscando" |

\| 9 | Parceiros | Esteira (marquee) horizontal infinita dos logos |

\| 10 | FAQ / CTA | Ícone com pulso de glow contínuo |

\| 11 | Rodapé | Onda espelhada + redes sociais |

\| — | Botão flutuante (FAB) | WhatsApp com pulso constante; abre opções de Instagram/E-mail |

Além disso, uma camada **\*\*global e contínua\*\*** de ondas (SVG, baixa opacidade) e faíscas (canvas) roda por trás de todo o conteúdo, do topo ao rodapé — é a resposta direta ao pedido de "animações constantes na página".

Todas as animações contínuas respeitam \`prefers-reduced-motion\` (usuários que pedem menos animação no sistema operacional recebem a versão estática, sem perda de conteúdo).

\---

**## 3. Personalização obrigatória antes de publicar**

**### 3.1 Contatos (WhatsApp, Instagram, e-mail)

Os contatos atualmente configurados no `script.js` são:

```js
const CONFIG = Object.freeze({
  whatsappNumber: "5588988785553", // DDI + DDD + número, só dígitos
  instagramUser: "castelo_consig",  // usuário do Instagram, sem "@"
  contactEmail: "mcpromotora86@gmail.com",
});
```

Todos os botões que usam as classes `.js-whatsapp-link`, `.js-instagram-link` e `.js-email-link`
partem dessa configuração centralizada. As mensagens pré-preenchidas de cada botão de WhatsApp
podem ser editadas diretamente no `index.html`, no atributo `data-wa-message`.

Os redirecionamentos finais podem ser ajustados posteriormente sem alterar a estrutura geral da página.

### 3.2 Nome da empresa e textos institucionais

A marca utilizada atualmente é **Castelo Consig**.

Antes de publicar, revise:

- `<title>` e `<meta name="description">` no `<head>`;
- textos institucionais, números e informações históricas da empresa;
- o texto final do parágrafo de disclaimer legal no rodapé (`.footer__disclaimer`);
- links de "Política de Privacidade" e "Termos de Uso", atualmente reservados para configuração posterior.

### 3.3 Cores da marca

A identidade visual atual da Castelo Consig é baseada principalmente em **azul-marinho e dourado**,
com branco e tons neutros para equilíbrio e legibilidade.

As cores estão centralizadas nas variáveis CSS no topo de `style.css` (bloco `:root`). Os valores
podem ser ajustados conforme a versão final da identidade visual.

```css
--navy: #0b2345;       /* azul-marinho principal */
--gold: #d4af5a;       /* dourado principal */
--gold-dark: #b88f35;  /* dourado secundário */
--paper: #f7f7f5;      /* fundo claro */
--ink: #17202a;        /* texto escuro */
```

---


**## 4. Mapa de imagens — o que trocar e onde**

Todas as imagens já existem na pasta \`imagens/\` como **\*\*placeholders gerados\*\*** (fundo escuro com ondas/faíscas em ciano e um rótulo indicando o que deve entrar ali), para o site funcionar 100% assim que você abrir. Troque cada arquivo mantendo **\*\*o mesmo nome e formato\*\***, ou, se usar outro nome, atualize o \`src\` correspondente em \`index.html\`.

\| Arquivo | Usado em | Tamanho recomendado | Formato | Observação |

\|---|---|---|---|---|

\| \`logo.svg\` | Cabeçalho e rodapé | 260×60 (vetorial) | SVG | Logo com fundo transparente, versão clara (para fundo escuro) |

\| \`favicon.svg\` | Aba do navegador | 64×64 (vetorial) | SVG | Ícone simplificado da marca |

\| \`hero-banner.jpg\` | Seção Hero (imagem principal) | 1200×1300px | JPG/WEBP | Foto de cliente/atendimento, orientação retrato |

\| \`sobre-banner.jpg\` | Seção "Sobre nós" | 1000×1200px | JPG/WEBP | Foto da equipe ou escritório |

\| \`solucoes-image.jpg\` | Seção "Soluções" | 900×900px | JPG/WEBP | Imagem quadrada, ilustrativa das soluções |

\| \`servico-1.jpg\` | Card "Antecipação do FGTS" | 700×500px | JPG/WEBP | Proporção 4:3 |

\| \`servico-2.jpg\` | Card "Crédito consignado" | 700×500px | JPG/WEBP | Proporção 4:3 |

\| \`servico-3.jpg\` | Card "Consignado para CLT" | 700×500px | JPG/WEBP | Proporção 4:3 |

\| \`avatar-1.png\` | Depoimento 1 / pilha de avatares no hero | 160×160px | PNG (fundo transparente) | Foto circular do cliente |

\| \`avatar-2.png\` | Depoimento 2 / pilha de avatares no hero | 160×160px | PNG (fundo transparente) | Foto circular do cliente |

\| \`avatar-3.png\` | Depoimento 3 / pilha de avatares no hero | 160×160px | PNG (fundo transparente) | Foto circular do cliente |

\| \`parceiro-1.png\` a \`parceiro-4.png\` | Esteira "Nossos parceiros" | 300×120px | PNG (fundo transparente) | Logos das instituições parceiras reais |

**\*\*Dica de performance:\*\*** prefira \`.webp\` para fotos (mantendo o mesmo nome de arquivo, só trocando a extensão e o \`src\` correspondente); o peso final impacta diretamente o tempo de carregamento em conexões móveis, que é o público típico desse tipo de site.

\---

**## 5. Lógica de segurança implementada (\`script.js\`)**

Como este é um site estático (sem backend próprio neste entregável), a "segurança" aqui está nas boas práticas de front-end que evitam os problemas mais comuns desse tipo de página:

\- **\*\*Sem HTML dinâmico não sanitizado\*\***: nenhuma inserção usa \`innerHTML\` com dados variáveis; o helper \`sanitizeText()\` usa \`textContent\` para neutralizar qualquer tentativa de injeção.

\- **\*\*Links externos protegidos\*\***: todo link que abre em nova aba (WhatsApp, Instagram) recebe \`rel="noopener noreferrer"\` automaticamente — impede que a página de destino tenha acesso a \`window\.opener\` (proteção contra *\*reverse tabnabbing\**) e evita vazar o \`Referer\`.

\- **\*\*Sanitização de dados usados em URLs\*\***: o número de WhatsApp passa por \`onlyDigits()\` e a mensagem por \`encodeURIComponent()\` antes de compor o link \`wa.me\`, evitando que caracteres inesperados quebrem a URL.

\- **\*\*Content-Security-Policy\*\***: meta tag no \`\<head>\` do \`index.html\` restringe de onde a página pode carregar scripts, estilos e fontes (\`script-src 'self'\`, sem scripts de terceiros). Ajuste o domínio se for hospedar fontes/scripts externos além do Google Fonts já usado.

\- **\*\*Formulário de newsletter com proteção anti-spam básica\*\***: campo *\*honeypot\** invisível (se preenchido, o envio é bloqueado — só bots preenchem campos ocultos), limite de tempo entre envios (*\*anti-flood\** no cliente) e validação de e-mail antes de qualquer chamada de rede. **\*\*Importante:\*\*** hoje o formulário não envia dados a lugar nenhum (não há backend); o ponto de integração está isolado na função \`submitToBackend()\`, pronto para você plugar seu endpoint. Toda validação real de segurança (rate limit, anti-spam, sanitização) deve ser refeita no servidor — validação client-side nunca é suficiente sozinha.

\- **\*\*Sem variáveis globais\*\***: todo o \`script.js\` roda dentro de um único IIFE em modo estrito, reduzindo o risco de colisão/contaminação por outros scripts.

\- **\*\*Animações com custo controlado\*\***: o canvas de faíscas usa \`requestAnimationFrame\`, é pausado quando a aba fica oculta (\`visibilitychange\`) e reage a redimensionamento com \`debounce\` — evita gasto desnecessário de CPU/bateria, que também é uma forma de robustez do site.

\- **\*\*Acessibilidade como parte da segurança de uso\*\***: foco visível em todos os elementos interativos, \`aria-expanded\`/\`aria-label\` nos controles (menu, FAB, carrossel), e respeito total a \`prefers-reduced-motion\`.

\---

**## 6. Organização do CSS (\`style.css\`)**

O arquivo é dividido em 20 blocos numerados e comentados, nesta ordem: Tokens (design system da Castelo Consig) → Reset → Base → Utilitários → Ambiente animado global → Header/Nav → Hero → Stats → Sobre → Diferenciais → Soluções → Serviços → Depoimentos → Parceiros → FAQ → Rodapé → FAB → Keyframes → Responsivo → Acessibilidade. Todas as cores, espaçamentos e fontes usam variáveis CSS (\`:root\`), então qualquer ajuste de marca é feito em um só lugar (ver seção 3.3).

\---

**## 7. Checklist antes de publicar**

\- [ ] Trocar \`whatsappNumber\`, \`instagramUser\` e \`contactEmail\` em \`script.js\`

\- [ ] Substituir todas as imagens em \`imagens/\` pelas fotos/logos reais (mesmos nomes e tamanhos da tabela)

\- [ ] Substituir "Castelo Consig" pelo nome real da empresa em \`index.html\`

\- [ ] Revisar com o jurídico o texto de disclaimer no rodapé

\- [ ] Atualizar os links de Política de Privacidade e Termos de Uso

\- [ ] Testar em mobile (menu, FAB, carrossel de depoimentos por arraste)

\- [ ] Testar com "reduzir movimento" ativado no sistema operacional




listando os parceiros 
c6
finanto
qualibank
happy
BRB
facta
BMG
daycoval
