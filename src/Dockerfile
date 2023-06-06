FROM node:18-buster
WORKDIR /app
ENV NODE_OPTIONS="--max_old_space_size=4096 --enable-source-maps"
COPY . .
RUN yarn install
EXPOSE ${SERVER_PORT}
CMD ["yarn", "start"]
