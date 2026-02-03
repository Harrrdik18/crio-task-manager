import React, { useState, useEffect } from 'react';
import { Container, Typography, Button, CssBaseline, Box } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import TaskTable from './components/TaskTable';
import TaskModal from './components/TaskModal';
import api from './api/axios';

function App() {
  const [tasks, setTasks] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  const fetchTasks = async () => {
    try {
      const response = await api.get('/tasks');
      setTasks(response.data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  useEffect(() => {
    fetchTasks();
    // Optional: Poll for updates to check deadline expiry in real-time
    const interval = setInterval(fetchTasks, 60000); 
    return () => clearInterval(interval);
  }, []);

  const handleOpenModal = (task = null) => {
    setEditingTask(task);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setEditingTask(null);
  };

  const handleCreateOrUpdate = async (formData) => {
    try {
      if (editingTask) {
        // When editing, we might not be sending a file, so backend handles it.
        // Also note: The modal sends generic FormData. 
        // Our backend PUT endpoint uses JSON currently in the controller "Task.findById(req.params.id)... req.body".
        // BUT the TaskModal sends FormData.
        // We need to adjust backend or frontend to match.
        // Since backend PUT endpoint expects JSON body (req.body usually parsed from JSON unless multer is used),
        // and our TaskModal sends FormData (multipart), 
        // we should probably just send JSON for updates if we aren't updating file, OR update backend to handle multipart on PUT.
        // Given the requirement "Add Task" modal has file, let's assume Edit might too.
        // However, standard fetch with default express.json() wont parse multipart.
        // Check backend routes again: `router.put('/:id', taskController.updateTask);` does NO `upload.single`.
        // So for now, Edit won't support file update.
        // I will convert formData to JSON object for Edit if file is not supported in Edit.
        
        const data = {};
        formData.forEach((value, key) => data[key] = value);
        // Note: this drops the file if it's a File object, which is good since backend PUT doesn't support it yet.
        
        await api.put(`/tasks/${editingTask._id}`, data);
      } else {
        // POST supports multipart
        await api.post('/tasks', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
      }
      fetchTasks();
    } catch (error) {
      console.error('Error saving task:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/tasks/${id}`);
      fetchTasks();
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  const handleMarkDone = async (task) => {
    try {
      await api.put(`/tasks/${task._id}`, { status: 'DONE' });
      fetchTasks();
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  return (
    <React.Fragment>
      <CssBaseline />
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom align="center" color="primary" sx={{ fontWeight: 'bold' }}>
          Task Manager
        </Typography>
        
        <Box display="flex" justifyContent="flex-end" mb={2}>
          <Button 
            variant="contained" 
            startIcon={<AddIcon />} 
            onClick={() => handleOpenModal()}
            size="large"
            sx={{ borderRadius: 2 }}
          >
            Add Task
          </Button>
        </Box>

        <TaskTable 
          tasks={tasks} 
          onEdit={handleOpenModal} 
          onDelete={handleDelete}
          onMarkDone={handleMarkDone}
        />

        <TaskModal
          open={modalOpen}
          handleClose={handleCloseModal}
          handleSubmit={handleCreateOrUpdate}
          task={editingTask}
        />
      </Container>
    </React.Fragment>
  );
}

export default App;
