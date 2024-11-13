import React from 'react';

const LanguageSelector = ({ language, setLanguage }) => {
  return (
    <select value={language} onChange={(e) => setLanguage(e.target.value)}>
      <option value="JavaScript">JavaScript</option>
      <option value="Python">Python</option>
      <option value="Java">Java</option>
      <option value="C++">C++</option>
      <option value="C">C</option>
      <option value="Ruby">Ruby</option>
      <option value="PHP">PHP</option>
      <option value="Go">Go</option>
    </select>
  );
};

export default LanguageSelector;
