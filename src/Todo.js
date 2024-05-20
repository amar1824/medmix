import React, { useState, useEffect } from 'react';
import { Grid, TextField, Button, Checkbox,  Box, Paper } from '@mui/material';

export default function TodoList() {
  const [tasks, setTasks] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [filter, setFilter] = useState('all');
  const [editMode, setEditMode] = useState(null);
  const [editText, setEditText] = useState(''); 

  
  useEffect(() => {
    const savedTasks = localStorage.getItem('tasks');
    if (savedTasks) {
      setTasks(JSON.parse(savedTasks));
    }
  }, []);

 
  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  const addTask = () => {
    if (inputValue.trim() !== '') {
      setTasks([...tasks, { id: Date.now(), text: inputValue, completed: false }]);
      setInputValue('');
    }
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  const editTask = (id, newText) => {
    setTasks(tasks.map(task => {
      if (task.id === id) {
        return { ...task, text: newText };
      }
      return task;
    }));
    setEditMode(null); 
  };

  const toggleTaskCompletion = (id) => {
    setTasks(tasks.map(task => {
      if (task.id === id) {
        return { ...task, completed: !task.completed };
      }
      return task;
    }));
  };

  const handleEditButtonClick = (task) => {
    setEditMode(task.id);
    setEditText(task.text);
  };

  const handleSaveEdit = (id) => {
    if (editText.trim() !== '') {
      editTask(id, editText);
    }
  };

  const filteredTasks = tasks.filter(task => {
    if (filter === 'completed') {
      return task.completed;
    } else if (filter === 'active') {
      return !task.completed;
    }
    return true;
  });

  return (
    <Box className="todo-list" sx={{ padding: 2 }}>
      <h1>Todo List</h1>
      <Grid container spacing={1} alignItems="center">
        <Grid item xs={8}>
          <TextField
            fullWidth
            type="text"
            placeholder="Add new task"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
          />
        </Grid>
        <Grid item xs={4}>
          <Button variant="outlined" onClick={addTask} fullWidth>Add</Button>
        </Grid>
      </Grid>
      <Box sx={{ marginTop: 2, marginBottom: 2 }}>
        <Button onClick={() => setFilter('all')}>All</Button>
        <Button onClick={() => setFilter('completed')}>Completed</Button>
        <Button onClick={() => setFilter('active')}>Active</Button>
      </Box>
      <Box component="ul" sx={{ padding: 0, listStyle: 'none' }}>
        {filteredTasks.map(task => (
          <Paper component="li" key={task.id} sx={{ marginBottom: '10px', padding: '10px' }}>
            <Grid container alignItems="center" spacing={1}>
              <Grid item xs={1}>
                <Checkbox checked={task.completed} onChange={() => toggleTaskCompletion(task.id)} />
              </Grid>
              <Grid item xs={7}>
                {editMode === task.id ? (
                  <TextField
                    fullWidth
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    autoFocus
                    InputProps={{ style: { textDecoration: task.completed ? 'line-through' : 'none' } }}
                  />
                ) : (
                  <Box
                    onDoubleClick={() => handleEditButtonClick(task)}
                    sx={{
                      textDecoration: task.completed ? 'line-through' : 'none',
                      cursor: 'pointer',
                      width: '100%',
                      wordBreak: 'break-word' 
                    }}
                  >
                    {task.text}
                  </Box>
                )}
              </Grid>
              <Grid item xs={4} sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
                {editMode === task.id ? (
                  <Button variant="outlined" onClick={() => handleSaveEdit(task.id)}>Save</Button>
                ) : (
                  <Button variant="outlined" onClick={() => handleEditButtonClick(task)}>Edit</Button>
                )}
                <Button style={{ backgroundColor: 'red', color: 'white' }} onClick={() => deleteTask(task.id)}>Delete</Button>
              </Grid>
            </Grid>
          </Paper>
        ))}
      </Box>
    </Box>
  );
}
