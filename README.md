# 💸 Wallet API (Backend)

---

## 🇺🇸 English

Virtual wallet API built with Node.js, TypeScript and Prisma, focused on backend best practices such as clean architecture, testing, and scalable REST API design.

---

## 🚀 Objective

This project simulates a digital wallet system where users can register, authenticate, and operate with a balance system.

It is designed as a solid backend foundation to evolve into more complex systems, including concurrency handling and future blockchain integration.

---

## 🧱 Tech Stack

* Node.js (v22 LTS – Dockerized)
* TypeScript
* Express
* PostgreSQL
* Prisma ORM
* JWT (authentication)
* Docker
* Jest + Supertest (testing)

---

## 🔑 Current Features

* User registration
* JWT authentication (in progress)
* DTO validation
* Centralized error handling
* Endpoint testing (HTTP level)
* Modular architecture (controller / service)

---

## 🔜 Upcoming Features

* User-to-user transfers
* Balance system
* Transaction history
* Concurrency handling (race conditions)
* Role-based authorization
* Full Clean Architecture refactor
* Smart contract integration (blockchain)

---

## 📌 Technical Focus

* Clean and maintainable code
* Separation of concerns
* Consistent validation and error handling
* Real endpoint testing (no mocks)
* Backend scalability

---

## ⚙️ Prerequisites

* Docker (Docker Desktop or Docker Engine)
* Docker Compose
* Node.js v22 LTS (only if running outside Docker)
* npm
* Git

### 🪟 Windows Users

Recommended setup:

* WSL2 (Windows Subsystem for Linux)
* Ubuntu or similar Linux distro

Run the project inside WSL for best compatibility.

---

## ⚙️ Quick Start (Docker - Recommended)

### 1. Clone repository

```bash
git clone <repo>
cd VirtualWalletAPI
```

---

### 2. Run development environment

```bash
npm run start:dev
```

⚠️ First time only (Linux users):

```bash
sudo usermod -aG docker $USER
newgrp docker
```

👉 This command will:

* Build containers
* Start PostgreSQL
* Start API
* Run Prisma migrations
* Auto-create `.env` if missing

---

### 3. API ready at:

```
http://localhost:8080
```

---

### 🛑 Stop containers

```bash
npm run docker:down:dev
```

---

## 🏭 Production Mode

```bash
npm run start:prod
```

Runs optimized production build + Prisma migrations (`migrate deploy`)

---

## ⚙️ Environment Variables

Example `.env`:

```env
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/wallet
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRES_IN=3600
PORT=8080
```

---

## 🧪 Testing

```bash
npm run test
```

Includes:

* Jest
* Supertest
* Real database testing

---

## 🧑‍💻 Development Workflow

1. Start environment

```bash
npm run start:dev
```

2. Develop inside `src/`

3. Run migrations (if schema changes)

```bash
docker exec -it wallet-api-dev npx prisma migrate dev
```

4. Inspect database (optional)

```bash
npm run studio
```

---

## 🛠️ Troubleshooting

### Docker permission denied

```bash
sudo usermod -aG docker $USER
newgrp docker
```

---

### Docker compose warning (version obsolete)

Remove:

```yaml
version: "3.9"
```

---

### Volume error

```yaml
volumes:
  postgres_dev_data:
  node_modules:
```

---

### Prisma Studio error (xdg-open)

Ignore it — open manually:

```
http://localhost:5555
```

---

### Prisma Studio not accessible

Make sure:

```yaml
ports:
  - "5555:5555"
```

Run:

```bash
npm run studio
```

5. Check API logs

```bash
npm run logs
```

---

### Reset environment

```bash
docker compose -f docker-compose.dev.yml down -v
docker compose -f docker-compose.dev.yml up --build
```

---

## 🧠 Author

Gonzalo Araya
Backend Developer (Node.js) focused on scalable systems and clean architecture.

---

# 🇪🇸 Español

API de billetera virtual desarrollada con Node.js, TypeScript y Prisma, enfocada en buenas prácticas de backend como arquitectura limpia, testing y diseño de APIs REST escalables.

---

## 🚀 Objetivo

Este proyecto simula una billetera digital donde los usuarios pueden registrarse, autenticarse y operar con un sistema de balance.

Está diseñado como una base sólida para evolucionar hacia sistemas más complejos, incluyendo manejo de concurrencia e integración futura con blockchain.

---

## 🧱 Tecnologías

* Node.js (v22 LTS – Dockerizado)
* TypeScript
* Express
* PostgreSQL
* Prisma ORM
* JWT
* Docker
* Jest + Supertest

---

## 🔑 Funcionalidades actuales

* Registro de usuarios
* Autenticación JWT (en progreso)
* Validación de datos
* Manejo de errores centralizado
* Testing de endpoints
* Arquitectura modular

---

## 🔜 Próximas funcionalidades

* Transferencias entre usuarios
* Sistema de balance
* Historial de transacciones
* Manejo de concurrencia
* Autorización por roles
* Refactor a Clean Architecture
* Integración blockchain

---

## ⚙️ Inicio rápido (Docker)

### 1. Clonar repositorio

```bash
git clone <repo>
cd VirtualWalletAPI
```

---

### 2. Levantar entorno

```bash
npm run start:dev
```

⚠️ Solo la primera vez (Linux):

```bash
sudo usermod -aG docker $USER
newgrp docker
```

---

### 3. API disponible en:

```
http://localhost:8080
```

---

### 🛑 Detener contenedores

```bash
npm run docker:down:dev
```

---

## 🏭 Modo producción

```bash
npm run start:prod
```

---

## ⚙️ Variables de entorno

```env
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/wallet
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRES_IN=3600
PORT=8080
```

---

## 🧪 Testing

```bash
npm run test
```

---

## 🧑‍💻 Flujo de desarrollo

1. Levantar entorno

```bash
npm run start:dev
```

2. Programar en `src/`

3. Migraciones

```bash
docker exec -it wallet-api-dev npx prisma migrate dev
```

4. Ver base de datos

```bash
npm run studio
```

5. Ver logs de la api

```bash
npm run logs
```

---

## 🛠️ Problemas comunes

### Error permisos Docker

```bash
sudo usermod -aG docker $USER
newgrp docker
```

---

### Error Prisma Studio

Abrir manualmente:

```
http://localhost:5555
```

---

### Reset entorno

```bash
docker compose -f docker-compose.dev.yml down -v
docker compose -f docker-compose.dev.yml up --build
```

---

## 🧠 Autor

Gonzalo Araya
Backend Developer enfocado en sistemas escalables y arquitectura limpia.

---