import React from 'react'

interface LanguageSelectionProps {
  selectedLanguage: string
  onLanguageChange: (language: string) => void
}

const LANGUAGES = [
  { label: 'English', value: 'English' },
  { label: 'Svenska', value: 'Swedish' },
  { label: 'Español', value: 'Spanish' },
  { label: 'Français', value: 'French' },
  { label: 'Deutsch', value: 'German' },
]

const LanguageSelection: React.FC<LanguageSelectionProps> = ({ selectedLanguage, onLanguageChange }) => {
  return (
    <div className="language-selection" style={{ marginBottom: '20px' }}>
      <label htmlFor="language-select" style={{ marginRight: '10px', color: '#888' }}>Story Language:</label>
      <select
        id="language-select"
        value={selectedLanguage}
        onChange={(e) => onLanguageChange(e.target.value)}
        style={{
          padding: '5px 10px',
          borderRadius: '4px',
          background: '#1a1a1a',
          color: '#d4af37',
          border: '1px solid #444',
          cursor: 'pointer'
        }}
      >
        {LANGUAGES.map((lang) => (
          <option key={lang.value} value={lang.value}>
            {lang.label}
          </option>
        ))}
      </select>
    </div>
  )
}

export default LanguageSelection
