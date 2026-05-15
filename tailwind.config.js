/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './data/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'primary':          '#3BAEFF',
        'primary-dark':     '#1A8FE3',
        'primary-light':    '#EAF5FF',
        'ssuew-black':      '#1A2340',
        'ssuew-white':      '#FFFFFF',
        'ssuew-gray-100':   '#F0F7FF',
        'ssuew-gray-200':   '#D6E9FF',
        'ssuew-gray-600':   '#6B7A99',
        'error':            '#E53E3E',
        'success-bg':       '#E6FFED',
        'success-border':   '#68D391',
        'success-text':     '#276749',
      },
      fontFamily: {
        sans:    ['var(--font-inter)',    'system-ui', 'sans-serif'],
        display: ['var(--font-jakarta)', 'var(--font-inter)', 'sans-serif'],
      },
      fontSize: {
        'display-xl': ['clamp(2.2rem, 5vw, 3.8rem)',   { lineHeight: '1.1', fontWeight: '700' }],
        'display-lg': ['clamp(1.8rem, 3.5vw, 2.8rem)', { lineHeight: '1.2', fontWeight: '700' }],
      },
      borderRadius: {
        'brand':    '16px',
        'brand-sm': '8px',
      },
      boxShadow: {
        'brand':       '0 4px 24px rgba(59,174,255,0.12)',
        'brand-hover': '0 8px 40px rgba(59,174,255,0.22)',
      },
      maxWidth: {
        'brand': '1200px',
      },
    },
  },
  plugins: [],
}
