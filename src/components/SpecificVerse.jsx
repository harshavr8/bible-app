import { useState } from 'react';

export default function SpecificVerse() {
  const [query, setQuery] = useState('Ezekiel 38:21');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');
    setResult(null);  

    const cleanedQuery = query.trim().replace(/\s+/g, ' ');
    if (cleanedQuery.length < 3) {
      setError('Please enter a valid passage (e.g., "Ezekiel 38:21").');
      return;
    }

    setLoading(true);

    try {
      const url = `https://labs.bible.org/api/?passage=${encodeURIComponent(cleanedQuery)}&formatting=plain&type=json`;
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error('Failed to fetch passage');
      }

      const data = await response.json();

      if (!Array.isArray(data) || data.length === 0) {
        throw new Error('Passage not found');
      }

      const firstVerse = data[0];
      let reference;
      if (data.length === 1) {
        reference = `${firstVerse.bookname} ${firstVerse.chapter}:${firstVerse.verse}`;
      } else {
        reference = `${firstVerse.bookname} ${firstVerse.chapter}:${data[0].verse}-${data[data.length - 1].verse}`;
      }

      const text = data.map(verse => (verse.text ? verse.text.trim() : '')).join(' ');

      setResult({ reference, text });
    } catch (err) {
      setError(err.message || 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  }

  function handleCopy() {
    if (!result) return;
    navigator.clipboard.writeText(`${result.reference} — ${result.text}`);
  }

  return (
    <section className="card">
      <header className="card-head">
        <h2>Get Specific Verse</h2>
      </header>

      <form className="row" onSubmit={handleSubmit}>
        <input
          className="input"
          placeholder='e.g., "Ezekiel 38:21" or  John 1:1"'
          value={query}
          onChange={e => setQuery(e.target.value)}
          aria-label="Passage"
        />
        <button className="btn" type="submit" disabled={loading}>
          {loading ? 'Fetching…' : 'Get'}
        </button>
      </form>

      {error && <p className="err">{error}</p>}

      {result && (
        <article className="verse">
          <span className="chip">{result.reference}</span>
          <p className="verse-text">{result.text}</p>
          <div className="actions">
            <button className="btn ghost" onClick={handleCopy}>Copy</button>
          </div>
        </article>
      )}
    </section>
  );
}
