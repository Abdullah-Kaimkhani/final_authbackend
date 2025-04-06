import mongoose from "mongoose";

const schema = new mongoose.Schema({
    todo: String
});

const todoModel = mongoose.model('todo', schema);

export default todoModel;