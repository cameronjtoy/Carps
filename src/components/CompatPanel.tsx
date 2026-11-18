import type { Issue } from '../lib/compat';

const icon = { error: '⛔', warning: '⚠️', info: 'ℹ️' };

export function CompatPanel({ issues, hasParts }: { issues: Issue[]; hasParts: boolean }) {
  const errors = issues.filter((i) => i.level === 'error').length;
  const warnings = issues.filter((i) => i.level === 'warning').length;
  const status = errors ? 'error' : warnings ? 'warning' : 'ok';
  const headline = !hasParts
    ? 'Add parts to run compatibility checks'
    : errors
      ? `${errors} compatibility problem${errors > 1 ? 's' : ''} found`
      : warnings
        ? `Compatible, with ${warnings} thing${warnings > 1 ? 's' : ''} to check`
        : 'No compatibility issues found';
  return (
    <section className={`compat compat-${hasParts ? status : 'empty'}`} aria-live="polite">
      <h2 className="compat-head">
        <span aria-hidden>{!hasParts ? '🧩' : errors ? '⛔' : warnings ? '⚠️' : '✅'}</span> {headline}
      </h2>
      {issues.length > 0 && (
        <ul className="compat-list">
          {issues.map((i, n) => (
            <li key={n} className={`issue issue-${i.level}`}>
              <span aria-hidden>{icon[i.level]}</span>
              <span>{i.message}</span>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
