import mongoose from 'mongoose'
const Schema = mongoose.Schema

let proceduresSchema = new Schema({
    id: { type: String },
    desc: { type: String }
}, {collection: 'procedures'})

export default mongoose.model('Procedures', proceduresSchema)