import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';    
//import cors from 'cors';

const app = express();
dotenv.config();

const userSchema = new mongoose.Schema({
    name: String,
    age: Number,
});
const User = mongoose.model('users', userSchema);

app.get('/', async (req, res) => {
    const userdata = await User.find();
    console.log(userdata);
    res.json(userdata);
});



mongoose.connect('mongodb://localhost:27017/connect').then(()=>{
    console.log('Connected to mongodb database...');
    app.listen(3000, () => {
        console.log('Server is running on port 3000');
    });
}).catch((err) => {
    console.error('Database connection error:', err);
});