import express from 'express'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import nodemailer from 'nodemailer'

//Models
import User from '../models/user'

const app = express()

const transporter = nodemailer.createTransport({
       //service: 'Gmail',
       host: 'correo.powerhost.com.mx',
       port: 587,
       secure: false,
       auth: {
           user: 'jgarcia@powerhost.com.mx',
           pass: 'J0rg32010'
       }
})

app.post('/v1/signup', (req, res) => {
	let body = req.body
	let user = new User({
		name: body.name,
		email: body.email,
		password: bcrypt.hashSync(body.password, 8),
		role: 'ADMIN_ROLE',
		tenant: null
	})

	user.save((err, userDB) => {
		if (err) {
			return res.json({
				ok: false,
				err
			})
		}
		//let emailTemplate = getEmailTemplate(userDB.token)
		let mailOptions = {
	      from: '"AdminClinic" <no-reply@adminclinic.com>', // sender address
	      to: userDB.email, // list of receivers
	      subject: 'Instrucciones para confirmar tu cuenta de AdminClinic', // Subject line
	      //text: 'Hello world', // plain text body
	      html: 'Gracias por registrarte en AdminClinic.<br /><br /> Para finalizar tu registro sólo tenemos que asegurarnos que tenemos tu email correcto.<br />Da clic en el siguiente enlace para confirmar tu email: <br /><br /><a href="https://app.adminclinic.com/accounts/confirmation?confirmationToken=83bd8f1feddea27a07b6dd1b17128f0b786878ae556a81f64907de4ff677317f">Confirmar</a> <br /><br /><br />!Bienvenido!<br /><b>El equipo AdminClinic</b>'
	      //html: '<b>Hello world</b>' // html body
	  }

	 	transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
        return console.log(error)
    }
    // console.log('Message sent: %s', info.messageId)
    // console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info))
    })

		let token = jwt.sign({
			userData: userDB
		}, SECRET, {
			expiresIn: '1h'
		})

		res.json({
			ok: true,
			token: token
			//refreshToken: randtoken.uid(256)
		})
	})
})

module.exports = app