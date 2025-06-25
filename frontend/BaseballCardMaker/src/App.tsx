import { useState, useEffect} from 'react'
import './App.css'

function StatsBlock() {
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetch('/api/data')
    .then(response => response.json())
    .then(data => setMessage(data.message))
    .catch(console.error);
  }, []);

  return (
    <div>
      <h1>Flask + React Interaction</h1>
      <p>{message}</p>
    </div>
  );
}

function App() {
  return(
    <StatsBlock />
  );
}

export default App
