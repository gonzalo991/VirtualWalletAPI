/// <reference types="jest" />

import request from "supertest";
import app from "../src/app";
import { prisma } from "../src/lib/prisma";

beforeEach(async () => {
    await prisma.user.deleteMany();
});

describe("Auth Requests", () => {

    it("should login and return token", async () => {

        const email = "testeando@email.com";

        await request(app)
            .post("/api/auth/register")
            .send({
                username: "Test",
                email,
                password: "123456"
            });

        const res = await request(app)
            .post("/api/auth/login")
            .send({
                email,
                password: "123456"
            });

        expect(res.status).toBe(200);

        expect(res.body).toHaveProperty("token");

        expect(res.body).toHaveProperty("user");

        expect(res.body.user).toMatchObject({
            username: "Test",
            email
        });

        expect(res.body.user).not.toHaveProperty("password");
    });

    it("should return 401 if password is invalid", async () => {

        await request(app)
            .post("/api/auth/register")
            .send({
                username: "Test",
                email: "test@email.com",
                password: "123456"
            });

        const res = await request(app)
            .post("/api/auth/login")
            .send({
                email: "test@email.com",
                password: "wrongpassword"
            });

        expect(res.status).toBe(401);
    });

    it("should return 401 if user does not exist", async () => {

        const res = await request(app)
            .post("/api/auth/login")
            .send({
                email: "notfound@email.com",
                password: "123456"
            });

        expect(res.status).toBe(401);
    });

    it("should return 422 if email is invalid", async () => {

        const res = await request(app)
            .post("/api/auth/login")
            .send({
                email: "invalid-email",
                password: "123456"
            });

        expect(res.status).toBe(422);
    });

});

afterAll(async () => {
    await prisma.$disconnect();
});