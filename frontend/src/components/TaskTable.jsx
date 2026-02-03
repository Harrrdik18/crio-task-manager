import React from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, IconButton, Chip } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import DownloadIcon from '@mui/icons-material/Download';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

const TaskTable = ({ tasks, onEdit, onDelete, onMarkDone }) => {
  const getStatus = (task) => {
    const now = new Date();
    const deadline = new Date(task.deadline);
    // Reset time for accurate date comparison if needed, but simple comparison works
    const isPastDeadline = now > deadline;
    
    if (task.status === 'DONE') {
      return isPastDeadline ? 'Achieved' : 'Completed';
    } else {
      return isPastDeadline ? 'Failed' : 'In Progress';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Achieved': return 'success';
      case 'Completed': return 'success'; // or 'primary'
      case 'Failed': return 'error';
      case 'In Progress': return 'warning'; // or 'info'
      default: return 'default';
    }
  };

  const handleDownload = (taskId) => {
    window.open(`http://localhost:5000/tasks/${taskId}/download`, '_blank');
  };

  return (
    <TableContainer component={Paper} sx={{ mt: 4, boxShadow: 3 }}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell><strong>Title</strong></TableCell>
            <TableCell><strong>Description</strong></TableCell>
            <TableCell><strong>Deadline</strong></TableCell>
            <TableCell><strong>Status</strong></TableCell>
            <TableCell><strong>Actions</strong></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {tasks.length === 0 ? (
             <TableRow>
               <TableCell colSpan={5} align="center">No tasks found</TableCell>
             </TableRow>
          ) : (
            tasks.map((task) => {
              const displayStatus = getStatus(task);
              return (
                <TableRow key={task._id}>
                  <TableCell>{task.title}</TableCell>
                  <TableCell>{task.description}</TableCell>
                  <TableCell>{new Date(task.deadline).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <Chip label={displayStatus} color={getStatusColor(displayStatus)} variant="outlined" />
                  </TableCell>
                  <TableCell>
                    {task.status !== 'DONE' && (
                        <IconButton color="success" onClick={() => onMarkDone(task)} title="Mark as Done">
                            <CheckCircleIcon />
                        </IconButton>
                    )}
                    <IconButton color="primary" onClick={() => onEdit(task)} title="Edit">
                      <EditIcon />
                    </IconButton>
                    <IconButton color="error" onClick={() => onDelete(task._id)} title="Delete">
                      <DeleteIcon />
                    </IconButton>
                    {task.linkedFile && (
                      <IconButton color="info" onClick={() => handleDownload(task._id)} title="Download File">
                        <DownloadIcon />
                      </IconButton>
                    )}
                  </TableCell>
                </TableRow>
              );
            })
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default TaskTable;
