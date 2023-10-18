const express = require("express")
const config = require("./config/mongoose")
require("dotenv").config()

const port = process.env.PORT

config.connect()
const app = express()

app.use(express.json())

app.get('*', (req, res) => {
    return res.status(404).json({
        data: null,
        error: 'route not found'
    })
})

app.listen(port, () => console.log(`listening on port: ${port}`))