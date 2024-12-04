import "./styles.css";
import MonacoEditor from "@monaco-editor/react";
import { useEffect, useRef, useState } from "react";
import type * as monaco from "monaco-editor/esm/vs/editor/editor.api";

// 配置 Monaco Editor 的 workers
export default function App() {
  const [code, setCode] = useState(`
// 在这里输入你的代码
<div className="h-screen w-full bg-gray-900 p-4">
  <div className="mb-4">
    <h1 className="text-2xl font-bold text-white">Monaco Editor Demo</h1>
  </div>
  <div className="h-[80vh] rounded-lg overflow-hidden border border-gray-700">
    <Editor
      height="100%"
      defaultLanguage="javascript"
      defaultValue={code}
      theme="vs-dark"
      onChange={handleEditorChange}
      options={{
        minimap: { enabled: true },
        fontSize: 14,
        lineNumbers: "on",
        roundedSelection: false,
        scrollBeyondLastLine: false,
        automaticLayout: true
      }}
    />
  </div>
</div>
  `);
  const [editor, setEditor] = useState<monaco.editor.IStandaloneCodeEditor>(
    null as any
  );

  const handleEditorChange = (value: string | undefined) => {
    if (value) setCode(value);
  };

  useEffect(() => {
    if (!editor) {
      return;
    }
    let model = editor.getModel();
  }, [editor]);

  return (
    <div className="h-screen w-full bg-gray-900 p-4" style={{ height: 100 }}>
      <div className="mb-4">
        <h1 className="text-2xl font-bold text-white">Monaco Editor Demo</h1>
      </div>
      <div
        className="h-[80vh] rounded-lg overflow-hidden border border-gray-700"
        style={{ height: 800 }}
      >
        <MonacoEditor
          height="100%"
          defaultLanguage="javascript"
          defaultValue={code}
          theme="vs-dark"
          onChange={handleEditorChange}
          onMount={(editor) => {
            setEditor(editor);
          }}
          options={{
            minimap: { enabled: true },
            fontSize: 14,
            lineNumbers: "on",
            roundedSelection: false,
            scrollBeyondLastLine: false,
            automaticLayout: true,
          }}
        />
      </div>
    </div>
  );
}
