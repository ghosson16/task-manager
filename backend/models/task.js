const mongoose = require('mongoose');
const taskSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    completed: {
        type: Boolean,
        default: false
    },
    priority: {
        type: String,
        enum: ['low', 'medium', 'high'],
        default: 'low'
    },
    category: {
        type: String,
        enum: ['work', 'personal', 'study', 'urgent'],
        default: 'personal'
    },
    dueDate: {
        type: Date
    }
}, { timestamps: true });

module.exports = mongoose.model('Task', taskSchema);