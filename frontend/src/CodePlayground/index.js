import React, { useState, useEffect } from 'react';
import Editor from '@monaco-editor/react';
import './index.css';
import { ResizableBox } from 'react-resizable';
import 'react-resizable/css/styles.css';

const CodePlayground = () => {
  const [html, setHtml] = useState(`
    <body>
      <div class="container">
        <h1>Hello, World!</h1>
        <p>Welcome to the Code Playground.</p>
        <button onclick="handleClick()">Click Me!</button>
      </div>
    </body>
  `);

  const [css, setCss] = useState(`
    .container {
      text-align: center;
      padding: 20px;
      font-family: Arial, sans-serif;
    }
    h1 {
      color: #4CAF50;
    }
    p {
      color: #555;
    }
    button {
      padding: 10px 20px;
      font-size: 16px;
      background-color: #4CAF50;
      color: white;
      border: none;
      cursor: pointer;
    }
    button:hover {
      background-color: #45a049;
    }
  `);

  const [js, setJs] = useState(`
    function handleClick() {
      alert('Button clicked!');
      console.log('Button clicked - logged!');
    }
  `);

  const [activeEditor, setActiveEditor] = useState('html');
  const [terminalInput, setTerminalInput] = useState('');
  const [terminalOutput, setTerminalOutput] = useState('');

  const captureConsoleLog = () => {
    const originalLog = console.log;
    console.log = (...args) => {
      setTerminalOutput((prevOutput) => `${prevOutput}\n${args.join(' ')}`);
      originalLog(...args);
    };
  };

  const generateOutput = () => {
    captureConsoleLog(); // Invoke captureConsoleLog here

    return `
      <!DOCTYPE html>
      <html>
        <head>
          <style>${css}</style>
        </head>
        ${html}
        <script>
          ${js}
          window.addEventListener('load', () => {
            // Logs from js will be captured here
          });
        </script>
      </html>
    `;
  };

  useEffect(() => {
    // Ensure that logs are captured in the terminal when code changes
  }, [html, css, js]);

  const handleTerminalCommand = () => {
    let result = '';
    // Handle specific commands
    if (terminalInput.trim() === 'clear') {
      result = 'Terminal cleared!';
      setTerminalOutput('');
    } else if (terminalInput.trim() === 'hello') {
      result = 'Hello, world!';
    } else {
      result = `Unrecognized command: ${terminalInput}`;
    }
    setTerminalOutput((prevOutput) => `${prevOutput}\n> ${terminalInput}\n${result}`);
    setTerminalInput('');
  };

  return (
    <div className="playground-container">
      <div className="editor-container">
        <div className="editor-dropdown">
          <label htmlFor="editor-select">Select Editor: </label>
          <select
            id="editor-select"
            onChange={(e) => setActiveEditor(e.target.value)}
            value={activeEditor}
          >
            <option value="html">HTML</option>
            <option value="css">CSS</option>
            <option value="js">JavaScript</option>
          </select>
        </div>

        {activeEditor === 'html' && (
          <div className="editor">
            <h2>HTML</h2>
            <Editor
              height="100vh"
              defaultLanguage="html"
              value={html}
              onChange={(value) => setHtml(value)}
              options={{
                minimap: { enabled: false },
                wordWrap: 'on',
                automaticLayout: true,
                autoClosingTags: true,
                autoClosingBrackets: 'languageDefined',
                suggestOnTriggerCharacters: true,
              }}
            />
          </div>
        )}

        {activeEditor === 'css' && (
          <div className="editor">
            <h2>CSS</h2>
            <Editor
              height="100vh"
              defaultLanguage="css"
              value={css}
              onChange={(value) => setCss(value)}
              options={{
                minimap: { enabled: false },
                wordWrap: 'on',
                automaticLayout: true,
                autoClosingBrackets: 'languageDefined',
              }}
            />
          </div>
        )}

        {activeEditor === 'js' && (
          <div className="editor">
            <h2>JavaScript</h2>
            <Editor
              height="100vh"
              defaultLanguage="javascript"
              value={js}
              onChange={(value) => setJs(value)}
              options={{
                minimap: { enabled: false },
                wordWrap: 'on',
                automaticLayout: true,
                autoClosingBrackets: 'languageDefined',
                autoClosingQuotes: true,
              }}
            />
          </div>
        )}

        <div className="terminal-container">
          <h2>Terminal</h2>
          <input
            type="text"
            value={terminalInput}
            onChange={(e) => setTerminalInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleTerminalCommand()}
            placeholder="Type a command..."
          />
          <div className="terminal-output">
            {/* Display terminal output */}
            <p>{terminalOutput || 'Waiting for command...'}</p>
          </div>
        </div>
      </div>

      {/* The resizable container for the preview */}
      <ResizableBox
        width={500}
        height={window.innerHeight} // Use the full height of the window
        axis="x"
        minConstraints={[300, window.innerHeight]}
        maxConstraints={[1000, window.innerHeight]}
        resizeHandles={['e']}
        className="resizable-preview"
      >
        <div className="preview-container">
          <h2>Preview</h2>
          <iframe
            title="output"
            srcDoc={generateOutput()}
            sandbox="allow-scripts"
            frameBorder="0"
            width="100%"
            height="100%"
          />
        </div>
      </ResizableBox>
    </div>
  );
};

export default CodePlayground;
