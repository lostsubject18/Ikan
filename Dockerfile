FROM node:24-alpine
LABEL net.unraid.docker.icon="https://raw.githubusercontent.com/lostsubject18/Ikan/main/unraid/icon.png" \
      org.opencontainers.image.source="https://github.com/lostsubject18/Ikan"
RUN apk add --no-cache su-exec
WORKDIR /app
COPY entrypoint.sh /usr/local/bin/ikan-entrypoint.sh
RUN chmod +x /usr/local/bin/ikan-entrypoint.sh
COPY server.js ./
COPY public ./public
ENV NODE_ENV=production DATA_DIR=/data PORT=3000 PUID=99 PGID=100
VOLUME /data
EXPOSE 3000
HEALTHCHECK --interval=30s --timeout=5s CMD node -e "fetch('http://127.0.0.1:3000/api/health').then(r=>process.exit(r.ok?0:1)).catch(()=>process.exit(1))"
ENTRYPOINT ["/usr/local/bin/ikan-entrypoint.sh"]
CMD ["node","--disable-warning=ExperimentalWarning","server.js"]
