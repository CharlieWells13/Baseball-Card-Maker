import { useState, useEffect} from 'react'
import './App.css'
import loadingGif from './assets/Loading.gif'

import {
  getPanelElement,
  getPanelGroupElement,
  getResizeHandleElement,
  Panel,
  PanelGroup,
  PanelResizeHandle,
} from "react-resizable-panels";




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

type BatterStatsSeason = {
    season: string;
    [key: string]: string | number;
  };


type StatsBlockProps = {
  currentStats: BatterStatsSeason[];
  visibleColumns: string[];
};


function StatsBlock({ currentStats, visibleColumns }: StatsBlockProps) {
  if (!currentStats.length) return null;
  return(
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
  )
}

function PlayerImage() {
  const [file, setFile] = useState<string | null>(null);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files && e.target.files.length > 0) {
      const objectUrl = URL.createObjectURL(e.target.files[0]);
      setFile(objectUrl);
    }
  }

  return (
    <div className="PlayerImage">
      <h2>Add Image:</h2>
      <input type="file" onChange={handleChange} />
      {file && <img src={file} alt="Uploaded preview" />}
    </div>
  );
}


function App() {
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')

  const [isQuerying, setIsQuerying] = useState(false)

  const visibleColumns = ["Season", "Team", "Age", "G", "AB", "PA", "H", "1B", "2B", "3B", "HR", "R", "RBI", "BB"];

  const [currentStats, setCurrentStats] = useState<BatterStatsSeason[]>([]);

  return(
    <div>
      <div className='editor-ui-container'>
        <div className='UI'>
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

        </div>

        <div className='card-editor-wrapper'>
          <div className='card-editor'> 
            <h3>Player Stats:</h3>
            <StatsBlock currentStats={currentStats} visibleColumns={visibleColumns} />
            <PlayerImage/>
          </div>

        </div>
      </div>
    </div>

  );
}

export default App
