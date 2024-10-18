import React, { useState, useRef, useEffect } from "react";
import "./styles/JavaScriptIDE.css";

const JavaScriptIDE = () => {
  const [htmlCode, setHtmlCode] = useState(`<h1 id='secret'>Hello World</h1>`);
  const [cssCode, setCssCode] = useState(`h1 {
color: blue;
}
.white-bg{
background: white;
}
`);
  const [jsCode, setJsCode] = useState(`document.getElementById('secret').classList.add('white-bg');`);
  const outputFrameRef = useRef(null);

  const runCode = () => {
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
  };

  const handleRunCodeAndScroll = () => {
    // Run the code to update iframe
    runCode();

    // Scroll the window after updating the iframe
    setTimeout(() => {
      window.scrollTo({
        top: document.documentElement.scrollHeight,
        behavior: "smooth",
      });
    }, 100); // Small delay to ensure iframe has time to update
  };
  useEffect(()=> {
    runCode();
    document.getElementById('root').classList.add('bg-white');
  })
  return (
    <div
      style={{
        fontFamily: "Arial, sans-serif",
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        margin: 0,
        padding: 0,
      }}
    >
        <h1>JavaScript Code Compiler</h1>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          height: "60%",
          padding: "10px",
        }}
      >
        <label htmlFor="html-area">HTML Code</label>
        <textarea
          id="html-area"
          name="html-area"
          style={{
            height: "100px",
            border: "1px solid #ddd",
            marginBottom: "10px",
            fontFamily: "monospace",
            fontSize: "14px",
          }}
          placeholder="Write HTML code here"
          value={htmlCode}
          onChange={(e) => setHtmlCode(e.target.value)}
        />
        <label htmlFor="css-area">CSS Code</label>
        <textarea
          id="css-area"
          name="css-area"
          style={{
            height: "100px",
            border: "1px solid #ddd",
            marginBottom: "10px",
            fontFamily: "monospace",
            fontSize: "14px",
          }}
          placeholder="Write CSS code here"
          value={cssCode}
          onChange={(e) => setCssCode(e.target.value)}
        />
        <label htmlFor="javascript-area">JavaScript Code</label>
        <textarea
          id="javascript-area"
          name="javascript-area"
          style={{
            height: "100px",
            border: "1px solid #ddd",
            marginBottom: "10px",
            fontFamily: "monospace",
            fontSize: "14px",
          }}
          placeholder="Write JavaScript code here"
          value={jsCode}
          onChange={(e) => setJsCode(e.target.value)}
        />
      </div>
      <button
        onClick={handleRunCodeAndScroll}
        style={{
          padding: "10px 0px",
          backgroundColor: "#4CAF50",
          color: "white",
          border: "none",
          cursor: "pointer",
          marginBottom: "10px",
        }}
      >
        Run Code
      </button>
      <iframe
        ref={outputFrameRef}
        style={{ width: "100%", height: "200px", border: "1px solid #ddd" }}
        title="Output Frame"
      />
    </div>
  );
};

export default JavaScriptIDE;
