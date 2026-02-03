const Task = require('../models/Task');

// Get all tasks
exports.getTasks = async (req, res) => {
  try {
    const tasks = await Task.find().select('-linkedFile.data'); // Exclude file data for list view to save bandwidth
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Create a task
exports.createTask = async (req, res) => {
  try {
    const { title, description, deadline } = req.body;
    
    let linkedFile = null;
    if (req.file) {
      linkedFile = {
        data: req.file.buffer,
        contentType: req.file.mimetype,
        originalName: req.file.originalname
      };
    }

    const newTask = new Task({
      title,
      description,
      deadline,
      linkedFile
    });

    const savedTask = await newTask.save();
    res.status(201).json(savedTask);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Update a task
exports.updateTask = async (req, res) => {
  try {
    const { title, description, status, deadline } = req.body;
    // Note: This endpoint currently assumes we're not updating the file here, but we can enable it if needed.
    // The requirement mainly focused on updating status or details.
    
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: 'Task not found' });

    if (title) task.title = title;
    if (description) task.description = description;
    if (status) task.status = status;
    if (deadline) task.deadline = deadline;

    const updatedTask = await task.save();
    res.json(updatedTask);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Delete a task
exports.deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: 'Task not found' });

    await task.deleteOne();
    res.json({ message: 'Task deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Download file
exports.downloadFile = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task || !task.linkedFile || !task.linkedFile.data) {
      return res.status(404).json({ message: 'File not found' });
    }

    res.set('Content-Type', task.linkedFile.contentType);
    res.set('Content-Disposition', `attachment; filename="${task.linkedFile.originalName || 'download.pdf'}"`);
    res.send(task.linkedFile.data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
