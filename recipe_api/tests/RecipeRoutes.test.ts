import request from "supertest";
import app from "../src/index";
import { Recipe } from "../src/models/Recipe";

describe("Recipe API", () => {
  it("Should create a new recipe", async () => {
    const newRecipe = {
      title: "Test Recipe",
      ingredients: ["Water", "Salt"],
      instructions: "Boil and mix.",
    };

    const res = await request(app)
      .post("/api/recipe")
      .send(newRecipe)
      .expect(201);

    expect(res.body).toHaveProperty("_id");
    expect(res.body.title).toBe("Test Recipe");
  });

  it("should fail if title is missing", async () => {
    const res = await request(app)
      .post("/api/recipe")
      .send({
        ingredients: ["Water", "Salt"],
        instructions: "Boil and mix.",
      })
      .expect(500);

    expect(res.body.message).toBe("Internal server error");
  });

  it("should fetch all recipes", async () => {
    await Recipe.create({
      title: "Soup",
      ingredients: ["Water"],
      instructions: "Boil water",
    });

    const res = await request(app).get("/api/recipe").expect(200);

    expect(res.body.length).toBe(1);
    expect(res.body[0].title).toBe("Soup");
  });
});
