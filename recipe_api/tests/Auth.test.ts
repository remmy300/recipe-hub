import request from "supertest";
import app from "../src/index";

describe("Auth routes", () => {
  describe("POST /register", () => {
    it("should register  a new user successfully", async () => {
      const res = await request(app).post("/api/auth/register").send({
        name: "John Doe",
        email: "john@example.com",
        password: "password123",
      });

      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty("token");
      expect(res.body).toHaveProperty("email", "john@example.com");
    });

    it("should not register user if email already exists", async () => {
      await request(app).post("/api/auth/register").send({
        name: "John Doe",
        email: "john@example.com",
        password: "password123",
      });

      const res = await request(app).post("/api/auth/register").send({
        name: "John Doe",
        email: "john@example.com",
        password: "password123",
      });

      expect(res.status).toBe(400);
    });
  });

  describe("POST /login", () => {
    it("should login successfully  and return a token", async () => {
      await request(app).post("/api/auth/register").send({
        name: "John Doe",
        email: "john@example.com",
        password: "password123",
      });

      const res = await request(app).post("/api/auth/login").send({
        password: "password123",
        email: "john@example.com",
      });

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("token");
    });

    it("should fail with invalid credentials", async () => {
      const res = await request(app).post("/api/auth/login").send({
        email: "wrong@example.com",
        password: "wrongpassword",
      });

      expect(res.status).toBe(401);
    });
  });

  describe("GET /user", () => {
    it("should return user profile with valid token", async () => {
      const registerRes = await request(app).post("/api/auth/register").send({
        name: "Jane Doe",
        email: "jane@example.com",
        password: "password123",
      });

      const token = registerRes.body.token;

      const res = await request(app)
        .get("/api/auth/user")
        .set("Authorization", `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("email", "jane@example.com");
    });

    it("should deny access without token", async () => {
      const res = await request(app).get("/api/auth/user");
      expect(res.status).toBe(401);
    });
  });
});
