const app = require("./main")
const config = require("./config/mongoose")
require("dotenv").config()


const port = process.env.PORT



config.connect()

app.listen(port, () => console.log(`listening on port: ${port}`))