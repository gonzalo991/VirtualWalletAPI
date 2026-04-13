# 💸 Wallet API (Backend)

---

## 🇺🇸 English

Virtual wallet API built with Node.js, TypeScript and Prisma, focused on backend best practices such as clean architecture, testing, and scalable REST API design.

---

### 🚀 Objective

This project simulates a digital wallet system where users can register, authenticate, and operate with a balance system.

It is designed as a solid backend foundation to evolve into more complex systems, including concurrency handling and future blockchain integration.

---

### 🧱 Tech Stack

* Node.js (v22 LTS – Dockerized)
* TypeScript
* Express
* PostgreSQL
* Prisma ORM
* JWT (authentication)
* Docker
* Jest + Supertest (testing)

---

### 🔑 Current Features

* User registration
* JWT authentication (in progress)
* DTO validation
* Centralized error handling
* Endpoint testing (HTTP level)
* Modular architecture (controller / service)

---

### 🔜 Upcoming Features

* User-to-user transfers
* Balance system
* Transaction history
* Concurrency handling (race conditions)
* Role-based authorization
* Full Clean Architecture refactor
* Smart contract integration (blockchain)

---

### 📌 Technical Focus

This project emphasizes:

* Clean and maintainable code
* Separation of concerns
* Consistent validation and error handling
* Real endpoint testing (no mocks)
* Backend scalability

---

## ⚙️ Quick Start (Recommended - Docker)

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

👉 Runs optimized production build + `prisma migrate deploy`

---

## ⚙️ Environment Variables

For development, `.env` is created automatically if missing.

Manual example:

```env
DATABASE_URL=postgresql://postgres:postgres@localhost:5433/wallet
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
* Real database testing (clean state per test)

---

## 🧠 Author

Gonzalo Araya
Backend Developer (Node.js) focused on scalable systems and clean architecture.

---

# 🇪🇸 Español

API de billetera virtual desarrollada con Node.js, TypeScript y Prisma, enfocada en buenas prácticas de backend como arquitectura limpia, testing y diseño de APIs REST escalables.

---

### 🚀 Objetivo

Este proyecto simula una billetera digital donde los usuarios pueden registrarse, autenticarse y operar con un sistema de balance.

Está diseñado como una base sólida para evolucionar hacia sistemas más complejos, incluyendo manejo de concurrencia y futura integración con tecnologías blockchain.

---

### 🧱 Tecnologías

* Node.js (v22 LTS – Dockerizado)
* TypeScript
* Express
* PostgreSQL
* Prisma ORM
* JWT (autenticación)
* Docker
* Jest + Supertest (testing)

---

### 🔑 Funcionalidades actuales

* Registro de usuarios
* Autenticación con JWT (en progreso)
* Validación de datos (DTO + validators)
* Manejo de errores centralizado
* Testing de endpoints (HTTP)
* Arquitectura modular (controller / service)

---

### 🔜 Próximas funcionalidades

* Transferencias entre usuarios
* Sistema de balance
* Historial de transacciones
* Manejo de concurrencia (race conditions)
* Middleware de autorización por roles
* Refactor completo a Clean Architecture
* Integración con smart contracts (blockchain)

---

### 📌 Enfoque técnico

El proyecto prioriza:

* Código limpio y mantenible
* Separación de responsabilidades
* Validación y manejo de errores consistente
* Testing de endpoints reales (no mocks)
* Escalabilidad en backend

---

## ⚙️ Inicio rápido (Recomendado - Docker)

### 1. Clonar repositorio

```bash
git clone <repo>
cd VirtualWalletAPI
```

---

### 2. Levantar entorno de desarrollo

```bash
npm run start:dev
```

👉 Este comando:

* Construye los contenedores
* Levanta PostgreSQL
* Levanta la API
* Ejecuta migraciones de Prisma
* Crea `.env` automáticamente si no existe

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

👉 Ejecuta build optimizado + `prisma migrate deploy`

---

## ⚙️ Variables de entorno

En desarrollo se crean automáticamente.

Ejemplo manual:

```env
DATABASE_URL=postgresql://postgres:postgres@localhost:5433/wallet
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRES_IN=3600
PORT=8080
```

---

## 🧪 Testing

```bash
npm run test
```

Incluye:

* Jest
* Supertest
* Base de datos real (limpieza por test)

---

## 🧠 Autor

Gonzalo Araya
Backend Developer (Node.js) enfocado en sistemas escalables y arquitectura limpia.