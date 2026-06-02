FROM node:20-bookworm-slim

WORKDIR /app

RUN apt-get update \
    && apt-get install -y --no-install-recommends curl unzip ca-certificates \
    && rm -rf /var/lib/apt/lists/*

# Instala o Lune, runtime que executa arquivos .luau fora do Roblox.
RUN curl -fsSL https://github.com/lune-org/lune/releases/latest/download/lune-linux-x86_64.zip -o /tmp/lune.zip \
    && unzip /tmp/lune.zip -d /tmp/lune \
    && mv /tmp/lune/lune /usr/local/bin/lune \
    && chmod +x /usr/local/bin/lune \
    && rm -rf /tmp/lune /tmp/lune.zip

COPY package*.json ./
RUN npm install --omit=dev

COPY . .

CMD ["npm", "start"]
