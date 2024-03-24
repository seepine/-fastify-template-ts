# step1 build
FROM seepine/alpine:node as builder
WORKDIR /workspace
COPY package.json /workspace/package.json
RUN npm install
COPY ./ /workspace
RUN npm run build
RUN node docker/minify.js

# step2 copy
FROM seepine/alpine:node
WORKDIR /workspace
ENV MODE=prod
COPY --from=builder /workspace/dist /workspace
ENTRYPOINT crond && node app.js
