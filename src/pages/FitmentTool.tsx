import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useVehicle, vehicleLabel } from '../context/VehicleContext';
import { diameterChangePct, parseTire, tireDiameter, tireWidthRange, wheelPosition, type WheelSpec } from '../lib/fitment';

interface Setup extends WheelSpec {
  tire: string;
}

const DEFAULT_STOCK: Setup = { diameter: 18, width: 7.5, offset: 48, tire: '215/40R18' };
const DEFAULT_NEW: Setup = { diameter: 18, width: 9.5, offset: 38, tire: '245/40R18' };

function SetupForm({ title, value, onChange }: { title: string; value: Setup; onChange: (s: Setup) => void }) {
  const num = (k: keyof WheelSpec) => (e: React.ChangeEvent<HTMLInputElement>) => onChange({ ...value, [k]: Number(e.target.value) });
  const valid = !!parseTire(value.tire);
  return (
    <fieldset className="setup">
      <legend>{title}</legend>
      <label>Diameter (in)<input type="number" step={1} min={13} max={24} value={value.diameter} onChange={num('diameter')} /></label>
      <label>Width (in)<input type="number" step={0.5} min={5} max={13} value={value.width} onChange={num('width')} /></label>
      <label>Offset (ET mm)<input type="number" step={1} min={-50} max={80} value={value.offset} onChange={num('offset')} /></label>
      <label>Tire size<input value={value.tire} onChange={(e) => onChange({ ...value, tire: e.target.value })} aria-invalid={!valid} placeholder="245/40R18" /></label>
      {!valid && <span className="oos small">Use the format 245/40R18</span>}
    </fieldset>
  );
}

/** Front-view cross section: hub face at x=0, outboard to the right. */
function Diagram({ a, b }: { a: Setup; b: Setup }) {
  const ta = parseTire(a.tire);
  const tb = parseTire(b.tire);
  if (!ta || !tb) return null;
  // Vertical is true scale; horizontal is exaggerated 2x so offset changes are visible.
  const pxPerMm = 0.8;
  const pxPerIn = 25.4 * 0.4;
  const W = 520;
  const H = 320;
  const cx = W / 2 + 20;
  const cy = H / 2;
  const rect = (s: Setup, t: NonNullable<typeof ta>, cls: string) => {
    const half = (s.width * 25.4) / 2;
    const outer = half - s.offset;
    const inner = -(half + s.offset);
    const tireW = t.width;
    const tireInner = (outer + inner) / 2 - tireW / 2;
    const dia = tireDiameter(t) * pxPerIn;
    const rim = s.diameter * pxPerIn;
    return (
      <g className={cls}>
        <rect x={cx + tireInner * pxPerMm} y={cy - dia / 2} width={tireW * pxPerMm} height={dia} rx={14} className="tire" />
        <rect x={cx + inner * pxPerMm} y={cy - rim / 2} width={(outer - inner) * pxPerMm} height={rim} rx={3} className="rim" />
      </g>
    );
  };
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="fit-diagram" role="img" aria-label="Cross-section comparing stock and new wheel position">
      <line x1={cx} y1={10} x2={cx} y2={H - 10} className="hub-line" />
      <text x={cx + 4} y={20} className="diagram-label">hub face</text>
      <text x={14} y={H - 12} className="diagram-label">← inboard (strut)</text>
      <text x={W - 14} y={H - 12} textAnchor="end" className="diagram-label">outboard (fender) →</text>
      <text x={W - 14} y={20} textAnchor="end" className="diagram-label">width shown 2× scale</text>
      {rect(a, ta, 'setup-a')}
      {rect(b, tb, 'setup-b')}
    </svg>
  );
}

export function FitmentTool() {
  const { vehicle } = useVehicle();
  const [stock, setStock] = useState<Setup>(DEFAULT_STOCK);
  const [next, setNext] = useState<Setup>(DEFAULT_NEW);

  useEffect(() => {
    if (vehicle) setStock({ ...vehicle.stockWheel, tire: vehicle.stockTire });
  }, [vehicle]);

  const ta = parseTire(stock.tire);
  const tb = parseTire(next.tire);
  const pos = wheelPosition(stock, next);
  const pct = ta && tb ? diameterChangePct(ta, tb) : 0;
  const [lo, hi] = tireWidthRange(next.width);
  const sidewall = (t: NonNullable<typeof ta>) => ((t.width * t.aspect) / 100 / 25.4).toFixed(2);

  return (
    <div className="container">
      <div className="page-head">
        <h1>Wheel &amp; tire fitment calculator</h1>
        <p className="muted">
          Compare a new setup against {vehicle ? <>your {vehicleLabel(vehicle)}'s stock wheels</> : 'stock'}. Positive poke means the
          wheel sits further out toward the fender.
        </p>
      </div>
      <div className="fit-tool">
        <div className="fit-forms">
          <SetupForm title={vehicle ? `Stock (${vehicle.chassis})` : 'Current'} value={stock} onChange={setStock} />
          <SetupForm title="New setup" value={next} onChange={setNext} />
        </div>
        <div className="fit-results">
          <Diagram a={stock} b={next} />
          <div className="legend">
            <span className="swatch swatch-a" /> Current <span className="swatch swatch-b" /> New
          </div>
          <div className="stats">
            <div className="stat">
              <span className="stat-label">Poke (outer lip)</span>
              <span className={`stat-value ${pos.outer > 15 ? 'gain-neg' : ''}`}>{pos.outer > 0 ? '+' : ''}{pos.outer} mm</span>
              <span className="stat-delta muted">{pos.outer > 15 ? 'May need fender roll / camber' : pos.outer < -10 ? 'Sits further in (tucked)' : 'About the same'}</span>
            </div>
            <div className="stat">
              <span className="stat-label">Inner clearance</span>
              <span className={`stat-value ${pos.inner > 12 ? 'gain-neg' : ''}`}>{pos.inner > 0 ? '−' : '+'}{Math.abs(pos.inner)} mm</span>
              <span className="stat-delta muted">{pos.inner > 12 ? 'Check strut / spring perch clearance' : 'Closer to strut if negative'}</span>
            </div>
            {ta && tb && (
              <>
                <div className="stat">
                  <span className="stat-label">Overall diameter</span>
                  <span className="stat-value">{tireDiameter(tb).toFixed(2)}"</span>
                  <span className={`stat-delta ${Math.abs(pct) > 3 ? 'gain-neg' : 'muted'}`}>{pct > 0 ? '+' : ''}{pct.toFixed(2)}% vs {tireDiameter(ta).toFixed(2)}"</span>
                </div>
                <div className="stat">
                  <span className="stat-label">Speedo at 60 mph</span>
                  <span className="stat-value">{(60 * (1 + pct / 100)).toFixed(1)} mph</span>
                  <span className="stat-delta muted">actual speed when it reads 60</span>
                </div>
                <div className="stat">
                  <span className="stat-label">Sidewall</span>
                  <span className="stat-value">{sidewall(tb)}"</span>
                  <span className="stat-delta muted">was {sidewall(ta)}"</span>
                </div>
                <div className="stat">
                  <span className="stat-label">Tire width for {next.width}" rim</span>
                  <span className={`stat-value ${tb.width < lo || tb.width > hi ? 'gain-neg' : 'gain-pos'}`}>{tb.width} mm</span>
                  <span className="stat-delta muted">recommended {lo}–{hi} mm</span>
                </div>
              </>
            )}
          </div>
          {tb && tb.rim !== next.diameter && <p className="oos">Tire is for {tb.rim}" rims but the wheel is {next.diameter}".</p>}
          <p className="muted small">Estimates only — suspension, camber, ride height and fender shape all affect real-world clearance. <Link to="/parts/wheels">Browse wheels that fit →</Link></p>
        </div>
      </div>
    </div>
  );
}
