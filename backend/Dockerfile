# ----------------------------------------------------------------------
# ÉTAPE 1 : CONSTRUCTION (Installation des dépendances)
# ----------------------------------------------------------------------
FROM python:3.11-slim AS builder

# Définir l'environnement pour les variables Python
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

# Définir le répertoire de travail
WORKDIR /usr/src/app

# Installer les dépendances système nécessaires pour certaines librairies Python (ex: psycopg2)
RUN apt-get update && apt-get install -y --no-install-recommends \
    gcc \
    postgresql-client \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

# Copier les dépendances Python et les installer
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# ----------------------------------------------------------------------
# ÉTAPE 2 : PRODUCTION (Image finale allégée)
# ----------------------------------------------------------------------
FROM python:3.11-slim AS production

# Définir l'environnement
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

# Créer un utilisateur non-root pour des raisons de sécurité
RUN adduser --disabled-password --no-create-home django_user
WORKDIR /usr/src/app

# Copier les dépendances installées depuis l'étape 'builder'
COPY --from=builder /usr/local/lib/python3.11/site-packages /usr/local/lib/python3.11/site-packages

# Copier le code source de l'application
COPY . .

# Définir le port sur lequel l'application s'exécute (Gunicorn par défaut)
EXPOSE 8000

# Changer l'utilisateur pour l'utilisateur non-root créé
USER django_user

# Commande de démarrage
# Nous utilisons Gunicorn pour servir l'application de manière robuste en production.
# Assurez-vous que 'mon_projet.wsgi' est le chemin correct vers votre fichier WSGI.
CMD ["gunicorn", "--bind", "0.0.0.0:8000", "mon_projet.wsgi:application"]