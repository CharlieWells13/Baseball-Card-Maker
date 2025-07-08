import { useState} from 'react'
import './App.css'
import loadingGif from './assets/Loading.gif'

import { Mosaic, MosaicWindow } from 'react-mosaic-component';
import type { MosaicNode } from 'react-mosaic-component';

import 'react-mosaic-component/react-mosaic-component.css';
import '@blueprintjs/core/lib/css/blueprint.css';
import '@blueprintjs/icons/lib/css/blueprint-icons.css';

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



export type ViewId = 'stats' | 'image';
const TITLE_MAP: Record<ViewId, string> = {
  stats: 'Stats Block',
  image: 'Player Image'
};


function App() {
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')

  const [isQuerying, setIsQuerying] = useState(false)
  const [playerLoaded, setPlayerLoaded] = useState(false)

  const [imageLoaded, setImageLoaded] = useState(false)
  const [imageFile, setImageFile] = useState('')

  const[playerNotFoundError, setPlayerNotFoundError] = useState(false)

  const [mosaicTree, setMosaicTree] = useState<MosaicNode<ViewId> | null>(null);

  const visibleColumns = ["Season", "Team", "Age", "G", "AB", "PA", "H", "1B", "2B", "3B", "HR", "R", "RBI", "BB"];

  const [currentStats, setCurrentStats] = useState<BatterStatsSeason[]>([]);


  
  const addStatsBlock = () => {
    setMosaicTree(prev =>
      prev
        ? { direction: 'row', first: prev, second: 'stats' }
        : 'stats'
    );
  };

  const addPlayerImage = () => {
    setMosaicTree(prev =>
      prev
        ? { direction: 'row', first: prev, second: 'image' }
        : 'image'
    );
  };

  return(
    <div>
      <div className='editor-ui-container'>
        <div className='UI'>
          <div className='ui-block'>
            <h1>
              Player Data
            </h1>
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
                setPlayerNotFoundError(false)
                QueryPlayer(firstName, lastName).then(data => {
                  console.log(data)
                  
                  if(data.playerFound){
                    setCurrentStats(data.stats || [])
                    setPlayerNotFoundError(false)
                    setPlayerLoaded(true)
                  }
                  else{
                    setPlayerNotFoundError(true)
                    setCurrentStats([])
                    setPlayerLoaded(false)
                  }

                  setIsQuerying(false)
                });
              }}
              >
            Query Player
            </button>
            
            </label>
            <img hidden={!isQuerying} src={loadingGif} sizes='100px' className='loading-image'></img>
            
            
            <div className="error-message" hidden={!playerNotFoundError}>
              Player not found. Please check the name and try again.
            </div>

            <div className='player-loaded-indicator' hidden={!playerLoaded}>
              Curent Player Loaded: {firstName} {lastName}
            </div>

            <button className='add-stats-block' disabled={!playerLoaded} onClick={addStatsBlock}>
              Add Stats Block
            </button>
          </div>
          
          <div className='ui-block'>
            <h1>
              Player Image
            </h1>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                if (e.target.files && e.target.files.length > 0) {
                  const objectUrl = URL.createObjectURL(e.target.files[0]);
                  setImageFile(objectUrl);
                  setImageLoaded(true);
                }
              }}
            />

            <button className='add-player-image' disabled={!imageLoaded} onClick={addPlayerImage}>
              Add Player Image
            </button>
          </div>
        
        </div>

        <div className='card-editor-wrapper'>
          <div className='card-editor'> 
            <Mosaic<ViewId>
              value={mosaicTree}
              onChange={setMosaicTree}
              renderTile={(id, path) => (
                <MosaicWindow<ViewId> path={path} 
                  title={TITLE_MAP[id]}>
                  {id === 'stats' && (
                    <StatsBlock currentStats={currentStats} visibleColumns={visibleColumns} />
                  )}
                  {id === 'image' && (
                    <img src={imageFile} alt="Uploaded Player" className='player-image' />
                  )}
                </MosaicWindow>
              )}
            />
          </div>
        </div>

      </div>
    </div>

  );
}

export default App
