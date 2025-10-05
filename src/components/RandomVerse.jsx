import { useState } from 'react';

export default function RandomVerse() {
  const [verse, setVerse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function getRandomVerse() {
    setError('');
    setLoading(true);

    try {
      const response = await fetch('https://labs.bible.org/api/?passage=random&formatting=plain&type=json');
      if (!response.ok) {
        throw new Error('Could not fetch a random verse.');
      }
      const data = await response.json();
      const verseData = data && data[0];
      if (!verseData) {
        throw new Error('Received unexpected data from the server.');
      }
      setVerse({
        reference: `${verseData.bookname} ${verseData.chapter}:${verseData.verse}`,
        text: verseData.text ? verseData.text.trim() : '',
      });
    } catch (err) {
      setError(err.message || 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  }

  function handleCopy() {
    if (!verse) return;
    navigator.clipboard.writeText(`${verse.reference} — ${verse.text}`);
  }

  return (
    <section className="card">
      <header className="card-head">
        <h2>Random Verse</h2>
        <button
          className="btn"
          onClick={getRandomVerse}
          disabled={loading}
        >
          {loading ? 'Fetching…' : 'Get Random'}
        </button>
      </header>

      {error && <p className="err">{error}</p>}

      {verse && (
        <article className="verse">
          <span className="chip">{verse.reference}</span>
          <p className="verse-text">{verse.text}</p>
          <div className="actions">
            <button className="btn ghost" onClick={handleCopy}>
              Copy
            </button>
          </div>
        </article>
      )}
    </section>
  );
}
