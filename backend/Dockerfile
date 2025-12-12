# -------------------------
# Stage 1 - Build packages
# -------------------------
FROM python:3.11-slim-bookworm AS builder

WORKDIR /app

RUN apt-get update \
    && apt-get install -y --no-install-recommends \
        gcc \
        libpq-dev \
        libjpeg-dev \
        zlib1g-dev \
        libxml2-dev \
        libxslt1-dev

COPY requirements.txt /app/
RUN pip install --prefix=/install --no-cache-dir -r requirements.txt


# -------------------------
# Stage 2 - Final image
# -------------------------
FROM python:3.11-slim-bookworm

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1
ENV PORT=8000

WORKDIR /app

# copy installed python packages
COPY --from=builder /install /usr/local

# copy project files
COPY . /app/

EXPOSE 8000

CMD ["gunicorn", "--bind", "0.0.0.0:8000", "backend.wsgi:application"]
