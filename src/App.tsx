import "./styles.css";
import MonacoEditor from "@monaco-editor/react";
import { useEffect, useRef, useState } from "react";
import * as monaco from "monaco-editor/esm/vs/editor/editor.api";

// 配置 Monaco Editor 的 workers
export default function App() {
  const [showBubble, setShowBubble] = useState(true);
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

  const handleMarkerClick = (url: string) => {
    window.open(url, '_blank');
  };

useEffect(() => {
  if (!editor) return;
  const model = editor.getModel();
  if (!model) return;

  // 创建多个装饰器示例
  const decorations = editor.createDecorationsCollection([
    {
      range: new monaco.Range(3, 1, 3, 11111111),
      options: {
        isWholeLine: true,
        className: 'error-line-decoration',
      }
    },
    // {
    //   range: new monaco.Range(5, 1, 5, 1),
    //   options: {
    //     isWholeLine: true,
    //     className: 'warning-line-decoration',
    //     linesDecorationsClassName: 'my-inline-decoration',
    //     glyphMargin: {position: 1},
    //     glyphMarginClassName: 'my-inline-decoration',
    //     glyphMarginHoverMessage: { value: '警告：建议优化此处代码' }
    //   }
    // },
    // {
    //   range: new monaco.Range(7, 1, 7, 1),
    //   options: {
    //     linesDecorationsClassName: 'my-inline-decoration',
    //     glyphMarginClassName: 'my-inline-decoration',
    //     glyphMarginHoverMessage: { value: '普通注释' }
    //   }
    // }
  ]);
  // 创建一个 ContentWidget
  const contentWidget = {
    domNode: (() => {
      const node = document.createElement('div');
      node.className = 'my-content-widget';
      node.style.background = 'rgba(255, 0, 0, 0.5)';
      node.style.padding = '12px';
      node.style.width = '220px';
      node.style.color = '#d4d4d4';
      node.style.borderRadius = '8px';
      node.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.2)';
      node.style.transition = 'all 0.3s ease';
      node.style.marginLeft = '24px';
      node.style.border = '1px solid rgba(255, 255, 255, 0.1)';
      node.style.position = 'relative';

      // 添加箭头
      const arrow = document.createElement('div');
      arrow.style.position = 'absolute';
      arrow.style.top = '-6px';
      arrow.style.left = '10px';
      arrow.style.width = '0';
      arrow.style.height = '0';
      arrow.style.borderLeft = '6px solid transparent';
      arrow.style.borderRight = '6px solid transparent';
      arrow.style.borderBottom = '6px solid rgba(255, 0, 0, 0.5)';
      arrow.style.transition = 'border-bottom-color 0.3s ease';
      node.appendChild(arrow);
      
      const button = document.createElement('button');
      button.innerText = '点击我';
      button.style.padding = '6px 12px';
      button.style.backgroundColor = 'rgba(0, 122, 204, 0.4)';
      button.style.border = '1px solid rgba(255, 255, 255, 0.1)';
      button.style.borderRadius = '4px';
      button.style.color = 'white';
      button.style.cursor = 'pointer';
      button.style.transition = 'all 0.3s ease';
      button.onclick = () => alert('你点击了气泡按钮!');

      node.innerHTML = '<div style="margin-bottom:10px">这里的代码有点问题</div>';
      node.appendChild(button);

      node.addEventListener('mouseenter', () => {
        node.style.background = 'rgba(255, 0, 0, 0.7)';
        arrow.style.borderBottomColor = 'rgba(255, 0, 0, 0.7)';
        button.style.backgroundColor = 'rgba(0, 122, 204, 0.6)';
      });

      node.addEventListener('mouseleave', () => {
        node.style.background = 'rgba(255, 0, 0, 0.5)';
        arrow.style.borderBottomColor = 'rgba(255, 0, 0, 0.5)';
        button.style.backgroundColor = 'rgba(0, 122, 204, 0.4)';
      });

      return node;
    })(),

    getId: () => 'my.content.widget',

    getDomNode: function() {
      return this.domNode;
    },

    getPosition: () => {
      // 获取第3行的内容
      const line3 = model?.getLineContent(3);
      // 获取第3行的长度作为结尾列号
      const endColumn = line3?.length || 0;
      
      return {
        position: {
          lineNumber: 3,
          column: endColumn,
        },
        preference: [monaco.editor.ContentWidgetPositionPreference.EXACT]
      };
    }
  };

  // 添加 widget 到编辑器
  editor.addContentWidget(contentWidget);
  return () => {
    decorations.clear();
  };
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
