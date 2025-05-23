import React, { useState } from 'react';
import './App.css';

function App() {
  const [task, setTask] = useState('');
  const [tasks, setTasks] = useState([]);

  // タスク追加
  const handleAdd = () => {
    if (task.trim() === '') return;
    setTasks([...tasks, { text: task, done: false }]);
    setTask('');
  };

  // チェックボックス切り替え
  const handleCheck = (index) => {
    const newTasks = tasks.map((t, i) =>
      i === index ? { ...t, done: !t.done } : t
    );
    setTasks(newTasks);
  };

  // 完了タスク一括削除
  const handleDeleteDone = () => {
    setTasks(tasks.filter((t) => !t.done));
  };

  return (
    <div className="todo-app">
      <h1>ToDoリスト</h1>
      <div className="input-area">
        <input
          type="text"
          value={task}
          onChange={e => setTask(e.target.value)}
          placeholder="task"
        />
        <button onClick={handleAdd}>追加</button>
      </div>
      <ul className="task-list">
        {tasks.map((t, i) => (
          <li key={i} className={t.done ? 'done' : ''}>
            <label>
              <input
                type="checkbox"
                checked={t.done}
                onChange={() => handleCheck(i)}
              />
              {t.text}
            </label>
          </li>
        ))}
      </ul>
      <button className="delete-btn" onClick={handleDeleteDone}>
        完了したタスクを削除
      </button>
    </div>
  );
}

export default App;
