import React, { useState, useEffect } from 'react';
import { Modal, Box, Typography, TextField, Button, Input } from '@mui/material';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
  borderRadius: 2,
};

const TaskModal = ({ open, handleClose, handleSubmit, task }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [deadline, setDeadline] = useState('');
  const [file, setFile] = useState(null);

  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setDescription(task.description);
      // Format date for date input (YYYY-MM-DD)
      const date = new Date(task.deadline);
      setDeadline(date.toISOString().split('T')[0]);
    } else {
      setTitle('');
      setDescription('');
      setDeadline('');
      setFile(null);
    }
  }, [task, open]);

  const onSubmit = () => {
    if (!title || !description || !deadline) return;

    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('deadline', deadline);
    if (file) {
      formData.append('linkedFile', file);
    }

    handleSubmit(formData);
    handleClose();
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <Box sx={style}>
        <Typography variant="h6" component="h2" mb={2}>
          {task ? 'Edit Task' : 'Add New Task'}
        </Typography>
        <TextField
          fullWidth
          label="Title"
          variant="outlined"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          margin="normal"
        />
        <TextField
          fullWidth
          label="Description"
          variant="outlined"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          margin="normal"
          multiline
          rows={3}
        />
        <TextField
          fullWidth
          label="Deadline"
          type="date"
          InputLabelProps={{ shrink: true }}
          value={deadline}
          onChange={(e) => setDeadline(e.target.value)}
          margin="normal"
        />
        {!task && (
          <Input
            type="file"
            onChange={(e) => setFile(e.target.files[0])}
            fullWidth
            sx={{ mt: 2 }}
          />
        )}
        <Button
          variant="contained"
          fullWidth
          sx={{ mt: 3 }}
          onClick={onSubmit}
        >
          {task ? 'Update Task' : 'Add Task'}
        </Button>
      </Box>
    </Modal>
  );
};

export default TaskModal;
