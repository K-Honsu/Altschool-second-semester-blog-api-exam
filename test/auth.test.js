const app = require("../main")
const supertest = require("supertest")
const { connect } = require("./database")
const UserModel = require("../models/user")

describe("Authentication Test", () => {
    let connection

    beforeAll(async () => {
        connection = await connect()
    })

    afterEach(async () => {
        await connection.cleanup()
    })

    afterAll(async () => {
        await connection.disconnect()
    })

    it("should successfully register a user", async () => {
        const response = await supertest(app)
        .post("/users/sign-up")
        .set("content-type", "application/json")
        .send({
            first_name : "emmanuel",
            last_name : "adeyemi",
            username : "feragambo1",
            email : "feranmia511@gmail.com", 
            gender : "male",
            password : "passwordispassword"
        })
        expect(response.status).toEqual(201);
        expect(response.body.data).toMatchObject({
            first_name : "emmanuel",
            last_name : "adeyemi",
            username : "feragambo1",
            email : "feranmia511@gmail.com", 
            gender : "male"
        })
    })

    it("should successfully login in a user", async () => {
        await UserModel.create({
            first_name : "daniel",
            last_name : "tobi",
            username : "daniel_tobi",
            email : "dan@gmail.com", 
            gender : "male",
            password : "passwordispassword"
        })
        const response = await supertest(app)
        .post("/auth/login")
        .set("content-type", "application/json")
        .send({
            username : "daniel_tobi",
            password : "passwordispassword"
        })
        expect(response.status).toEqual(200)
        expect(response.body).toMatchObject({
            status : "success",
            user : expect.any(Object),
            token : expect.any(String)
        })
        expect(response.body.user.first_name).toEqual('daniel');
        expect(response.body.user.email).toEqual('dan@gmail.com');
    })

    test("should not successfully login in a user with wrong creditials", async () => {
        await UserModel.create({
            first_name : "daniel",
            last_name : "jerry",
            username : "daniel_jerry",
            email : "dan@gmail.com", 
            gender : "male",
            password : "passwordispassword"
        })
        const response = await supertest(app)
        .post("/auth/login")
        .set("content-type", "application/json")
        .send({
            username : "emmanuella",
            password : "learning_node"
        })
        expect(response.status).toEqual(404)
        expect(response.body).toMatchObject({
            data : "User not found"
        })
    })
})