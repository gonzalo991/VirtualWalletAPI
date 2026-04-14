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

const CREATION_ENDPOINT = "/api/user/create";

beforeEach(async () => {
    await prisma.user.deleteMany();
});

describe("User creation", () => {
    it("should create a user", async () => {
        const data = {
            username: "Gonzalo",
            email: "test@gmail.com",
            password: "123456",
        }
        const res = await request(app).post(CREATION_ENDPOINT).send(data);

        expect(res.status).toBe(201);

        expect(res.body).toMatchObject({
            username: "Gonzalo",
            email: "test@gmail.com",
        });
        expect(res.body.email).toBe("test@gmail.com");

        expect(res.body).toHaveProperty("id");
        expect(res.body).not.toHaveProperty("password");
    });

    it("should return 409 if user already exists", async () => {
        const data = {
            username: "Test User",
            email: "test2@gmail.com",
            password: "2345678",
        }

        await request(app).post(CREATION_ENDPOINT).send(data);
        const res = await request(app).post(CREATION_ENDPOINT).send(data);

        expect(res.status).toBe(409);
    });

    it("should fail and throw 422 if missing field", async () => {
        const data = {
            username: "testing missing field user",
            email: "missing@field.com",
        }

        const res = await request(app).post(CREATION_ENDPOINT).send(data);

        expect(res.status).toBe(422);
    });

    it("should return 422 if email is invalid", async () => {
        const data = {
            username: "Test User",
            email: "invalid-email",
            password: "2345678",
        }

        const res = await request(app).post(CREATION_ENDPOINT).send(data);

        expect(res.status).toBe(422);
    });
});

describe("User updating", () => {
    it("should update user and return 200", async () => {
        const data = {
            username: "Test User",
            email: "test@email.com",
            password: "2345678",
        }

        const updateData = {
            username: "Testing User Updated",
            email: "testingemail@email.com",
        }

        const user = await request(app).post(CREATION_ENDPOINT).send(data);

        const res = await request(app).patch(`/api/user/update/${user.body.id}`).send(updateData);

        expect(res.status).toBe(200);
        expect(res.body).toMatchObject({
            username: "Testing User Updated",
            email: "testingemail@email.com",
        });
        expect(res.body.username).toBe("Testing User Updated");
        expect(res.body).not.toHaveProperty("password");
    });

    it("should return 422 if no fields provided", async () => {
        const data = {
            username: "Test",
            email: "test2@email.com",
            password: "2345678",
        }

        const user = await request(app).post(CREATION_ENDPOINT).send(data);

        const res = await request(app).patch(`/api/user/update/${user.body.id}`)
            .send({});

        expect(res.status).toBe(422);
    });


    it("should return 404 if user does not exist", async () => {
        const invalidId = "invalid-id";

        const res = await request(app)
            .patch(`/api/user/update/${invalidId}`)
            .send({
                username: "Updated Name"
            });

        expect(res.status).toBe(404);
    });

    it("should return 409 if email is duplicated", async () => {
        const userData1 = {
            username: "Test User 1",
            email: "testuser1@email.com",
            password: "2345678",
        }
        const userData2 = {
            username: "Test User 2",
            email: "testuser2@email.com",
            password: "3456789",
        }

        const user1 = await request(app).post(CREATION_ENDPOINT).send(userData1);
        const user2 = await request(app).post(CREATION_ENDPOINT).send(userData2);

        const res = await request(app).patch(`/api/user/update/${user1.body.id}`)
            .send({ email: userData2.email });

        expect(res.status).toBe(409);
    });

    it("should return 404 or 400 for invalid id format", async () => {
        const res = await request(app)
            .patch(`/api/user/update/123`)
            .send({ username: "Test" });

        expect([400, 404]).toContain(res.status);
    });

    it("should update only one field", async () => {
        const user = await request(app).post(CREATION_ENDPOINT).send({
            username: "Test",
            email: "test@email.com",
            password: "123456"
        });

        const res = await request(app)
            .patch(`/api/user/update/${user.body.id}`)
            .send({ username: "OnlyUsernameUpdated" });

        expect(res.status).toBe(200);
        expect(res.body.username).toBe("OnlyUsernameUpdated");
        expect(res.body.email).toBe("test@email.com"); // importante
    });

    it("should ignore forbidden fields", async () => {
        const user = await request(app).post(CREATION_ENDPOINT).send({
            username: "Test",
            email: "test@email.com",
            password: "123456"
        });

        const res = await request(app)
            .patch(`/api/user/update/${user.body.id}`)
            .send({ id: "hacked-id" });

        expect(res.status).toBe(200);
        expect(res.body.id).toBe(user.body.id);
    });

})

afterAll(async () => {
    await prisma.$disconnect();
});
