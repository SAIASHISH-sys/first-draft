// src/App.tsx

import { useState } from 'react';
import { ArcadeIntro } from './components/Arcadeintro';

// This is a placeholder for your actual website content
const YourMainWebsite = () => (
  <div className="w-full h-screen bg-gray-900 text-white flex items-center justify-center">
    <h1 className="text-5xl font-bold">Welcome to the Website!</h1>
  </div>
);

function App() {
  // State to track if the intro is finished
  const [introFinished, setIntroFinished] = useState(false);

  return (
    <main className="font-sans">
      {/* Conditionally render the intro or the main site.
        The ArcadeIntro component will call setIntroFinished(true)
        when its animation is done.
      */}
      {!introFinished ? (
        <ArcadeIntro onIntroComplete={() => setIntroFinished(true)} />
      ) : (
        <YourMainWebsite />
      )}
    </main>
  );
}

export default App;