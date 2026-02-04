import React, { useState, useEffect } from 'react';
import { Modal, Box, Typography, TextField, Button, Stack } from '@mui/material';
import UploadFileIcon from '@mui/icons-material/UploadFile';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 500,
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
        {/* Ideally the title is not needed in the design screenshot inside the modal like this, 
            but it's good UX. The screenshot shows inputs directly. I will keep inputs clean. */}
        
        <Stack spacing={2}>
            <TextField
                fullWidth
                label="Title *"
                variant="outlined"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
            />
            <TextField
                fullWidth
                label="Description *"
                variant="outlined"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                multiline
                rows={3}
            />
            <TextField
                fullWidth
                label="Deadline *"
                type="date"
                InputLabelProps={{ shrink: true }}
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
            />
            
            {!task && (
                <Button
                    variant="contained"
                    component="label"
                    startIcon={<UploadFileIcon />}
                    sx={{ width: 'fit-content', textTransform: 'none' }}
                >
                    UPLOAD PDF
                    <input
                        type="file"
                        hidden
                        onChange={(e) => setFile(e.target.files[0])}
                    />
                </Button>
            )}
            {file && <Typography variant="caption">{file.name}</Typography>}

            <Stack direction="row" spacing={2} justifyContent="flex-end" mt={2}>
                <Button onClick={handleClose} color="primary" sx={{ color: 'text.secondary' }}>
                    CANCEL
                </Button>
                <Button
                    variant="contained"
                    onClick={onSubmit}
                    sx={{ px: 4 }}
                >
                    {task ? 'UPDATE' : 'SAVE'}
                </Button>
            </Stack>
        </Stack>
      </Box>
    </Modal>
  );
};

export default TaskModal;
