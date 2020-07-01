const express   = require('express'),
    app         = express(),
    cors        = require('cors'),
    helmet      = require('helmet'),
    bodyParser  = require('body-parser'),
    env         = require('./env'),
    port        = env.port || 5000

app.use(helmet())

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

/* Dynamic CORS */
const whitelist = [`${env.client_domain}`,`${env.api_domain}`]

const options = {
    origin: (origin, callback) => {
        if (whitelist.indexOf(origin) !== -1) {
            callback(null, true)
        } else {
            callback("CORS Not allowed by SEA Cloud Platform SERVER API'S", false)
            // console.log(callback(new Error("Not allowed by SEA Cloud Platform API'S")));
        }
    }
}
app.use(cors(options))
/* End Dynamic CORS */

/* Start of Routing Import */
const iotRoute  = require('./routes/iot_route')
iotRoute(app)
/* End of Routing Import */

/* MongoDB Connection Check */
const conn = require('./config/db_mongoDB')

if(conn) {
    app.listen(port, () => console.log(`IoT API listen on ${env.domain}:${env.port}`));
} else {
    console.log(`${env.domain}:${env.port} cannot connect to MongoDB!`)
}
/* End MongoDB Connection Check */