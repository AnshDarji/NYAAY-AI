# Build Stage
FROM python:3.12-slim AS builder

WORKDIR /app

# Install system dependencies needed for native packages
RUN apt-get update && apt-get install -y --no-install-recommends gcc python3-dev && rm -rf /var/lib/apt/lists/*

# Install python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir --prefix=/install -r requirements.txt

# Run Stage
FROM python:3.12-slim

WORKDIR /app

# Copy dependencies
COPY --from=builder /install /usr/local

# Copy application code
COPY . /app

# Set environments
ENV PYTHONPATH=/app
ENV PYTHONUNBUFFERED=1

EXPOSE 8000

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
