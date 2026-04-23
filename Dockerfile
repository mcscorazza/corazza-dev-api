FROM node:22-alpine

WORKDIR /app

# Copia os arquivos de dependências da raiz e da API
COPY package*.json ./
COPY apps/api/package*.json ./apps/api/
COPY apps/api/prisma ./apps/api/prisma/

# Instala as dependências e gera o Prisma Client
RUN npm install
RUN cd apps/api && npx prisma generate

# Copia o restante do código
COPY . .

EXPOSE 3000

CMD ["npm", "run", "dev", "--workspace=api"]