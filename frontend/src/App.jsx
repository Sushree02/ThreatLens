import { useState } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Results from './pages/Results';

export default function App() {
  const [result, setResult] = useState(null);

  function handleResult(data) {
    setResult(data);
  }

  function handleReset() {
    setResult(null);
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        {result ? <Results result={result} onReset={handleReset} /> : <Home onResult={handleResult} />}
      </main>
      <Footer />
    </div>
  );
}
