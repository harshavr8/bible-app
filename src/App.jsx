import RandomVerse from './components/RandomVerse';
import SpecificVerse from './components/SpecificVerse';
import './index.css';

export default function App() {
  return (
    <div className="wrap">
      <header className="top">
        <h1>Bible App</h1>
      </header>

      <main className="grid">
        <RandomVerse />
        <SpecificVerse />
      </main>

      <footer style={{ marginTop: 32, textAlign: 'center', color: '#6b7280' }}>
        <p>
          Scripture quotations are from the{' '}
          <a
            href="https://netbible.com/"
            target="_blank"
            rel="noreferrer"
            style={{
              color: '#2563eb',
              textDecoration: 'underline',
              fontWeight: 500,
            }}
          >
            NET Bible
          </a>.
        </p>
      </footer>
    </div>
  );
}
