# SPEC — Riftbound Match Tracker

> Documento de especificação para desenvolvimento orientado a spec (spec driven development).
> Destinado a guiar implementação via Claude Code ou outra IA de desenvolvimento.

---

## 1. Visão geral

App mobile (Android + iOS) para jogadores de **Riftbound** (TCG físico da Riot Games) registrarem
suas próprias partidas, acompanharem estatísticas pessoais por Champion, e usarem um placar
digital para pontuar partidas em tempo real na mesa.

**O que o app NÃO é:** não simula, automatiza ou aplica regras do jogo. Não é um cliente digital
de Riftbound. É um diário de partidas + calculadora de placar manual.

### 1.1 Stack técnica

| Camada | Escolha | Motivo |
|---|---|---|
| Frontend | React Native + Expo | Multiplataforma, build iOS na nuvem via EAS sem precisar de Mac |
| Backend / DB | Supabase (Postgres + Auth + Storage) | Auth pronto (registro, confirmação por email, esqueci senha), Postgres relacional, Row Level Security nativo para dados privados por usuário |
| Dados de cartas/Champions | [Riftcodex](https://riftcodex.com) (`api.riftcodex.com`) | API REST aberta, gratuita, fan project não-oficial — não depende de aprovação da Riot |
| Distribuição | EAS Build + EAS Submit | Build e submit para App Store/Play Store na nuvem, direto do Windows |

### 1.2 Compliance com a política da Riot (Riftbound Digital Tools Policy)

Pontos de risco identificados e como a spec os trata — **ler antes de desenvolver**:

| Regra da Riot | Como o app cumpre |
|---|---|
| Proibido reter/publicar "metagame-defining data" (win rate por carta/deck, etc.) | Todas as estatísticas são **privadas por usuário** (RLS no Supabase). Nenhum dado agregado entre usuários é exposto, calculado publicamente ou exportado. |
| Proibido rank/ladder/leaderboard visível ao jogador | **Não existe** nenhuma tela de ranking, comparação entre usuários ou pontuação competitiva entre contas. Fora de escopo permanente, não só do MVP. |
| Proibido "automated rule enforcement" | O placar (Seção 5) é 100% manual — o usuário aperta botões pra incrementar pontos; o app não interpreta cartas, não aplica efeitos, não decide vencedor automaticamente além da contagem que o próprio usuário insere. |
| Apps não podem usar assets oficiais sem API key da Riot | App usa **somente** Riftcodex (dados de terceiros, não-oficiais). Nenhuma chamada à API oficial da Riot nesta versão. |
| App não pode alegar afiliação/endosso da Riot | Tela "Sobre" deve declarar claramente: app não-oficial, não afiliado/endossado pela Riot Games, dados de cartas via Riftcodex (fan project). |

⚠️ **Risco residual aceito conscientemente:** estatísticas pessoais por Champion (% vitória, etc.)
tecnicamente tocam a categoria "win rate por deck/carta" citada na política — mas como são
estritamente privadas, não publicadas e não comparáveis entre usuários, a leitura é de baixo risco.
Se a Riot futuramente clarificar que isso também é vedado, a mitigação é simplesmente nunca
agregar/expor esses dados além da própria conta do usuário (já é o design, não precisa de retrabalho).

---

## 2. Autenticação e perfil de usuário

### 2.1 Fluxos de auth (via Supabase Auth)

- **Registro**: nome, email, senha, nickname (nick) → envia email de confirmação
- **Confirmação de email**: link recebido por email ativa a conta
- **Login**: email + senha
- **Esqueci minha senha**: fluxo de reset via email (link com token)
- **Logout**

### 2.2 Perfil do usuário

Campos editáveis na tela de Perfil:
- Nome
- Email
- Nick
- **Champion favorito** (selecionado entre os Champions disponíveis via Riftcodex) — exibido em destaque no topo do perfil e/ou da tela de Champions

### 2.3 Modelo de dados — `profiles`

| Campo | Tipo | Observação |
|---|---|---|
| `id` | uuid (PK, = auth.users.id) | |
| `name` | text | |
| `nickname` | text | unique |
| `favorite_champion_id` | text (FK lógica → cache de champions) | nullable |
| `created_at` | timestamptz | |

---

## 3. Catálogo de Champions (dados externos)

### 3.1 Fonte de dados

API: `https://api.riftcodex.com/api/cards?...`

O app consulta a Riftcodex para popular a lista de Champions disponíveis (nome, imagem, domínio,
set). **Decisão de implementação a validar na fase de desenvolvimento:** fazer cache local
(tabela própria no Supabase, sincronizada periodicamente) em vez de chamar a API externa a cada
tela, para:
- Reduzir dependência de uptime de terceiros
- Permitir funcionamento offline parcial
- Evitar rate limit

### 3.2 Modelo de dados — `champions_cache`

| Campo | Tipo | Observação |
|---|---|---|
| `id` | text (PK) | id vindo da Riftcodex |
| `name` | text | |
| `domain` | text | Body / Calm / Chaos / Fury / Mind / Order / Colorless |
| `image_url` | text | |
| `set_code` | text | |
| `synced_at` | timestamptz | última sincronização |

> Nota: confirmar na implementação se a Riftcodex distingue claramente "cartas tipo Champion" via
> campo `type`/`rarity` — pelos exemplos coletados, cartas têm campo `type` (ex: "Champion", "Unit",
> "Battlefield", "Spell"). Filtrar por `type=Champion` ao popular este cache.

---

## 4. Registro de partidas (Match Log)

Esta é a funcionalidade central do app. Fluxo de criação de uma partida:

### 4.1 Passo a passo do formulário

1. **Modo da partida**: `1v1` ou `2v2`
2. **Formato**: `Melhor de 1 (Bo1)` ou `Melhor de 3 (Bo3)`
3. **Data da partida**: date picker
4. **Meu(s) Champion(s)**:
   - 1v1 → seleciona 1 Champion (próprio)
   - 2v2 → seleciona 1 Champion (próprio) + indica o Champion do parceiro de dupla (campo informativo, não precisa ser conta cadastrada)
5. **Champion(s) do(s) oponente(s)**:
   - Seletor com opção de definir **quantos oponentes mostrar** (1 para 1v1; 2 para 2v2)
   - Mostra "Champion mais usado pelos oponentes" como atalho/sugestão (calculado a partir do próprio histórico do usuário contra aquele nick/oponente, se aplicável — ver 4.4)
6. **Resultado por game** — comportamento dinâmico:
   - Se Bo1 → mostra apenas **Game 1**: resultado (Vitória / Empate / Derrota)
   - Se Bo3 → mostra **Game 1** e **Game 2**:
     - Se Game 1 e Game 2 tiverem resultados diferentes (ex: 1 vitória, 1 derrota) → libera automaticamente o **Game 3**
     - Se Game 1 e Game 2 já definirem o vencedor (ex: 2 vitórias seguidas) → Game 3 não aparece
   - Cada game individual registra: resultado (Vitória/Empate/Derrota)
7. **Tipo de torneio** (select fixo):
   - Jogo Casual
   - Nexus Nights
   - Summoner's Skirmish
   - Regional Qualifier
   - Regional Championship
   - World Championship
   - Custom Tournament
8. **Observações**: campo de texto livre, opcional

### 4.2 Resultado consolidado da partida

Calculado automaticamente a partir dos resultados dos games (ex: 2-1, 2-0, 1-1 em Bo3 com empate,
1-0 em Bo1) — armazenado junto pra facilitar relatórios sem precisar recalcular sempre.

### 4.3 Modelo de dados — `matches`

| Campo | Tipo | Observação |
|---|---|---|
| `id` | uuid (PK) | |
| `user_id` | uuid (FK → profiles) | RLS: só o dono vê |
| `mode` | enum (`1v1`, `2v2`) | |
| `match_format` | enum (`bo1`, `bo3`) | |
| `match_date` | date | |
| `my_champion_id` | text (FK → champions_cache) | |
| `partner_champion_id` | text (FK → champions_cache) | nullable, só 2v2 |
| `opponent_champion_ids` | text[] | 1 ou 2 ids dependendo do modo |
| `tournament_type` | enum | ver lista 4.1.7 |
| `notes` | text | nullable |
| `final_result` | enum (`win`, `draw`, `loss`) | derivado dos games |
| `score_summary` | text | ex: "2-1", "1-0" |
| `created_at` | timestamptz | |

### 4.4 Modelo de dados — `match_games`

| Campo | Tipo | Observação |
|---|---|---|
| `id` | uuid (PK) | |
| `match_id` | uuid (FK → matches) | |
| `game_number` | int | 1, 2 ou 3 |
| `result` | enum (`win`, `draw`, `loss`) | |

---

## 5. Relatórios e estatísticas

### 5.1 Tela "Champions" (lista geral)

Lista todos os Champions que o usuário já jogou, cada item exibindo:
- Nome / imagem do Champion
- % de vitórias
- Total de vitórias / derrotas / empates
- Número de vezes jogado (volume)
- Indicador se é o Champion mais jogado no geral

### 5.2 Tela de detalhe por Champion

Ao clicar em um Champion da lista, exibir:
- Estatísticas gerais (vitórias, derrotas, empates, % vitória, total de partidas)
- Performance jogando **primeiro** vs jogando **segundo** (quem inicia a partida)
- Cruzamento: contra quais Champions adversários o usuário tem mais dificuldade (menor win rate)
- Cruzamento: contra quais Champions adversários o usuário vai melhor (maior win rate)
- Filtro opcional por tipo de torneio

> Todas as estatísticas desta seção são calculadas **apenas sobre os dados do próprio usuário**
> (ver Seção 1.2 sobre compliance).

### 5.3 Consulta de dados

Estas telas são views/queries sobre `matches` + `match_games`, sem necessidade de tabelas
adicionais — calculadas em tempo real (ou cacheadas client-side) a partir do histórico do usuário.

---

## 6. Placar / Contador de pontos (Match Counter)

Tela separada e independente do registro de partidas (conforme decisão de escopo) — funciona como
uma calculadora de placar pra usar durante o jogo físico na mesa, sem gerar registro automático.

### 6.1 Funcionalidades

- Configuração inicial: `1v1` ou `2v2`, `Bo1` ou `Bo3`
- Seleção de skin/avatar e fundo de runa (customização visual, sem impacto em regra)
- Dois contadores de pontos (jogador embaixo, oponente em cima — layout tipo "frente a frente" de
  mesa física)
- Botão de incrementar ponto por jogador (manual — usuário decide quando pontuar, sem qualquer
  lógica automática de regra do jogo)
- Barra de progresso lateral por jogador, refletindo proximidade da vitória
- Reset de partida

### 6.2 Sem persistência obrigatória

Por ser independente do Match Log, este placar pode (e deve, no MVP) funcionar **apenas em memória
local** durante a sessão de uso — sem gravar no banco. Isso simplifica o MVP e evita qualquer
ambiguidade com a política de "automated rule enforcement" (é uma calculadora burra, não um motor
de jogo).

---

## 7. Navegação (estrutura de menu)

Bottom tab navigation com (sugestão inicial, ajustável):

1. **Jogar** — tela do Placar/Contador (Seção 6)
2. **Partidas** — histórico + formulário de novo registro (Seção 4)
3. **Champions** — lista e detalhes de estatísticas (Seção 5)
4. **Perfil** — dados do usuário, Champion favorito (Seção 2.2)

---

## 8. Fora de escopo do MVP (explicitamente)

- Qualquer leaderboard, ranking ou comparação entre usuários
- Integração com API oficial da Riot (exigiria aplicação e aprovação de API key)
- Persistência do placar ao vivo como registro de partida automático
- Multiplayer real (parceiro de dupla com conta própria vinculada)
- Modo offline completo (fora do cache de Champions)

---

## 9. Itens em aberto para a próxima fase

- [ ] Confirmar estrutura exata de resposta da API Riftcodex (`type`, `domain`, paginação) com uma
      chamada real antes de codar a integração
- [ ] Definir se `champions_cache` sincroniza automaticamente (cron/edge function no Supabase) ou
      manualmente
- [ ] Definir paleta visual, tipografia e identidade do app (tema Riftbound/League, mas sem usar
      assets oficiais não-licenciados)
- [ ] Confirmar nome do app e disponibilidade nas lojas
- [ ] Redigir o texto da tela "Sobre" com a declaração de não afiliação à Riot

---

## 10. Próximos passos sugeridos

1. Validar este documento (ajustes de escopo, nomes de campos, fluxos)
2. Quebrar em tickets/etapas menores (ex: setup do projeto → auth → catálogo de champions → match
   log → relatórios → placar → polish)
3. Usar este arquivo como contexto inicial para o Claude Code, alimentando uma etapa por vez
