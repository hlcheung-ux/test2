import React from 'react';
import { Poem } from '../types';
import { Scroll, BookOpen } from 'lucide-react';

interface MenuProps {
  poems: Poem[];
  onSelect: (poem: Poem) => void;
}

const Menu: React.FC<MenuProps> = ({ poems, onSelect }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <div className="mb-10 text-center">
        <div className="inline-block p-4 border-4 border-stone-800 rounded-lg mb-4 bg-stone-200 shadow-xl">
          <h1 className="text-5xl md:text-6xl font-calligraphy text-stone-900 mb-2">墨韻背書</h1>
        </div>
        <p className="text-stone-600 text-lg tracking-widest font-serif">步步為營 ・ 銘記於心</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl">
        {poems.map((poem) => (
          <button
            key={poem.id}
            onClick={() => onSelect(poem)}
            className="group relative flex flex-col items-center p-6 bg-white border-2 border-stone-300 rounded-sm hover:border-red-800 hover:shadow-lg transition-all duration-300"
          >
            <div className="absolute -top-3 -right-3 w-8 h-8 bg-red-800 text-white rounded-full flex items-center justify-center font-serif shadow-md group-hover:scale-110 transition-transform">
               <BookOpen size={14} />
            </div>
            <div className="mb-4 text-stone-400 group-hover:text-red-800 transition-colors">
              <Scroll size={48} strokeWidth={1} />
            </div>
            <h2 className="text-2xl font-bold text-stone-800 mb-2">{poem.title}</h2>
            <p className="text-stone-500 font-serif">{poem.author}</p>
            <div className="mt-4 w-full border-t border-stone-200 pt-2">
               <span className="text-xs text-stone-400">共 {poem.chunks.length} 句</span>
            </div>
          </button>
        ))}
      </div>
      
      <footer className="mt-16 text-stone-400 text-sm">
        Designed for Classical Chinese Memorization
      </footer>
    </div>
  );
};

export default Menu;
