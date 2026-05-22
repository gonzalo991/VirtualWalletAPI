/// <reference types="jest" />

import request from "supertest";
import app from "../src/app";
import { prisma } from "../src/lib/prisma";

const CREATION_ENDPOINT = "/api/auth/register";

const createAuthenticatedUser = async () => {

    const res = await request(app)
        .post(CREATION_ENDPOINT)
        .send({
            username: "Auth User",
            email: "auth@email.com",
            password: "123456"
        });

    return {
        token: res.body.token,
        user: res.body.user
    };
};

beforeEach(async () => {
    await prisma.user.deleteMany();
});

describe("User creation", () => {

    it("should create a user", async () => {

        const data = {
            username: "Gonzalo",
            email: "test@gmail.com",
            password: "123456",
        };

        const res = await request(app)
            .post(CREATION_ENDPOINT)
            .send(data);

        expect(res.status).toBe(201);

        expect(res.body).toHaveProperty("token");

        expect(res.body).toHaveProperty("user");

        expect(res.body.user).toMatchObject({
            username: "Gonzalo",
            email: "test@gmail.com",
        });

        expect(res.body.user).toHaveProperty("id");

        expect(res.body.user).not.toHaveProperty("password");
    });

    it("should return 409 if user already exists", async () => {

        const data = {
            username: "Test User",
            email: "test2@gmail.com",
            password: "2345678",
        };

        await request(app)
            .post(CREATION_ENDPOINT)
            .send(data);

        const res = await request(app)
            .post(CREATION_ENDPOINT)
            .send(data);

        expect(res.status).toBe(409);
    });

    it("should fail and throw 422 if missing field", async () => {

        const res = await request(app)
            .post(CREATION_ENDPOINT)
            .send({
                username: "Test",
                email: "test@email.com"
            });

        expect(res.status).toBe(422);
    });

    it("should return 422 if email is invalid", async () => {

        const res = await request(app)
            .post(CREATION_ENDPOINT)
            .send({
                username: "Test",
                email: "invalid-email",
                password: "123456"
            });

        expect(res.status).toBe(422);
    });

});

describe("User updating", () => {

    it("should update user and return 200", async () => {

        const userRes = await request(app)
            .post(CREATION_ENDPOINT)
            .send({
                username: "Test User",
                email: `test${Date.now()}@email.com`,
                password: "123456"
            });

        const token = userRes.body.token;
        const user = userRes.body.user;

        const res = await request(app)
            .patch(`/api/user/update/${user.id}`)
            .set("Authorization", `Bearer ${token}`)
            .send({
                username: "Updated User",
                email: "updated@email.com"
            });

        expect(res.status).toBe(200);

        expect(res.body).toMatchObject({
            username: "Updated User",
            email: "updated@email.com"
        });

        expect(res.body).not.toHaveProperty("password");
    });

    it("should return 422 if no fields provided", async () => {

        const auth = await createAuthenticatedUser();

        const res = await request(app)
            .patch(`/api/user/update/${auth.user.id}`)
            .set("Authorization", `Bearer ${auth.token}`)
            .send({});

        expect(res.status).toBe(422);
    });

    it("should return 404 if user does not exist", async () => {

        const auth = await createAuthenticatedUser();

        const res = await request(app)
            .patch("/api/user/update/invalid-id")
            .set("Authorization", `Bearer ${auth.token}`)
            .send({
                username: "Updated"
            });

        expect(res.status).toBe(404);
    });

});

describe("Get an user by email", () => {

    it("should get an user using an existing email and return 200", async () => {

        const auth = await createAuthenticatedUser();

        const res = await request(app)
            .get(`/api/user/email/${auth.user.email}`)
            .set("Authorization", `Bearer ${auth.token}`);

        expect(res.status).toBe(200);

        expect(res.body).toMatchObject({
            username: "Auth User",
            email: "auth@email.com"
        });

        expect(res.body).not.toHaveProperty("password");
    });

});

describe("Get an user by id", () => {

    it("should get an user using an existing id and return 200", async () => {

        const auth = await createAuthenticatedUser();

        const res = await request(app)
            .get(`/api/user/id/${auth.user.id}`)
            .set("Authorization", `Bearer ${auth.token}`);

        expect(res.status).toBe(200);

        expect(res.body).toMatchObject({
            username: "Auth User",
            email: "auth@email.com"
        });

        expect(res.body).not.toHaveProperty("password");
    });

    it("should return 401 if token is missing", async () => {

        const auth = await createAuthenticatedUser();

        const res = await request(app)
            .patch(`/api/user/update/${auth.user.id}`)
            .send({
                username: "Hacked"
            });

        expect(res.status).toBe(401);
    });

    it("should return 401 if token is invalid", async () => {

        const auth = await createAuthenticatedUser();

        const res = await request(app)
            .patch(`/api/user/update/${auth.user.id}`)
            .set("Authorization", "Bearer invalid-token")
            .send({
                username: "Hacked"
            });

        expect(res.status).toBe(401);
    });

});

afterAll(async () => {
    await prisma.$disconnect();
});