import mongoose from "mongoose"
const DocInput = mongoose.model('importFromHere', new mongoose.Schema({}, { strict: false }))
export default DocInput
