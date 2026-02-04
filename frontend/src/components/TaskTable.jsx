import React from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, Chip, Typography, Box } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import DownloadIcon from '@mui/icons-material/Download';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

const TaskTable = ({ tasks, onEdit, onDelete, onMarkDone }) => {
  const getDeadlineStatus = (task) => {
    if (!task.deadline) return '';
    const now = new Date();
    const deadline = new Date(task.deadline);
    const isPastDeadline = now > deadline;
    
    if (task.status === 'DONE') {
      return isPastDeadline ? 'Achieved' : 'Completed';
    } else {
      return isPastDeadline ? 'Failed' : 'In Progress';
    }
  };

  const handleDownload = (taskId) => {
    window.open(`http://localhost:5000/tasks/${taskId}/download`, '_blank');
  };

  return (
    <TableContainer component={Paper} sx={{ mt: 4, boxShadow: 3, borderRadius: 2 }}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell><strong>Title</strong></TableCell>
            <TableCell><strong>Description</strong></TableCell>
            <TableCell><strong>Deadline</strong></TableCell>
            <TableCell><strong>Status</strong></TableCell>
            <TableCell><strong>Action</strong></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {tasks.map((task) => {
            const deadlineStatus = getDeadlineStatus(task);
            return (
              <TableRow key={task._id} hover>
                <TableCell>{task.title}</TableCell>
                <TableCell>{task.description}</TableCell>
                <TableCell>
                    <Box display="flex" flexDirection="column">
                        <Typography variant="body2">{new Date(task.deadline).toLocaleDateString()}</Typography>
                        <Typography variant="caption" color="textSecondary">
                            {deadlineStatus}
                        </Typography>
                    </Box>
                </TableCell>
                <TableCell>
                  <Chip 
                    label={task.status} 
                    color={task.status === 'DONE' ? 'success' : 'warning'} 
                    size="small" 
                    sx={{ fontWeight: 'bold', minWidth: 80 }}
                  />
                </TableCell>
                <TableCell>
                  {task.linkedFile && (
                    <IconButton color="primary" onClick={() => handleDownload(task._id)} title="Download File" size="small">
                      <DownloadIcon fontSize="small" />
                    </IconButton>
                  )}
                  <IconButton color="primary" onClick={() => onEdit(task)} title="Edit" size="small">
                    <EditIcon fontSize="small" />
                  </IconButton>
                   <IconButton color="error" onClick={() => onDelete(task._id)} title="Delete" size="small">
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                   {task.status !== 'DONE' && (
                      <IconButton color="success" onClick={() => onMarkDone(task)} title="Mark as Done" size="small">
                          <CheckCircleIcon fontSize="small" />
                      </IconButton>
                  )}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default TaskTable;
