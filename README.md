# Discord Bot com Luau

Bot de Discord feito para rodar no Railway. A conexão com o Discord é feita com `discord.js`, e a lógica dos comandos fica em arquivos `.luau`, executados pelo [Lune](https://github.com/lune-org/lune).

## O que já vem pronto

- Comando slash `/ping`
- Comando por prefixo `!ping`
- Pasta `commands/` para criar comandos em Luau
- `.env.example` com as variáveis necessárias
- `Dockerfile` para deploy no Railway

## Variáveis de ambiente

Crie as variáveis no Railway:

```env
DISCORD_TOKEN=token_do_seu_bot
DISCORD_CLIENT_ID=application_id_do_bot
DISCORD_GUILD_ID=id_do_servidor_para_teste
BOT_PREFIX=!
```

`DISCORD_GUILD_ID` é opcional, mas recomendado durante testes porque os comandos slash aparecem mais rápido no servidor escolhido.

## Como pegar os dados no Discord Developer Portal

1. Entre no Discord Developer Portal.
2. Crie uma aplicação.
3. Vá em **Bot** e crie o bot.
4. Copie o token e coloque em `DISCORD_TOKEN`.
5. Vá em **General Information** e copie o **Application ID** para `DISCORD_CLIENT_ID`.
6. Ative a intent **Message Content Intent** se quiser usar comandos com prefixo como `!ping`.

## Como convidar o bot para seu servidor

No OAuth2 URL Generator, marque:

Scopes:

- `bot`
- `applications.commands`

Bot Permissions:

- `Send Messages`
- `Read Message History`
- `Use Slash Commands`

## Como rodar localmente

Você precisa ter Node.js 20+ e Lune instalados.

```bash
npm install
cp .env.example .env
npm start
```

## Como criar um novo comando Luau

Crie um arquivo dentro de `commands/`. Exemplo: `commands/oi.luau`.

```luau
local process = require('@lune/process')

print(process.jsonEncode({
	content = 'Oi! Esse comando veio do Luau.'
}))
```

Depois, para usar por prefixo:

```txt
!oi
```

Para virar comando slash também, adicione ele em `src/index.js`, na lista `slashCommands`.

## Estrutura

```txt
.
├── commands/
│   └── ping.luau
├── src/
│   ├── index.js
│   └── luauRunner.js
├── .env.example
├── .gitignore
├── Dockerfile
├── package.json
└── README.md
```

## Observação importante

O token do bot nunca deve ir para o GitHub. Use somente variáveis de ambiente no Railway ou no arquivo `.env` local.
