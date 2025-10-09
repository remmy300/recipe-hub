import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
//cretae instance of memory server
let mongo: MongoMemoryServer;
//runs once before all tests
beforeAll(async () => {
  mongo = await MongoMemoryServer.create(); //starts in memoryDB process
  const uri = mongo.getUri();
  await mongoose.connect(uri); //connects moongose models to the in-memoryDB
  //Ignore the logs and errors on test mode
  process.env.NODE_ENV = "test";
  jest.spyOn(console, "log").mockImplementation(() => {});
  jest.spyOn(console, "error").mockImplementation(() => {});
});

//runs after every single tests
afterEach(async () => {
  const collections = (await mongoose.connection.db?.collections()) ?? []; //returs all collections in the tests DB

  for (let collection of collections) {
    await collection.deleteMany({}); //clear all the documents
  }
});
//runs once after all tests finish
afterAll(async () => {
  await mongoose.connection.close(); //close mongoose connection
  await mongo.stop(); //stop the in-memoryDB process
});
