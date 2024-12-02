import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  addTask,
  editTask,
  deleteTask,
  toggleComplete,
} from '../redux/tasksSlice';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

const TaskDashboard = () => {
  const [newTask, setNewTask] = useState({ title: '', description: '', dueDate: '' });
  const [editingTask, setEditingTask] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [taskToDelete, setTaskToDelete] = useState(null);
  const [activeFilter, setActiveFilter] = useState('all'); 
  const tasks = useSelector((state) => state.tasks.tasks);
  const dispatch = useDispatch();

  const handleAddTask = () => {
    if (newTask.title && newTask.description && newTask.dueDate) {
      dispatch(addTask({ ...newTask, id: Date.now(), completed: false }));
      setNewTask({ title: '', description: '', dueDate: '' });
    }
  };

  const handleEditTask = () => {
    if (editingTask && editingTask.title && editingTask.description && editingTask.dueDate) {
      dispatch(editTask({ id: editingTask.id, updates: editingTask }));
      setEditingTask(null);
    }
  };

  const handleDragEnd = (result) => {
    if (!result.destination) return;
  };

  const confirmDeleteTask = () => {
    dispatch(deleteTask(taskToDelete));
    setTaskToDelete(null);
  };

  const filterTasks = () => {
    const currentDate = new Date().toISOString().split('T')[0];
    switch (activeFilter) {
      case 'completed':
        return tasks.filter((task) => task.completed);
      case 'pending':
        return tasks.filter((task) => !task.completed);
      case 'overdue':
        return tasks.filter((task) => !task.completed && task.dueDate < currentDate);
      default:
        return tasks;
    }
  };

  const filterBySearch = (tasks) => {
    return tasks.filter((task) => task.title.toLowerCase().includes(searchTerm.toLowerCase()));
  };

  const filteredTasks = filterBySearch(filterTasks());

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4 sm:px-12">
      <h1 className="text-3xl font-extrabold text-gray-800 mb-6 text-center">Task Manager</h1>

      <div className="flex flex-col sm:flex-row items-center gap-4 mb-6">
        <input
          type="text"
          placeholder="Search tasks..."
          className="flex-1 px-4 py-2 rounded-lg border border-gray-300 shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="flex justify-center gap-4 mb-6">
        {['all', 'completed', 'pending', 'overdue'].map((filter) => (
          <button
            key={filter}
            onClick={() => setActiveFilter(filter)}
            className={`px-4 py-2 rounded-lg font-medium shadow-md ${
              activeFilter === filter
                ? 'bg-blue-500 text-white'
                : 'bg-gray-300 hover:bg-gray-400 text-gray-800'
            }`}
          >
            {filter.charAt(0).toUpperCase() + filter.slice(1)} Tasks
          </button>
        ))}
      </div>

      <div className="bg-white shadow-md rounded-lg p-6 mb-6">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">Add a New Task</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <input
            type="text"
            placeholder="Task Title"
            className="px-4 py-2 rounded-lg border border-gray-300 shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
            value={newTask.title}
            onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
          />
          <input
            type="text"
            placeholder="Description"
            className="px-4 py-2 rounded-lg border border-gray-300 shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
            value={newTask.description}
            onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
          />
          <input
            type="date"
            className="px-4 py-2 rounded-lg border border-gray-300 shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
            value={newTask.dueDate}
            onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
          />
        </div>
        <button
          onClick={handleAddTask}
          className="mt-4 w-full bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-medium shadow-md"
        >
          Add Task
        </button>
      </div>

      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="tasks">
          {(provided) => (
            <ul
              {...provided.droppableProps}
              ref={provided.innerRef}
              className="space-y-4"
            >
              {filteredTasks.map((task, index) => (
                <Draggable key={task.id} draggableId={task.id.toString()} index={index}>
                  {(provided) => (
                    <li
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      className={`bg-white rounded-lg shadow-md p-4 flex justify-between items-center ${
                        activeFilter === 'overdue' && task.dueDate < new Date().toISOString().split('T')[0]
                          ? 'border-l-4 border-red-500'
                          : ''
                      }`}
                    >
                      <div>
                        <h3 className="text-lg font-bold text-gray-700">{task.title}</h3>
                        <p className="text-sm text-gray-500">{task.description}</p>
                        <p className="text-xs text-gray-400">Due: {task.dueDate}</p>
                      </div>
                      <div className="flex items-center space-x-4">
                        <button
                          onClick={() => dispatch(toggleComplete(task.id))}
                          className={`px-4 py-2 rounded-lg font-medium ${
                            task.completed
                              ? 'bg-green-500 hover:bg-green-600 text-white'
                              : 'bg-gray-300 hover:bg-gray-400 text-gray-800'
                          }`}
                        >
                          {task.completed ? 'Completed' : 'Mark Complete'}
                        </button>
                        <button
                          onClick={() => setEditingTask(task)}
                          className="px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => setTaskToDelete(task.id)}
                          className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg"
                        >
                          Delete
                        </button>
                      </div>
                    </li>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </ul>
          )}
        </Droppable>
      </DragDropContext>

      {taskToDelete !== null && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center">
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-sm w-full">
            <p className="text-gray-800 mb-4">Are you sure you want to delete this task?</p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={confirmDeleteTask}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg"
              >
                Confirm
              </button>
              <button
                onClick={() => setTaskToDelete(null)}
                className="bg-gray-300 hover:bg-gray-400 px-4 py-2 rounded-lg"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskDashboard;
