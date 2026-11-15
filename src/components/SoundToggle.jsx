import { useState } from 'react';
import { sound } from '../audio/SoundEngine.js';
export default function SoundToggle() {
  const [enabled, setEnabled] = useState(true);
  return <button className="sound-toggle" type="button" aria-pressed={enabled} onClick={() => { const next = !enabled; setEnabled(next); sound.setEnabled(next); }}><span>{enabled ? '◖)))' : '◖×'}</span> SOUND {enabled ? 'ON' : 'OFF'}</button>;
}
