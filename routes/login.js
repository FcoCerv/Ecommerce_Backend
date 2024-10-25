import express from 'express'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'

//Models
import User from '../models/user'

const app = express()

app.post('/v1/signin', (req, res) => {
	let body = req.body
	User.findOne({ email: body.email }, '-configMedRecs', function(err, user) {
		if (err) {
			return res.status(500).json({
				ok: false,
				err
			})
		}

		if (!user) {
			return res.json({
				ok: false,
				err: {
					message: 'Correo electrónico y/o contraseña incorrectos'
				}
			})
		}

		if (!bcrypt.compareSync(body.password, user.password)) {
			return res.json({
				ok: false,
				err: {
					message: 'Correo electrónico y/o contraseña incorrectos'
				}
			})
		}

		let token = jwt.sign({
			userData: user
		}, SECRET, { expiresIn: '12h' })

		res.json({
			ok: true,
			token
			//refreshToken: randtoken.uid(256)
		})
	})
})

module.exports = app