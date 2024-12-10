FROM madnificent/ember:5.4.1 as builder

LABEL maintainer="info@redpencil.io"

WORKDIR /app
COPY package.json .
RUN npm install
COPY . .
RUN npm run build

FROM semtech/static-file-service:0.2.0

COPY proxy/compression.conf /config/compression.conf
COPY --from=builder /app/dist /data
