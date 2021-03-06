const express = require('express'),
    app         = express(),
    bodyParser  = require('body-parser'),
    cors        = require('cors'),
    csrf        = require('csurf')
    helmet      = require('helmet'),
    cookieParser = require('cookie-parser'),
    env         = require('./env'),
    fs          = require("fs"),
    https       = require('https'),
    port        = env.port || 8000

app.use(helmet())
app.disable("x-powered-by")
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

app.use('/public', express.static(__dirname + '/public')) // Set public directory

/* Dynamic CORS */
const whitelist = [`${env.client_host}`,`${env.client_host_prod}`]

const options = {
    origin: (origin, callback) => {
        if (whitelist.indexOf(origin) !== -1) {
            callback(null, true)
        } else {
            callback("CORS Not allowed by SEA Cloud Platform SERVER API'S", false)
            // console.log(callback(new Error("Not allowed by SEA Cloud Platform API'S")));
        }
    },
    credentials: true
}
app.use(cors(options))
/* End Dynamic CORS */

/* Start csrf protection */
app.use(cookieParser())
app.use(csrf({ cookie: {
    key: '_sthing',
    httpOnly: true,
    // maxAge: 10,
    secure: env.node_env === 'production' ? true : false
}}))
app.use(function (err, req, res, next) {
    if (err.code !== 'EBADCSRFTOKEN') return next(err)
    res.status(403)
    res.send('Invalid CSRF Token request!')
})
/* Start csrf protection */

/* Start of Routing Import */
const authRoute        = require('./routes/auth_route')
const deviceRoute      = require('./routes/device_route')
const graphRoute       = require('./routes/graph_route')
const controlRoute     = require('./routes/control_route')
const userSettingRoute = require('./routes/userSetting_route')

authRoute(app)
deviceRoute(app)
graphRoute(app)
controlRoute(app)
userSettingRoute(app)
/* End of Routing Import */

/* MongoDB Connection Check */
const conn = require('./config/db_mongoDB')

if(conn) {
    if (env.node_env === 'production') {
        try {
            const privateKey  = fs.readFileSync(`${env.httpsPrivateKey}`, 'utf8')
            const certificate = fs.readFileSync(`${env.httpsCertificate}`, 'utf8')
            const credentials = {key: privateKey, cert: certificate}
            const httpsApps   = https.createServer(credentials, app)
    
            httpsApps.listen(port, () => console.log(`Production Server API listen on ${env.host}:${env.port}`))
        } catch (error) {
            console.log(new Error(error))
        }
    } else {
        app.listen(port, () => console.log(`Development Server API listen on ${env.host}:${env.port}`))
    }
} else {
    console.log(`${env.host}:${env.port} cannot connect to MongoDB!`)
}
/* End MongoDB Connection Check */