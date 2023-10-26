const app = require("../main")
const supertest = require("supertest")
const { connect } = require("./database")
const UserModel = require("../models/user")
const BlogModel = require("../models/blog")

describe("Blog Route", () => {
    let connection
    let token

    beforeAll(async () => {
        connection = await connect()
    })

    beforeEach(async () => {
        const user = await UserModel.create({
            first_name : "emmanuel",
            last_name : "adeyemi",
            username : "feragambo1",
            email : "feranmia511@gmail.com", 
            gender : "male",
            password : "passwordispassword"
        })
        const response = await supertest(app)
        .post("/auth/login")
        .set("content-type", "application/json")
        .send({
            username : "feragambo1",
            password : "passwordispassword"
        })
        token = response.body.token
        const blog = await BlogModel.create({
            title : "chores",
            description : "dont forget to ckean the house",
            tag : "priority",
            reading_time : 20,
            body : "lorem ipsum darum"
        })
        const res = await supertest(app)
        .post("/blog/create/")
        .set("authorization", `Bearer ${token}`)
        .set("content-type", "application/json")
        .send({
            title : "techiesss jhasassemble",
            description : "food spurlege",
            tag : "priority",
            reading_time : 20,
            body : "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Laboriosam officiis numquam vel nobis molestias natus at saepe sint repudiandae consequatur."
        })
        title = res.body.data.title
        id = res.body.data._id
    })

    afterEach(async () => {
        await connection.cleanup()
    })

    afterAll(async () => {
        await connection.disconnect()
    })

    it("should successfully create a blog for the logged in user", async () => {
        const response = await supertest(app)
        .post("/blog/create")
        .set("authorization", `Bearer ${token}`)
        .set("content-type", "application/json")
        .send({
            title : "techiesss jasassemble",
            description : "food spurlege",
            tag : "priority",
            reading_time : 20,
            body : "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Laboriosam officiis numquam vel nobis molestias natus at saepe sint repudiandae consequatur."
        })
        expect(response.status).toEqual(201)
        expect(response.body.data).toMatchObject({
            title : "techiesss jasassemble",
            description : "food spurlege",
            tag : "priority",
            reading_time : 20,
            body : "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Laboriosam officiis numquam vel nobis molestias natus at saepe sint repudiandae consequatur."
        })
    })

    it("should successfully get all blog for all users", async () => {
        const response = await supertest(app)
        .get("/blog/")
        .set("content-type", "application/json")
        expect(response.status).toEqual(200)
        expect(response.body).toMatchObject({
            data : expect.any(Array)
        })
    })

    test("should successfully update a blog for authenticated user", async () => {
        const response = await supertest(app)
        .patch(`/blog/update/${id}`)
        .set("authorization", `Bearer ${token}`)
        .set("content-type", "application/json")
        .send({
            title : "book",
        })
        expect(response.status).toEqual(200)
        expect(response.body).toMatchObject({
            existingBlog : expect.any(Object)
        })
    })

    test("should suceesfully delete a blog for authenticated user", async () => {
        const response = await supertest(app)
        .delete(`/blog/delete/${id}`)
        .set("authorization", `Bearer ${token}`)
        .set("content-type", "application/json")
        expect(response.status).toEqual(200)
        expect(response.body).toMatchObject({
            message : "Blog deleted successfully",
        })
    })

})