/// <reference types="jest" />

import request from "supertest";
import app from "../src/app";
import { prisma } from "../src/lib/prisma";

beforeEach(async () => {
    await prisma.refreshToken.deleteMany();
    await prisma.user.deleteMany();
});

describe("Auth Requests", () => {

    it("should login and return access and refresh tokens", async () => {

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

        expect(res.body.success).toBe(true);

        expect(res.body.data).toHaveProperty("accessToken");
        expect(res.body.data).toHaveProperty("refreshToken");
        expect(res.body.data).toHaveProperty("user");

        expect(res.body.data.user).toMatchObject({
            username: "Test",
            email
        });

        expect(res.body.data.user).not.toHaveProperty("password");
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

    it("should refresh session successfully", async () => {

        const registerRes = await request(app)
            .post("/api/auth/register")
            .send({
                username: "Test",
                email: "refresh@email.com",
                password: "123456"
            });

        const refreshToken =
            registerRes.body.data.refreshToken;

        const res = await request(app)
            .post("/api/auth/refresh")
            .send({
                refreshToken
            });

        expect(res.status).toBe(200);

        expect(res.body.success).toBe(true);

        expect(res.body.data).toHaveProperty("accessToken");
        expect(res.body.data).toHaveProperty("refreshToken");
    });

    it("should reject invalid refresh token", async () => {

        const res = await request(app)
            .post("/api/auth/refresh")
            .send({
                refreshToken: "invalid-token"
            });

        expect(res.status).toBe(401);
    });

    it("should reject reused refresh token", async () => {

        const registerRes = await request(app)
            .post("/api/auth/register")
            .send({
                username: "Test",
                email: "rotation@email.com",
                password: "123456"
            });

        const refreshToken =
            registerRes.body.data.refreshToken;

        const firstRefresh = await request(app)
            .post("/api/auth/refresh")
            .send({
                refreshToken
            });

        expect(firstRefresh.status).toBe(200);

        const secondRefresh = await request(app)
            .post("/api/auth/refresh")
            .send({
                refreshToken
            });

        expect(secondRefresh.status).toBe(401);
    });

    it("should logout successfully", async () => {

        const registerRes = await request(app)
            .post("/api/auth/register")
            .send({
                username: "Test",
                email: "logout@email.com",
                password: "123456"
            });

        const refreshToken =
            registerRes.body.data.refreshToken;

        const res = await request(app)
            .post("/api/auth/logout")
            .send({
                refreshToken
            });

        expect(res.status).toBe(200);
    });

});

afterAll(async () => {
    await prisma.$disconnect();
});