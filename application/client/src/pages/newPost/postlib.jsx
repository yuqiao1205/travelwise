// import { themes } from '../../config/themes.js'
import React from 'react'

export function themeCheckboxes (themes, selectedThemes, handleThemeChange) {
  return themes.map(theme => (
    <div key={theme.tid} className='theme'>
      <input
        type='checkbox'
        checked={selectedThemes.includes(theme.name)}
        onChange={() => handleThemeChange(theme.tid)}
        id={`theme-${theme.tid}`}
      />
      <label htmlFor={`theme-${theme.tid}`}>{theme.name}</label>
    </div>
  ))
}
