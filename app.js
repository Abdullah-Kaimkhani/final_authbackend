import express from 'express';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import userModel from './models/userSchema.js';
import cors from 'cors';
import todoModel from './models/todoSchema.js';

const app = express();

app.use(express.json());
app.use(cors());

const MONGO_URL = 'mongodb+srv://admin:admin@cluster0.uiacs.mongodb.net/';

mongoose.connect(MONGO_URL);

mongoose.connection.on('connected', () => {
    console.log('Connected to MongoDB');
});

mongoose.connection.on('error', (err) => {
    console.log('Error:', err);
});

const PORT = 3000;

// Signup API

app.post('/api/signup', async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).send({ message: 'All fields are required' });
        }

        const emailExist = await userModel.findOne({ email });
        if (emailExist !== null) {
            return res.status(400).send({ message: 'Email already exists' });
        }

        const encryptedPassword = await bcrypt.hash(password, 10);

        const saveData = await userModel.create({
            name,
            email,
            password: encryptedPassword
        });

        res.status(201).json({
            message: 'User created successfully',
            saveData
        });
    } catch (error) {
        res.status(500).send({ message: 'Server error' });
    }
});




// Login API

app.post('/api/login', async (req, res) => {
    try {

        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).send({
                message: 'All fields are required'
            });
        }

        const emailExist = await userModel.findOne({ email });

        if (!emailExist) {
            return res.status(400).send({
                message: 'Invalid email or password'
            });
        }

        // console.log(emailExist)

        const validPassword = await bcrypt.compare(password, emailExist.password);

        if (!validPassword) {
            return res.status(400).send({
                message: 'Invalid email or password'
            })
        }

        res.status(200).send({
            message: 'Login successful'
        })
    } catch (error) {
        console.log(error);

    }

});


// Get all todo API

app.get('/api/getalltodo', async (req, res) => {
    try {
        const allTodo = await todoModel.find();
        res.status(200).json({
            message: 'All todo',
            allTodo
        });
    } catch (error) {
        res.status(500).send({ message: 'Server error' });
    }
});



// Create todo API

app.post('/api/addtodo', async (req, res) => {
    try {
        const { todo } = req.body;

        if (!todo) {
            return res.status(400).send({ message: "Input can't be empty" });
        }

        const saveTodo = await todoModel.create({
            todo
        });

        res.status(201).json({
            message: 'Todo created successfully',
            saveTodo
        });
    } catch (error) {
        res.status(500).send({ message: 'Server error' });
    }
});


// Update todo API

app.put('/api/updatetodo', async (req, res) => {
    try {
        const { id, todo } = req.body;
        const updatedObj = {
            todo
        }
        const updateTodo = await todoModel.findByIdAndUpdate(id, updatedObj);
        res.status(200).json({
            message: 'Todo updated successfully',
            updateTodo
        });

    } catch (error) {
        res.status(500).send({ message: 'Server error' });
    }
});



// Delete todo API

app.delete('/api/deletetodo/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const deleteTodo = await todoModel.findByIdAndDelete(id);
        res.status(200).json({
            message: 'Todo deleted successfully',
            deleteTodo
        });
    } catch (error) {
        res.status(500).send({ message: 'Server error' });
    }
});



app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
