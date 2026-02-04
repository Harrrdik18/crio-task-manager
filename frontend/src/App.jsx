import React, { useState, useEffect } from 'react';
import { Container, CssBaseline, Box, AppBar, Toolbar, Typography, Fab } from '@mui/material';
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
        // Convert formData to JSON for update since backend might verify this way
        // note: file update is skipped as per plan discussion unless backend supports checks
        const data = {};
        formData.forEach((value, key) => data[key] = value);
        
        await api.put(`/tasks/${editingTask._id}`, data);
      } else {
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
      <AppBar position="static">
        <Toolbar>
           <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Task Manager
          </Typography>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ py: 4, minHeight: '80vh', position: 'relative', display: 'flex', flexDirection: 'column' }}>
        
        {tasks.length > 0 ? (
            <TaskTable 
              tasks={tasks} 
              onEdit={handleOpenModal} 
              onDelete={handleDelete}
              onMarkDone={handleMarkDone}
            />
        ) : (
            <Box display="flex" justifyContent="center" alignItems="center" flexGrow={1}>
               <Typography variant="h5" color="textSecondary">
                 No tasks found!
               </Typography>
            </Box>
        )}

        <Fab 
            color="primary" 
            aria-label="add" 
            onClick={() => handleOpenModal()}
            sx={{ position: 'fixed', bottom: 32, right: 32 }}
        >
            <AddIcon />
        </Fab>

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
