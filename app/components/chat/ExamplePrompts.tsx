import React from 'react';

const EXAMPLE_PROMPTS = [
  { text: 'Create a modern React dashboard with charts' },
  { text: 'Build a todo app in React using Tailwind' },
  { text: 'Build a simple blog using Astro' },
  { text: 'Create a cookie consent form using Material UI' },
  { text: 'Make a space invaders game' },
  { text: 'Make a Tic Tac Toe game in html, css and js only' },
];

export function ExamplePrompts(sendMessage?: { (event: React.UIEvent, messageInput?: string): void | undefined }) {
  return (
    <div id="examples" className="relative flex flex-col gap-9 w-full max-w-4xl mx-auto flex justify-center mt-8 px-4">
      <div className="flex flex-wrap justify-center gap-3 mobile-gap-2 fade-in">
        {EXAMPLE_PROMPTS.map((examplePrompt, index: number) => {
          return (
            <button
              key={index}
              type="button"
              onClick={(event) => {
                sendMessage?.(event, examplePrompt.text);
              }}
              className="group relative overflow-hidden rounded-2xl bg-gradient-to-r from-white/10 to-white/5 border border-white/20 hover:border-white/30 text-bolt-elements-textPrimary hover:text-bolt-elements-textPrimary px-6 py-3 mobile-p-2 text-sm mobile-text-sm font-medium transition-all duration-300 ease-out backdrop-blur-sm hover:shadow-lg hover:shadow-purple-500/20 transform hover:scale-105 active:scale-95 touch-friendly"
              style={{
                animationDelay: `${index * 100}ms`,
              }}
            >
              <span className="relative z-10">{examplePrompt.text}</span>
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-violet-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </button>
          );
        })}
      </div>
    </div>
  );
}
