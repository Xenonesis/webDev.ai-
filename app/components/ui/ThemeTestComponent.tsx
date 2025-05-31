import React from 'react';
import { Button } from './Button';
import { Input } from './Input';
import { DialogButton } from './Dialog';

/**
 * Test component to verify UI/UX improvements and theme visibility
 * This component should only be used in development for testing purposes
 */
export function ThemeTestComponent() {
  return (
    <div className="p-8 space-y-8 max-w-4xl mx-auto">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-2">
          <span className="dynamic-branding">webdev.ai</span> Theme Test
        </h1>
        <p className="text-bolt-elements-textSecondary">Testing UI visibility and contrast improvements</p>
      </div>

      {/* Header Branding Test */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-bolt-elements-textPrimary">Branding Visibility Test</h2>
        <div className="bg-gradient-to-r from-white/5 via-white/3 to-transparent backdrop-blur-xl border border-white/10 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <div className="i-ph:sidebar-simple-duotone text-xl text-white/70" />
            <span className="dynamic-branding text-2xl font-bold tracking-tight">webdev.ai</span>
          </div>
        </div>
      </section>

      {/* Button Variants Test */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-bolt-elements-textPrimary">Button Visibility Test</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Button variant="default">Default</Button>
          <Button variant="primary">Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="destructive">Destructive</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="link">Link</Button>
          <Button variant="success">Success</Button>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Button variant="default" disabled>
            Disabled
          </Button>
          <Button variant="primary" disabled>
            Disabled
          </Button>
          <Button variant="secondary" disabled>
            Disabled
          </Button>
          <Button variant="destructive" disabled>
            Disabled
          </Button>
        </div>
      </section>

      {/* Dialog Button Test */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-bolt-elements-textPrimary">Dialog Button Test</h2>
        <div className="flex gap-4">
          <DialogButton type="primary">Primary Dialog</DialogButton>
          <DialogButton type="secondary">Secondary Dialog</DialogButton>
          <DialogButton type="danger">Danger Dialog</DialogButton>
        </div>
      </section>

      {/* Form Input Test */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-bolt-elements-textPrimary">Form Input Visibility Test</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-bolt-elements-textPrimary mb-2">Normal Input</label>
            <Input placeholder="Enter text here..." />
          </div>
          <div>
            <label className="block text-sm font-medium text-bolt-elements-textPrimary mb-2">Disabled Input</label>
            <Input placeholder="Disabled input" disabled />
          </div>
          <div>
            <label className="block text-sm font-medium text-bolt-elements-textPrimary mb-2">Email Input</label>
            <Input type="email" placeholder="email@example.com" />
          </div>
          <div>
            <label className="block text-sm font-medium text-bolt-elements-textPrimary mb-2">Password Input</label>
            <Input type="password" placeholder="Password" />
          </div>
        </div>
      </section>

      {/* Text Contrast Test */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-bolt-elements-textPrimary">Text Contrast Test</h2>
        <div className="space-y-2">
          <p className="text-bolt-elements-textPrimary">
            Primary text - should have high contrast and be easily readable
          </p>
          <p className="text-bolt-elements-textSecondary">Secondary text - should be readable but less prominent</p>
          <p className="text-bolt-elements-textTertiary">Tertiary text - should be subtle but still readable</p>
        </div>
      </section>

      {/* Background Depth Test */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-bolt-elements-textPrimary">Background Depth Test</h2>
        <div className="space-y-4">
          <div className="bg-bolt-elements-bg-depth-1 border border-bolt-elements-borderColor rounded-lg p-4">
            <p className="text-bolt-elements-textPrimary">Depth 1 Background</p>
          </div>
          <div className="bg-bolt-elements-bg-depth-2 border border-bolt-elements-borderColor rounded-lg p-4">
            <p className="text-bolt-elements-textPrimary">Depth 2 Background</p>
          </div>
          <div className="bg-bolt-elements-bg-depth-3 border border-bolt-elements-borderColor rounded-lg p-4">
            <p className="text-bolt-elements-textPrimary">Depth 3 Background</p>
          </div>
          <div className="bg-bolt-elements-bg-depth-4 border border-bolt-elements-borderColor rounded-lg p-4">
            <p className="text-bolt-elements-textPrimary">Depth 4 Background</p>
          </div>
        </div>
      </section>

      {/* Terminal Colors Test */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-bolt-elements-textPrimary">Terminal Colors Test</h2>
        <div className="bg-bolt-elements-terminal-backgroundColor border border-bolt-elements-borderColor rounded-lg p-4 font-mono text-sm">
          <div className="space-y-1">
            <div style={{ color: 'var(--bolt-elements-terminal-textColor)' }}>Normal terminal text</div>
            <div style={{ color: 'var(--bolt-elements-terminal-color-red)' }}>Error: Red terminal text</div>
            <div style={{ color: 'var(--bolt-elements-terminal-color-green)' }}>Success: Green terminal text</div>
            <div style={{ color: 'var(--bolt-elements-terminal-color-yellow)' }}>Warning: Yellow terminal text</div>
            <div style={{ color: 'var(--bolt-elements-terminal-color-blue)' }}>Info: Blue terminal text</div>
            <div style={{ color: 'var(--bolt-elements-terminal-color-magenta)' }}>Debug: Magenta terminal text</div>
            <div style={{ color: 'var(--bolt-elements-terminal-color-cyan)' }}>System: Cyan terminal text</div>
          </div>
        </div>
      </section>

      {/* Accessibility Features Test */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-bolt-elements-textPrimary">Accessibility Features Test</h2>
        <div className="space-y-4">
          <div>
            <label className="required">Required Field</label>
            <Input placeholder="This field is required" className="mt-1" />
          </div>
          <div>
            <label>Field with Error</label>
            <Input placeholder="Error state" className="error mt-1" />
            <div className="error-message">This field has an error</div>
          </div>
          <div>
            <label>Field with Success</label>
            <Input placeholder="Success state" className="success mt-1" />
            <div className="success-message">This field is valid</div>
          </div>
        </div>
      </section>

      {/* Focus States Test */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-bolt-elements-textPrimary">Focus States Test</h2>
        <p className="text-bolt-elements-textSecondary text-sm">Tab through these elements to test focus visibility</p>
        <div className="flex flex-wrap gap-4">
          <Button variant="primary">Focusable Button 1</Button>
          <Button variant="secondary">Focusable Button 2</Button>
          <Input placeholder="Focusable Input" className="w-48" />
          <Button variant="outline">Focusable Button 3</Button>
        </div>
      </section>

      {/* Theme Instructions */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-bolt-elements-textPrimary">Testing Instructions</h2>
        <div className="bg-bolt-elements-bg-depth-2 border border-bolt-elements-borderColor rounded-lg p-4">
          <ul className="space-y-2 text-bolt-elements-textSecondary">
            <li>• Switch between light and dark themes to test visibility</li>
            <li>• Test with dynamic themes enabled/disabled</li>
            <li>• Use Tab key to test focus states</li>
            <li>• Verify all text is readable with sufficient contrast</li>
            <li>• Check that the webdev.ai branding is clearly visible</li>
            <li>• Test button hover and active states</li>
            <li>• Verify form inputs are clearly distinguishable</li>
          </ul>
        </div>
      </section>
    </div>
  );
}
