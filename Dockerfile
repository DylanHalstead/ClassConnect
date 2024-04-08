FROM node:20-bookworm as builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . ./
# Increase the memory limit for the build; otheriwse JS heap out of memory error
ARG SECRET_DB_HOST 
ARG SECRET_DB_PORT
ARG SECRET_DB_NAME
ARG SECRET_DB_USER
ARG SECRET_DB_PASSWORD
ARG SECRET_GCP_CLIENT_ID
ARG SECRET_GCP_CLIENT_SECRET
ARG SECRET_DB_SSL
ARG SECRET_NODE_ENV
ENV NODE_OPTIONS=--max_old_space_size=4096 \
  SECRET_DB_HOST=$SECRET_DB_HOST \
  SECRET_DB_PORT=$SECRET_DB_PORT \
  SECRET_DB_NAME=$SECRET_DB_NAME \
  SECRET_DB_USER=$SECRET_DB_USER \
  SECRET_DB_PASSWORD=$SECRET_DB_PASSWORD \
  SECRET_GCP_CLIENT_ID=$SECRET_GCP_CLIENT_ID \
  SECRET_GCP_CLIENT_SECRET=$SECRET_GCP_CLIENT_SECRET \
  SECRET_DB_SSL=$SECRET_DB_SSL \
  SECRET_NODE_ENV=$SECRET_NODE_ENV
RUN npm run build
RUN npm prune --omit=dev


FROM node:20-alpine as runner
WORKDIR /app
COPY --from=builder /app/build build/
COPY --from=builder /app/node_modules node_modules/
COPY package.json .
EXPOSE 3000
# development, production
ENV NODE_ENV=$SECRET_NODE_ENV
CMD [ "node", "build" ]