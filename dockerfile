FROM python:3.11-slim
WORKDIR /app
COPY requirements.txt .
RUN apt-get update && \
    apt-get upgrade -y && \
    apt-get install -y --no-install-recommends gcc build-essential && \
    rm -rf /var/lib/apt/lists/*

# Actualiza pip, instala dependencias y elimina caché de instalación
RUN pip install --upgrade pip && \
    pip install -r requirements.txt && \
    pip cache purge

COPY . .
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]