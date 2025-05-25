import React, { useState } from 'react';
import './App.css';

function App() {
  const [task, setTask] = useState('');
  const [tasks, setTasks] = useState([]);

  // タスク追加
  const handleAdd = () => {
    if (task.trim() === '') return;
    if (tasks.some(t => t.text === task.trim())) {
      alert('同じタスクが既に存在します。');
      return;
    }
    setTasks([...tasks, { 
      text: task.trim(),
      done: false }
    ]);
    setTask('');
  };
  // タスク一覧をCSV形式でダウンロード
  const handleDownloadCSV = () => {
    const header = 'タスク,完了\n';
    const rows = tasks.map(t => 
      `"${t.text.replace(/"/g, '""')}",${t.done ? '済' : '未'}`
    ).join('\n');
    const csv = header + rows;
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = 'tasks.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }
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
  const remaining= tasks.filter(t => !t.done).length;

  return (
    <div className="todo-app">
      <h1>ToDoリスト</h1>
      <div style={{ width: '100%', textAlign: 'center', marginBottom: 8 }}>
        残りタスク: {remaining}
      </div>
      <div className="input-area">
        <input
          type="text"
          value={task}
          onChange={e => setTask(e.target.value)}
          placeholder="やることを追加"
        />
        <button onClick={handleAdd}>追加</button>
      </div>
      <button className="csv-btn" onClick={handleDownloadCSV} style={{marginBottom: 8}}>
        CSVダウンロード
      </button>
      <ul className={tasks.length > 0 ? "task-list has-task" : "task-list"}>
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
