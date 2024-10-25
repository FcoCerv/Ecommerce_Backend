import express from 'express'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'

//Models
import User from '../models/user'
import Tenant from '../models/tenant'

const app = express()

//Crea tenant
app.post('/v1/config/tenant', (req, res) => {
	let body = req.body
	// let tokenLicense = jwt.sign({
 //    	validFrom: { type: Date },
 //    	validTo: { type: Date },
 //    	type_lic: { type: String, default: 'DEMO' },
 //    	status: { type: Boolean }
	// 	}, SECRET, {
	// 		expiresIn: '30d'
	// 	})
	// {
	// 	license: { type: String },
	// 	validFrom: { type: Date },
	// 	validTo: { type: Date },
	// 	type_lic: { type: String },
	// 	user: { type: Schema.Types.ObjectId, ref: 'User', unique: true },
	// 	status: { type: Boolean }
	// 	tenant: { type: Schema.Types.ObjectId, ref: 'Tenant' }
	// }
	let tenant = new Tenant({
		owner: req.user.userData._id,
		name: body.name,
		type_org: body.type_org,
		avg_medics: body.avg_medic
	})

	tenant.save((err, resp) => {
		if (err) {
			return res.status(400).json({
				ok: false,
				err
			})
		}
		User.findByIdAndUpdate(resp.owner, {
			$set: {
				tenant: resp._id
			}
		}).exec( (err, user) => {
			if (err) {
				return res.status(400).json({
					ok: false,
					err
				})
			}

			user.tenant = resp._id
			user.configMedRecs = ''
			let token = jwt.sign({
				userData: user,
			}, SECRET, {
				expiresIn: '12h'
			})

			res.json({
				ok: true,
				token: token,
				orgData: resp
			})
		})
	})
})

app.put('/v1/config/tenant', (req, res) => {
	let body = req.body
	Tenant.findByIdAndUpdate(req.user.userData.tenant, {
		$set: {
			name: body.name,
			type_org: body.type_org,
			avg_medics: body.avg_medics
		}
	}, (err, tenant) => {
		if (err) {
			return res.status(400).json({
				ok: false,
				err
			})
		}
		return res.json({
			ok: true
		})
	})
})

module.exports = app