# RAG Pipeline - Development Guide

## Prerequisites

* Node.js 22+
* Docker
* Colima
* Docker Compose

---

# Start Colima

```bash
colima start --cpu 8 --memory 16 --disk 100
```

Verify:

```bash
colima status
```

---

# Start the application services

```bash
docker compose up -d
```

Check running containers:

```bash
docker compose ps
```

or

```bash
docker ps
```

---

# Stop the services

```bash
docker compose down
```

---

# View logs

### Ollama

```bash
docker logs ollama
```

### Chroma

```bash
docker logs chroma
```

---

# Ollama Commands

## List installed models

```bash
docker exec -it ollama ollama list
```

## Pull a model

Example:

```bash
docker exec -it ollama ollama pull qwen3:14b
```

Embedding model:

```bash
docker exec -it ollama ollama pull nomic-embed-text
```

## Running models

```bash
docker exec -it ollama ollama ps
```

---

# Chroma

Runs on:

```
http://localhost:8000
```

Backend configuration:

```javascript
new ChromaClient({
  host: "localhost",
  port: 8000,
  ssl: false,
});
```

---

# Ollama

Runs on:

```
http://localhost:11435
```

Backend configuration:

```javascript
const BASE_URL = "http://localhost:11435";
```

---

# Current Models

### Chat

```
qwen3:14b
```

### Embeddings

```
nomic-embed-text
```

---

# Docker Volumes

### Chroma

```
chroma-data
```

Stores:

* Vector embeddings
* Documents
* Collection data

### Ollama

```
ollama-data
```

Stores:

* Downloaded models
* Model cache

Volumes persist even if containers are recreated.

---

# Project Architecture

```
                +----------------------+
                |     Evaluator        |
                +----------+-----------+
                           |
                           v
                +----------------------+
                | Embedding Pipeline   |
                +----------+-----------+
                           |
                 +---------+---------+
                 |                   |
                 v                   v
         Ollama Embedding      Chroma Vector Store
              Model                 |
                                    |
                              Chroma Database
```

---

# Docker Compose Services

Current services:

* ChromaDB
* Ollama

Future services:

* Backend
* Redis (optional)

---

# Common Issues

## Chroma not reachable

Verify:

```bash
docker ps
```

Ensure Chroma is running on port `8000`.

---

## Ollama returns HTTP 500

Check logs:

```bash
docker logs ollama
```

Common causes:

* Insufficient Colima memory
* Model not installed
* Incorrect model name

---

## Model not found

Verify installed models:

```bash
docker exec -it ollama ollama list
```

---

## Containers are not running

Restart:

```bash
docker compose up -d
```

---

# Useful Docker Commands

List containers:

```bash
docker ps
```

List all containers:

```bash
docker ps -a
```

List volumes:

```bash
docker volume ls
```

Inspect a volume:

```bash
docker volume inspect chroma-data
```

Execute a command inside a container:

```bash
docker exec -it <container-name> <command>
```

---

# Current Development Roadmap

## ✅ V1

* Chunking
* Embeddings
* InMemoryVectorStore
* Evaluator

## ✅ V2

* ChromaDB
* Docker
* Docker Compose
* Ollama
* Dedicated Embedding Model

## 🚧 V3

* PDF Extraction
* Metadata
* Metadata Filtering
* Improved Retrieval
* Better Evaluation

## 📌 Future

* Backend Dockerization
* Redis
* Production Configuration
* Deployment
