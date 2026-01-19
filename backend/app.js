/*
CONFIGURATIONS & IMPORTS
*/
require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const app = express();
const PORT = 3000;
const mongoose = require('mongoose');
const Task = require('./models/task');

/*
DATABASE CONNECTION
*/
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.mongo_url);
        console.log('Connected to MongoDB');
        app.listen(PORT, () => {
        console.log(`Server is running at http://localhost:${PORT}`);
        });
    } catch (err) {
        console.error('Could not connect to MongoDB...', err);
        process.exit(1);
    }
};

connectDB();

/*
MIDDLEWARES
*/
app.use(morgan('dev'));
app.use(express.json());

/*
ROUTES
*/
app.get('/api/tasks', async (req, res) => {
    try {
        const tasks = await Task.find();
        res.json(tasks);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching tasks', error: err });
    }
});

app.get('/api/tasks/:id', async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);
        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }
        res.json(task);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching task', error: err });
    }
});

app.post('/api/tasks', async (req, res) => {
    try{
        const task = new Task({
        title: req.body.title,
        completed: req.body.completed || false
    });
    const savedTask = await task.save();
    res.status(201).json(savedTask);
    } catch(err) {
    res.status(500).json({ message: 'Error saving task', error: err });
    }
});

app.patch('/api/tasks/:id', async (req, res) => {
    try {
        const updatedTask = await Task.findByIdAndUpdate(
            req.params.id,
            req.body,
            {new: true, runValidators: true}
        );
        if (!updatedTask) {
            return res.status(404).json({ message: 'Task not found' });
        }
        res.json(updatedTask);
    } catch (err) {
        res.status(500).json({ message: 'Error updating task', error: err });
    }
});

app.delete('/api/tasks/:id', async (req, res) => {
    try {
        const deletedTask = await Task.findByIdAndDelete(req.params.id);
        if (!deletedTask) {
            return res.status(404).json({ message: 'Task not found' });
        }
        res.json({ message: 'Task deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Error deleting task', error: err });
    }
});


/*
ERROR HANDLING
*/