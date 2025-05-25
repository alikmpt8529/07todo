import React, { useState } from 'react';
import './App.css';

function App() {
  const [username, setUsername] = useState('');
  const [loggedIn, setLoggedIn] = useState(false);
  const [task, setTask] = useState('');
  const [tasks, setTasks] = useState([]);

  // ログイン処理
  const handleLogin = () => {
    if (username.trim() === '') {
      alert('ユーザー名を入力してください');
      return;
    }
    setLoggedIn(true);
  };

  // タスク追加
  const handleAdd = () => {
    if (task.trim() === '') return;
    if (tasks.some(t => t.text === task.trim() && t.user === username)) {
      alert('同じタスクが既に存在します。');
      return;
    }
    setTasks([...tasks, { 
      text: task.trim(),
      done: false,
      user: username // 追加
    }]);
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
  };

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
  // 表示用：現在のユーザーのタスクのみ
  const userTasks = tasks.filter(t => t.user === username);
  const remaining = userTasks.filter(t => !t.done).length;

  // ログアウト処理
  const handleLogout = () => {
    setLoggedIn(false);
    setUsername('');
  };

  // ログイン画面
  if (!loggedIn) {
    return (
      <div className="login-area">
        <h2>ログイン</h2>
        <input
          type="text"
          value={username}
          onChange={e => setUsername(e.target.value)}
          placeholder="ユーザー名を入力"
        />
        <button onClick={handleLogin}>ログイン</button>
      </div>
    );
  }

  // タスク管理画面
  return (
    <div className="todo-app">
      <h1>ToDoリスト</h1>
      <div style={{ width: '100%', textAlign: 'center', marginBottom: 8 }}>
        {username} さん、残りタスク: {remaining}
        <button style={{marginLeft: 16}} onClick={handleLogout}>ログアウト</button>
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
      <ul className={userTasks.length > 0 ? "task-list has-task" : "task-list"}>
        {userTasks.map((t, i) => (
          <li key={i} className={t.done ? 'done' : ''}>
            <label>
              <input
                type="checkbox"
                checked={t.done}
                onChange={() => {
                  // 全体tasksの中で該当タスクのインデックスを取得
                  const globalIndex = tasks.findIndex(
                    taskObj => taskObj.text === t.text && taskObj.user === username
                  );
                  handleCheck(globalIndex);
                }}
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
