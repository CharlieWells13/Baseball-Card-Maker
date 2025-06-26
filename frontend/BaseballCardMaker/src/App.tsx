import { useState, useEffect} from 'react'
import './App.css'
import loadingGif from './assets/Loading.gif'





function QueryPlayer(firstName: string, lastName: string): Promise<any> {
  return fetch('/api/query-player', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ firstName, lastName }),
  })
    .then(res => res.json())
    .catch(err => {
      console.error("Error sending player query:", err);
      throw err;
    });
}

function App() {
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')

  const [isQuerying, setIsQuerying] = useState(false)

  type BatterStatsSeason = {
    season: string;
    [key: string]: string | number;
  };

  const visibleColumns = ["Season", "Team", "Age", "G", "AB", "PA", "H", "1B", "2B", "3B", "HR", "R", "RBI", "BB"];



  const [currentStats, setCurrentStats] = useState<BatterStatsSeason[]>([]);


  return(
    <div>
      <label>
        Enter First And Last Name to Query:
        <input 
          value={firstName} 
          onChange={(e) => setFirstName(e.target.value)}
          name='firstName' 
          placeholder='First Name'
        />
        <input 
          value={lastName} 
          onChange={(e) => setLastName(e.target.value)}
          name='lastName' 
          placeholder='Last Name'
        />
        <button
        disabled={isQuerying}
        onClick={() => {
          setIsQuerying(true)
          QueryPlayer(firstName, lastName).then(data => {
            console.log(data)
            setCurrentStats(data.stats || []);
            setIsQuerying(false)
          });
        }}
        >
      Query Player
      </button>
       
      </label>
      <img hidden={!isQuerying} src={loadingGif} sizes='100px' className='loading'></img>
      <div>
        <h3>Player Stats:</h3>
        {currentStats.length > 0 && (
        <div style={{ overflowX: 'auto' }}>
          <table className='stats-table'>
            <thead>
              <tr>
                {visibleColumns.map((col) => (
                  <th key={col}>{col}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {currentStats.map((row, index) => (
                <tr key={index}>
                  {visibleColumns.map((col) => (
                    <td key={col}>{row[col] ?? "-"}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      </div>
      

    </div>

  );
}

export default App
