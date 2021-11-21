require('dotenv').config()

/** Configurar puerto */
const express = require('express')
const port = 3000 || process.env.port

/** Librerias de sendgird para emails */
const email = require('./email')
const sgMail = require('@sendgrid/mail')
sgMail.setApiKey(process.env.SENDGRID_API_KEY)

/** Librerias de twilio para mensajes de texto */
const accountSID = process.env.TWILIO_ACCOUNT_SID;
const authToken =  process.env.TWILIO_AUTH_TOKEN;

/** Para realizar pruebas desde Postman */
const app = express()
app.use(express.json())
app.use(express.urlencoded({extended:false}))

/** Creacion de la ruta del proyecto */
// http://localhost:3000
app.get('/',(req,res)=>{
    res.json({message: 'Success'})
})

/** Activar listen */
app.listen(port, ()=>{
    console.log(`Accede al sitio web http://localhost:${port}`)
})

/** Ruta para enviar correos desde Postman */
app.post('/api/email/confirmacion',async(req,res,next)=>{
    /** Llamamos funcion de email.js, requiere parametros que ingresa por Postman */
    try {
        res.json(await email.sendOrder(req.body))        
    }catch (err){
        next(err)
    }
})

/** Validar el codigo que nos devuelve la ejecucion del codigo */
app.use((err,req,res,next)=>{
    const statusCode = err.statusCode || 500
    console.error(err.message, err.stack)
    res.status(statusCode).json({'message': error.message})
    return
})

function getMessage() {
    const body = 'Mensaje enviado el 20 Nov'
    return{
        to:'jaimea_11@hotmail.com',
        from:'jcastano@uva3.com',
        subject:'Prueba sendgrig',
        text: body,
        html: `<!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta http-equiv="X-UA-Compatible" content="IE=edge">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Document</title>
        </head>
        <body>
            <div class="container section">
                <label><strong>Viajes</strong></label>
                <img src="../public/img/img1.jpg" alt="" width="400px">
            </div>
        </body>
        </html> `
    }
}

async function sendEmail() {
    try {
        await sgMail.send(getMessage())
        console.log("Correo Enviado")
    } catch (err) {
        console.error("No se pudo enviar el mensaje")
        console.error(err)
        if(err.response) console.error(err.response.body)
    }
}

(async()=>{
    console.log("Enviando Correo")
    await sendEmail()
})