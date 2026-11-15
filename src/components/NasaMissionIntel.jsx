import { useEffect, useState } from 'react';
import { getAstronomyPictureOfTheDay, getEarthObservations, getMarsRoverPhotos, getMissionImages, getNearEarthObjects } from '../data/nasaService.js';
import { FALLBACK_IMAGES } from '../data/nasaFallback.js';
import { PLANETARY_DATA } from '../data/planetaryData.js';

export default function NasaMissionIntel({ level }) {
  const planet = PLANETARY_DATA[level.planetId];
  const [images, setImages] = useState([]);
  const [extra, setExtra] = useState([]);
  const [apod, setApod] = useState(null);
  const [status, setStatus] = useState('loading');

  useEffect(() => {
    const controller = new AbortController();
    let active = true;
    async function load() {
      try {
        const found = await getMissionImages(planet.nasaQuery, 3, controller.signal);
        let addOn = [];
        if (level.planetId === 'mars') addOn = await getMarsRoverPhotos(1000, 2, controller.signal);
        if (level.planetId === 'asteroidBelt') {
          const start = new Date().toISOString().slice(0, 10);
          const end = new Date(Date.now() + 6 * 86400000).toISOString().slice(0, 10);
          addOn = await getNearEarthObjects(start, end, controller.signal);
        }
        if (level.planetId === 'earthOrbit') addOn = await getEarthObservations(2, controller.signal);
        let astronomyImage = null;
        if (level.planetId === 'alienBase') {
          try { astronomyImage = await getAstronomyPictureOfTheDay(undefined, controller.signal); } catch { /* optional feed: mission briefing remains available */ }
        }
        if (!active) return;
        setImages(found);
        setExtra(addOn);
        setApod(astronomyImage);
        setStatus(found.length || addOn.length || astronomyImage ? 'live' : 'fallback');
      } catch (error) {
        if (!active || error.name === 'AbortError') return;
        setStatus('fallback');
      }
    }
    load();
    return () => { active = false; controller.abort(); };
  }, [level.planetId, planet.nasaQuery]);

  const fallback = FALLBACK_IMAGES[level.planetId];
  return <section className="panel-surface intel-panel">
    <div className="intel-topline"><div><p className="micro-label">MISSION INTELLIGENCE</p><h2>NASA field notes</h2></div><span className={`data-status ${status === 'live' ? 'online' : ''}`}><i />{status === 'loading' ? 'CONNECTING' : status === 'live' ? 'LIVE DATA' : 'OFFLINE BRIEF'}</span></div>
    <div className="intel-visual">
      {images.length ? images.slice(0, 2).map((item) => <a href={item.nasaLink} target="_blank" rel="noreferrer" className="intel-image" key={item.nasaId}><img src={item.image} alt={item.title} loading="lazy" /><span>{item.title}</span></a>) : <a href={fallback.nasaLink} target="_blank" rel="noreferrer" className={`planet-fallback ${fallback.color}`}><span>{fallback.symbol}</span><b>{fallback.title}</b><small>OPEN NASA SOURCE ↗</small></a>}
      {images.length < 2 && <div className="intel-fact"><span>ENVIRONMENTAL READOUT</span><strong>{planet.solarFactor}%</strong><small>Relative solar input index</small><div className="mini-track"><i style={{ width: `${planet.solarFactor}%` }} /></div></div>}
    </div>
    <p className="intel-description">{planet.gameplayEffect}</p>
    <div className="intel-stats"><div><small>SIGNAL DELAY</small><b>{planet.communicationsDelayMinutes} min</b></div><div><small>RADIATION RISK</small><b>{planet.radiationRisk}/100</b></div><div><small>GRAVITY ASSIST</small><b>{planet.gravityAssistAvailable ? 'AVAILABLE' : '—'}</b></div></div>
    {extra.length > 0 && <div className="intel-extra"><b>{level.planetId === 'asteroidBelt' ? 'NEAR-EARTH OBJECT WATCH' : level.planetId === 'mars' ? 'NASA MARS ROVER MISSION IMAGERY' : 'EARTH OBSERVATION'}</b>{extra.slice(0, 2).map((item) => <p key={item.id || item.identifier}>{item.name || item.camera || item.caption || 'Observation'} <small>{item.closeApproachDate || item.earthDate || item.date || ''}</small></p>)}</div>}
    {apod && <a className="apod-card" href={apod.nasaLink} target="_blank" rel="noreferrer">{apod.image && <img src={apod.image} alt={apod.title} loading="lazy" />}<span>NASA / ASTRONOMY PICTURE OF THE DAY</span><b>{apod.title}</b><small>{apod.date} · OPEN SOURCE ↗</small></a>}
    <div className="fact-strip"><span>FIELD NOTE</span><p>{planet.facts.join(' · ')}</p></div>
    <a className="text-link" href={planet.source} target="_blank" rel="noreferrer">EXPLORE NASA REFERENCE <span>↗</span></a>
    <p className="nasa-attribution">Data and imagery courtesy of NASA. This original educational game is not affiliated with or endorsed by NASA.</p>
  </section>;
}
