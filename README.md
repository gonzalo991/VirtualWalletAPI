# 💸 Wallet API (Backend)

API de billetera virtual desarrollada con Node.js, TypeScript y Prisma, enfocada en buenas prácticas de backend como arquitectura limpia, manejo de errores y diseño de APIs REST.

## 🚀 Objetivo

Este proyecto tiene como objetivo simular el funcionamiento de una billetera digital, permitiendo a los usuarios registrarse, autenticarse y realizar transferencias entre cuentas.

Además, está diseñado para evolucionar hacia una integración con tecnologías blockchain, incorporando smart contracts y manejo de wallets reales.

## 🧱 Tecnologías utilizadas

* Node.js
* TypeScript
* Express
* PostgreSQL
* Prisma ORM
* JWT (autenticación)
* Docker

## 🔑 Funcionalidades actuales

* Registro de usuarios
* Autenticación con JWT
* Obtención de usuario autenticado
* Base preparada para sistema de balance

## 🔜 Próximas funcionalidades

* Transferencias entre usuarios
* Historial de transacciones
* Manejo de concurrencia en operaciones
* Refactor a Clean Architecture
* Integración con smart contracts (blockchain)

## 📌 Enfoque técnico

El proyecto prioriza:

* Código limpio y mantenible
* Separación de responsabilidades
* Diseño de APIs REST consistente
* Escalabilidad y buenas prácticas

## ⚙️ Instalación

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

## 🧠 Autor

Desarrollado por Gonzalo Araya, enfocado en backend development y especialización futura en blockchain.
