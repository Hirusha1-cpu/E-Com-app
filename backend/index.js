const express = require('express');
const cors = require("cors")
const mongoose = require('mongoose')
const dotenv = require('dotenv').config()

const app = express()

app.use(cors())
app.use(express.json({ limit: "10mb" }))

const PORT = process.env.PORT || 3100

//mongodb connection
console.log(process.env.MONGODB_URL);
mongoose.connect(process.env.MONGODB_URL)
    .then(() => console.log("Connected to Db"))
    .catch((err) => console.log(err))

//schema
const userSchema = mongoose.Schema({
    firstName: String,
    lastName: String,
    email: {
        type: String,
        unigue: true
    },
    password: String,
    confirmPassword: String,
    image: String
})

//
const userModel = mongoose.model("userrestuarant", userSchema)


app.get("/", (req, res) => {
    res.send("server is running")
})

//signup
app.post("/signup", async (req, res) => {

    console.log(req.body);
    const { email } = req.body
    const doc = await userModel.findOne({ email })
    console.log(doc);

    if (doc) {
        res.send({ message: "Email already Registered", alert: true })
    } else {
        const data = userModel(req.body)
        const save = data.save()
        res.send({ message: "Sign up is succeessFull", alert: true })
    }
})

//api login
app.post("/login", async (req, res) => {
    console.log(req.body);
    const { email } = req.body
    const doc = await userModel.findOne({ email })

    if (doc) {
        console.log(doc);
        const dataSend = {
            _id: doc._id,
            firstName: doc.firstName,
            lastName: doc.lastName,
            email: doc.email,

            image: doc.image,
        }
        console.log(dataSend);
        res.send({ message: "Login Successfull", alert: true, data: dataSend })
    } else {

        res.send({ message: "Sign up have and error", alert: false })
    }

})

//product section
const schemaProduct = mongoose.Schema({
    name: String,
    category:String,
    image: String,
    price: String,
    description: String
})

const productModal = mongoose.model("productsrestaurant", schemaProduct)

//upload product in data
//api
app.post("/uploadproduct",async(req, res)=>{
    console.log(req.body);
    const data = await productModal(req.body)
    const datasave = await data.save()
    res.send({message: "Upload Product Success"})

})

app.get("/product",async(req,res)=>{
    const data = await productModal.find({})
    res.send(JSON.stringify(data));
})


app.listen(PORT, () => console.log("server is running at port ", PORT))
