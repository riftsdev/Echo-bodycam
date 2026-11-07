# ECHO — Operação Zero v2
FPS single player em HTML/JavaScript para PC e celular.

## GitHub Pages
Extraia bodycam-github-pages-v2.zip e envie o CONTEÚDO à raiz do repositório.
index.html, game.js, physics.mjs, style.css e assets/ devem ficar juntos.
Em Settings > Pages, selecione main e / (root). Aguarde a publicação e atualize a página.
Se aparecer o README, index.html não está na pasta que o Pages está publicando.

## Local
Com Python 3, execute dentro desta pasta:

    python3 -m http.server 8080

Abra http://localhost:8080. Não abra index.html via file://, pois o jogo usa módulos.
Para celular, use GitHub Pages/HTTPS ou o IP do PC na mesma rede com porta 8080.

## Controles
WASD mover, mouse mirar, clique esquerdo atirar, direito aproximar a mira,
R recarregar, F lanterna, Shift correr, Espaço saltar, Ctrl agachar, Esc pausar.
No celular: joystick esquerdo, deslize à direita para mirar. Botões R (recarga),
☼ (lanterna), ◎ (tiro), ↑ (salto) e ↓ (alternar agachamento).

## Novidades v2
- Projéteis com varredura contínua do trajeto e impacto na primeira superfície.
  A mesma geometria de colisão bloqueia tiros do jogador e dos inimigos.
- Inimigos com patrulha, animação de caminhada/corrida, navegação em grade ao redor
  de obstáculos, perseguição da última posição vista e movimento lateral em combate.
  Só atiram quando têm linha de visão; projéteis podem ser desviados com movimento.
- Simulação de física a 60 passos/s, gravidade, salto, aterrissagem, aceleração,
  atrito, colisão horizontal/vertical, plataformas e proteção contra atravessar paredes.
- Caixas de madeira empurráveis, cápsulas e fragmentos com gravidade e quique simples.
- Agachamento com altura real da colisão, recuo, marcas de impacto e queda animada.
- Arma 3D Kenney baixada (blaster estilizado), texturas de madeira, tijolo com relevo,
  metal e piso procedural, placas industriais e luminárias emissivas.
- Novos sons de tiro, tiro inimigo, impacto, cápsulas, ambiente, salto e aterrissagem.
  Volume de disparos inimigos e impactos varia com a distância.

Física simplificada com caixas de colisão (AABB); não é um motor completo de corpos
rígidos. Queda dos inimigos é animada, sem ragdoll. A arma é estilizada, não uma réplica realista.

## Validação
8 testes automatizados de balas/paredes, obstáculos finos, navegação, gravidade,
salto, teto, plataformas e caixas empurráveis passaram. Sintaxe, recursos GLB,
áudio WAV, referências locais e ZIP verificados. Testes visuais em navegador e
aparelhos físicos não disponíveis neste ambiente; desempenho móvel pode variar.

Créditos, fontes e licenças: assets/CREDITS.txt.
