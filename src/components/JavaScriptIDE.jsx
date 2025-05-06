import React, { useState, useRef, useEffect, useCallback } from "react";

const JavaScriptIDE = () => {
  const [darkMode, setDarkMode] = useState(false); // State to manage dark mode
  const [htmlCode, setHtmlCode] = useState(`<h1 id='secret'>Hello World</h1>`);
  const [cssCode, setCssCode] = useState(`h1 {
color: blue;
text-align: center;
}
.white-bg{
background: white;
}
`);
  const [jsCode, setJsCode] = useState(
    `document.getElementById('secret').classList.add('white-bg');`
  );
  const outputFrameRef = useRef(null);

  const runCode = useCallback(() => {
    const outputDocument =
      outputFrameRef.current.contentDocument ||
      outputFrameRef.current.contentWindow.document;
    outputDocument.open();
    outputDocument.write(`
            <html>
                <head>
                    <style>${cssCode}</style>
                </head>
                <body>
                    ${htmlCode}
                    <script>${jsCode}</script>
                </body>
            </html>
        `);
    outputDocument.close();
  }, [htmlCode, cssCode, jsCode]);

  const handleRunCodeAndScroll = () => {
    runCode();
    setTimeout(() => {
      window.scrollTo({
        top: document.documentElement.scrollHeight,
        behavior: "smooth",
      });
    }, 100);
  };

  useEffect(() => {
    // Run code when the component mounts
    runCode();
  });

  return (
    <div
      className={`min-h-screen ${
        darkMode ? "bg-slate-800" : "bg-gray-100"
      } flex flex-col p-6 font-sans`}
    >
      <h1
        className={`text-3xl font-bold ${
          darkMode ? "text-white" : "text-gray-800"
        } mb-2 text-center`}
      >
        JavaScript Code Compiler
      </h1>
      <div className="text-xl italic text-gray-500 text-center mb-8">
        <div>
          <div className="mb-4">Test out your code!</div>
          <div className="text-sm">
            <button className="p-1" onClick={() => setDarkMode(!darkMode)}>
              Turn on {darkMode ? "Light Mode" : "Dark Mode"}
            </button>
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-4 mb-6 lg:grid lg:grid-cols-3 lg:gap-6">
        <div className="flex flex-col">
          <label
            htmlFor="html-area"
            className={`text-sm font-medium ${
              darkMode ? "text-white bg-gray-700" : "text-gray-700 bg-gray-200"
            }  mb-1 text-center  rounded-lg shadow-sm p-2`}
          >
            HTML Code
          </label>
          <textarea
            id="html-area"
            name="html-area"
            className={`h-40 p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 font-mono text-sm resize-none hover:shadow-md ${
              darkMode ? "text-white bg-gray-800" : "text-black bg-white"
            }`}
            placeholder="Write HTML code here"
            value={htmlCode}
            onChange={(e) => setHtmlCode(e.target.value)}
          />
        </div>
        <div className="flex flex-col">
          <label
            htmlFor="css-area"
            className={`text-sm font-medium ${
              darkMode ? "text-white bg-blue-900" : "text-gray-700 bg-blue-200"
            }  mb-1 text-center  rounded-lg shadow-sm p-2`}
          >
            CSS Code
          </label>
          <textarea
            id="css-area"
            name="css-area"
            className={`h-40 p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 font-mono text-sm resize-none hover:shadow-md ${
              darkMode ? "text-white bg-gray-800" : "text-black bg-white"
            }`}
            placeholder="Write CSS code here"
            value={cssCode}
            onChange={(e) => setCssCode(e.target.value)}
          />
        </div>
        <div className="flex flex-col">
          <label
            htmlFor="javascript-area"
            className={`text-sm font-medium ${
              darkMode
                ? "text-white bg-yellow-500"
                : "text-gray-700 bg-yellow-200"
            }  mb-1 text-center rounded-lg shadow-sm p-2`}
          >
            JavaScript Code
          </label>
          <textarea
            id="javascript-area"
            name="javascript-area"
            className={`h-40 p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 font-mono text-sm resize-none hover:shadow-md ${
              darkMode ? "text-white bg-gray-800" : "text-black bg-white"
            }`}
            placeholder="Write JavaScript code here"
            value={jsCode}
            onChange={(e) => setJsCode(e.target.value)}
          />
        </div>
      </div>
      <div className="text-center">
        <button
          onClick={handleRunCodeAndScroll}
          className="w-50 bg-blue-600 text-white px-6 py-2 rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 mb-6"
        >
          Run Code
        </button>
      </div>
      <iframe
        ref={outputFrameRef}
        className="w-full h-64 border border-gray-300 rounded-lg shadow-sm bg-white"
        title="Output Frame"
      />
    </div>
  );
};

export default JavaScriptIDE;
