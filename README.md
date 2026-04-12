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

* Node.js (v25)
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
* JWT authentication
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

### ⚙️ Installation

```bash
git clone <repo>
cd wallet-api
npm install
```

Set environment variables:

```env
DATABASE_URL=postgresql://USER:PASSWORD@localhost:5432/wallet
JWT_SECRET=your_secret_key
```

Run migrations:

```bash
npx prisma migrate dev
```

Generate Prisma client (if needed):

```bash
npx prisma generate
```

Start server:

```bash
npm run dev
```

---

### 🧪 Testing

```bash
npm run test
```

Tests include:

* Jest
* Supertest
* Real database testing (clean state per test)

---

### 🧠 Author

Gonzalo Araya
Backend Developer (Node.js) focused on scalable systems and clean architecture.

---

## 🇪🇸 Español

API de billetera virtual desarrollada con Node.js, TypeScript y Prisma, enfocada en buenas prácticas de backend como arquitectura limpia, testing y diseño de APIs REST escalables.

---

### 🚀 Objetivo

Este proyecto simula una billetera digital donde los usuarios pueden registrarse, autenticarse y operar con un sistema de balance.

Está diseñado como una base sólida para evolucionar hacia sistemas más complejos, incluyendo manejo de concurrencia y futura integración con tecnologías blockchain.

---

### 🧱 Tecnologías

* Node.js (v25)
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
* Autenticación con JWT
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

### ⚙️ Instalación

```bash
git clone <repo>
cd wallet-api
npm install
```

Configurar variables de entorno:

```env
DATABASE_URL=postgresql://USER:PASSWORD@localhost:5432/wallet
JWT_SECRET=your_secret_key
```

Ejecutar migraciones:

```bash
npx prisma migrate dev
```

Generar cliente Prisma (si es necesario):

```bash
npx prisma generate
```

Levantar el servidor:

```bash
npm run dev
```

---

### 🧪 Testing

```bash
npm run test
```

Los tests utilizan:

* Jest
* Supertest
* Base de datos real (limpieza por test)

---

### 🧠 Autor

Gonzalo Araya
Backend Developer (Node.js) enfocado en sistemas escalables y arquitectura limpia.