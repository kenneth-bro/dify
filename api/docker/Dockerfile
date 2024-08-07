# base image
FROM kennethcse/dify-base-api:latest AS base

EXPOSE 5001

# set timezone
ENV TZ=UTC

# Copy source code
COPY . /app/api/

# Copy entrypoint
COPY docker/entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

ENTRYPOINT ["/bin/bash", "/entrypoint.sh"]