# Fps Ranking API

API desenvolvida em NestJS para processamento de logs de partidas, geração de estatísticas e rankings de jogadores.

---

## Funcionalidades

- Upload e processamento de arquivos de log de partidas de FPS
- Interpretação de eventos:
  - início e fim de partida
  - kills
  - world kills
- Persistência de dados normalizados
- Ranking por partida
- Ranking global
- Estatísticas por jogador:
  - kills
  - deaths
  - score
  - maior sequência de frags (kill streak)
- Sistema de awards:
  - NoDeathAward — jogador venceu a partida sem morrer
  - SpeedKillerAward — 5 frags em até 1 minuto
- Documentação via Swagger
- Autenticação simples via Bearer Token
- Setup automatizado com Docker

---

## Tecnologias

- Node.js
- NestJS
- TypeORM                                                                                                                                                                                                                     
- PostgreSQL
- Docker / Docker Compose
- Swagger (OpenAPI)

---

## Autenticação

A API é protegida por um Bearer Token estático, configurado via variável de ambiente.

## Como rodar o projeto

### Pré-requisitos
- Docker
- Docker Compose

---

### Clonar o repositório

```bash
git clone <repo-url>
cd <repo-name>
```

### Configurar variáveis de ambiente com base no .example.env
```bash
cp .env.example .env
```

### Subir a aplicação
```bash
docker compose up --build
```

### A aplicação estará disponível em:
 
API: https://fps-ranking-api.onrender.com

### Documentação (Swagger)

A documentação interativa da API está disponível em:
https://fps-ranking-api.onrender.com/api/docs

### Exemplo de log suportado

```
23/04/2019 15:34:22
New match 11348965 has started
23/04/2019 15:36:04
Roman killed Nick using M16
23/04/2019 15:36:33
<WORLD> killed Nick by DROWN
23/04/2019 15:39:22
Match 11348965 has ended
```

