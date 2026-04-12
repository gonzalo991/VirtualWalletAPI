/// <reference types="jest" />
/**
 * Test:
 * crea el usuario - 201
 * email invalido - 422
 * falta algun campo - 422
 * email duplicado - 409
 * 
 * IMPORTANTE SOBRE LOS TEST DE CONTROLADORES: 
 * probar que funcione, validaciones, 
 * manejo de errores, que sale del sistema(ej: password, id) = bug de seguridad
 * devuelve estructura correcta
 */

import request from "supertest";
import app from "../src/app";
import { prisma } from "../src/lib/prisma";

beforeEach(async () => {
    await prisma.user.deleteMany();
});

describe("POST /api/user/create", () => {
    it("should create a user", async () => {
        const data = {
            username: "Gonzalo",
            email: "test@gmail.com",
            password: "123456",
        }
        const res = await request(app).post("/api/user/create").send(data);

        expect(res.status).toBe(201);
        expect(res.body.email).toBe("test@gmail.com");
    });
});

afterAll(async () => {
    await prisma.$disconnect();
});
