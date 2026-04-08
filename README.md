# 💸 Wallet API (Backend)

---

## 🇪🇸 Español

API de billetera virtual desarrollada con Node.js, TypeScript y Prisma, enfocada en buenas prácticas de backend como arquitectura limpia, manejo de errores y diseño de APIs REST.

### 🚀 Objetivo

Este proyecto tiene como objetivo simular el funcionamiento de una billetera digital, permitiendo a los usuarios registrarse, autenticarse y realizar transferencias entre cuentas.

Además, está diseñado para evolucionar hacia una integración con tecnologías blockchain, incorporando smart contracts y manejo de wallets reales.

### 🧱 Tecnologías utilizadas

* Node.js
* TypeScript
* Express
* PostgreSQL
* Prisma ORM
* JWT (autenticación)
* Docker

### 🔑 Funcionalidades actuales

* Registro de usuarios
* Autenticación con JWT
* Obtención de usuario autenticado
* Base preparada para sistema de balance

### 🔜 Próximas funcionalidades

* Transferencias entre usuarios
* Historial de transacciones
* Manejo de concurrencia en operaciones
* Refactor a Clean Architecture
* Integración con smart contracts (blockchain)

### 📌 Enfoque técnico

El proyecto prioriza:

* Código limpio y mantenible
* Separación de responsabilidades
* Diseño de APIs REST consistente
* Escalabilidad y buenas prácticas

### ⚙️ Instalación

```bash
git clone <repo>
cd wallet-api
npm install
```

Configurar variables de entorno:

```env
DATABASE_URL=...
JWT_SECRET=...
```

Ejecutar migraciones:

```bash
npx prisma migrate dev
```

Levantar el servidor:

```bash
npm run dev
```

### 🧠 Autor

Desarrollado por Gonzalo Araya, enfocado en backend development y especialización futura en blockchain.

---

## 🇺🇸 English

Virtual wallet API built with Node.js, TypeScript and Prisma, focused on backend best practices such as clean architecture, error handling and REST API design.

### 🚀 Objective

This project aims to simulate a digital wallet system, allowing users to register, authenticate and perform transfers between accounts.

It is also designed to evolve into a blockchain-integrated system, including smart contracts and real wallet interactions.

### 🧱 Tech Stack

* Node.js
* TypeScript
* Express
* PostgreSQL
* Prisma ORM
* JWT (authentication)
* Docker

### 🔑 Current Features

* User registration
* JWT authentication
* Get authenticated user
* Base structure for balance system

### 🔜 Upcoming Features

* User-to-user transfers
* Transaction history
* Concurrency handling
* Refactor to Clean Architecture
* Smart contract integration (blockchain)

### 📌 Technical Focus

This project emphasizes:

* Clean and maintainable code
* Separation of concerns
* Consistent REST API design
* Scalability and best practices

### ⚙️ Installation

```bash
git clone <repo>
cd wallet-api
npm install
```

Set environment variables:

```env
DATABASE_URL=...
JWT_SECRET=...
```

Run migrations:

```bash
npx prisma migrate dev
```

Start the server:

```bash
npm run dev
```

### 🧠 Author

Developed by Gonzalo Araya, focused on backend development and future specialization in blockchain.