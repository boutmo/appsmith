FROM node:14

LABEL maintainer="boutora.mohamed@yahoo.fr"

WORKDIR /app

COPY package.json yarn.lock dist/* ./

RUN yarn install --frozen-lockfile

EXPOSE 8091

CMD ["node", "--require", "source-map-support/register", "server.js"]
