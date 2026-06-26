import React, { useState, useRef, useEffect } from 'react';

const BAD_WORDS = ['kill','murder','sex','porn','naked','nude','sexual','penis','vagina','orgasm','escort','prostitute','strip','xxx','nsfw','hookup','horny','milf','sugar daddy','sugar baby','onlyfans','blowjob','anal','bdsm','kink','fetish','slut','whore','drug','cocaine','heroin','weed','marijuana','meth','hate','racist','nazi','terrorist','fuck','shit','bitch','ass','damn'];

function hasBadWords(text) {
  const lower = text.toLowerCase();
  return BAD_WORDS.some(w => lower.includes(w));
}

const COLORS = ['#6C5CE7', '#00B894', '#FDCB6E', '#E17055', '#0984E3', '#00CEC9', '#FD79A8', '#A29BFE', '#55EFC4', '#FAB1A0'];

function DecisionWheel({ options, onResult }) {
  const canvasRef = useRef(null);
  const [spinning, setSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [selectedIndex, setSelectedIndex] = useState(null);

  const numSlices = options.length || 2;
  const sliceAngle = 360 / numSlices;

  useEffect(() => {
    drawWheel(rotation);
  }, [rotation, options]);

  const drawWheel = (rot) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const w = canvas.width;
    const h = canvas.height;
    const cx = w / 2;
    const cy = h / 2;
    const r = Math.min(cx, cy) - 10;

    ctx.clearRect(0, 0, w, h);

    for (let i = 0; i < numSlices; i++) {
      const startAngle = ((rot + i * sliceAngle) * Math.PI) / 180;
      const endAngle = ((rot + (i + 1) * sliceAngle) * Math.PI) / 180;

      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.arc(cx, cy, r, startAngle, endAngle);
      ctx.closePath();
      ctx.fillStyle = COLORS[i % COLORS.length];
      ctx.fill();
      ctx.strokeStyle = '#fff';
      ctx.lineWidth = 2;
      ctx.stroke();

      const midAngle = (startAngle + endAngle) / 2;
      const textR = r * 0.6;
      ctx.save();
      ctx.translate(cx + Math.cos(midAngle) * textR, cy + Math.sin(midAngle) * textR);
      ctx.rotate(midAngle);
      ctx.fillStyle = '#fff';
      ctx.font = 'bold 12px sans-serif';
      ctx.textAlign = 'center';
      const label = options[i] || `Option ${i + 1}`;
      ctx.fillText(label.length > 10 ? label.slice(0, 10) + '...' : label, 0, 0);
      ctx.restore();
    }

    ctx.beginPath();
    ctx.arc(cx, cy, 12, 0, 2 * Math.PI);
    ctx.fillStyle = '#fff';
    ctx.fill();
    ctx.strokeStyle = '#6C5CE7';
    ctx.lineWidth = 3;
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(cx + r + 10, cy);
    ctx.lineTo(cx + r + 25, cy - 10);
    ctx.lineTo(cx + r + 25, cy + 10);
    ctx.closePath();
    ctx.fillStyle = '#E17055';
    ctx.fill();
  };

  const spin = () => {
    if (spinning || options.length < 2) return;
    if (options.some(hasBadWords)) {
      alert('Please keep it positive! Remove inappropriate content.');
      return;
    }
    setSpinning(true);
    setSelectedIndex(null);
    const spins = 3 + Math.floor(Math.random() * 3);
    const extraAngle = Math.floor(Math.random() * 360);
    const totalRotation = rotation + spins * 360 + extraAngle;
    setRotation(totalRotation);

    setTimeout(() => {
      const normalized = totalRotation % 360;
      const index = Math.floor((360 - normalized) / sliceAngle) % numSlices;
      const finalIndex = index < 0 ? index + numSlices : index;
      setSelectedIndex(finalIndex);
      setSpinning(false);
      if (onResult && options[finalIndex]) {
        onResult(options[finalIndex]);
      }
    }, 2000);
  };

  return (
    <div className="wheel-container">
      <canvas ref={canvasRef} width="280" height="280" className="wheel-canvas" />
      <button onClick={spin} disabled={spinning || options.length < 2} className="wheel-spin-btn">
        {spinning ? 'Spinning...' : 'Spin the Wheel'}
      </button>
      {selectedIndex !== null && (
        <div className="wheel-result">
          <strong>Result:</strong> {options[selectedIndex]}
        </div>
      )}
      {options.length < 2 && <p className="wheel-hint">Enter at least 2 options above</p>}
    </div>
  );
}

export default DecisionWheel;
