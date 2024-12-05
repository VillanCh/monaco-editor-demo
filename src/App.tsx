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
      node.style.width = '320px';
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
      
      // 创建按钮容器
      const buttonContainer = document.createElement('div');
      buttonContainer.style.display = 'flex';
      buttonContainer.style.gap = '4px';
      buttonContainer.style.flexWrap = 'wrap';

      // 创建气泡提示
      const createTooltip = (message: string) => {
        const tooltip = document.createElement('div');
        tooltip.style.position = 'absolute';
        tooltip.style.bottom = 'calc(100% + 8px)';
        tooltip.style.left = '50%';
        tooltip.style.transform = 'translateX(-50%)';
        tooltip.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
        tooltip.style.color = 'white';
        tooltip.style.padding = '4px 8px';
        tooltip.style.borderRadius = '4px';
        tooltip.style.fontSize = '12px';
        tooltip.style.whiteSpace = 'nowrap';
        tooltip.style.opacity = '0';
        tooltip.style.transition = 'opacity 0.3s';
        tooltip.textContent = message;
        return tooltip;
      };

      const createButton = (text: string) => {
        const buttonWrapper = document.createElement('div');
        buttonWrapper.style.position = 'relative';
        
        const button = document.createElement('button');
        button.innerText = text;
        button.style.padding = '4px 8px';
        button.style.backgroundColor = 'rgba(0, 122, 204, 0.4)';
        button.style.border = '1px solid rgba(255, 255, 255, 0.1)';
        button.style.borderRadius = '4px';
        button.style.color = 'white';
        button.style.cursor = 'pointer';
        button.style.transition = 'all 0.3s ease';
        button.style.fontSize = '11px';
        
        const tooltip = createTooltip(`${text}成功`);
        buttonWrapper.appendChild(button);
        buttonWrapper.appendChild(tooltip);

        button.addEventListener('mouseenter', () => {
          button.style.backgroundColor = 'rgba(0, 122, 204, 0.6)';
        });
        button.addEventListener('mouseleave', () => {
          button.style.backgroundColor = 'rgba(0, 122, 204, 0.4)';
        });
        button.addEventListener('click', () => {
          tooltip.style.opacity = '1';
          setTimeout(() => {
            tooltip.style.opacity = '0';
          }, 3000);
        });

        return buttonWrapper;
      };

      const detailsButton = createButton('查看详情');
      const prevButton = createButton('上一个');
      const nextButton = createButton('下一个');
      const dataFlowButton = createButton('数据流图');

      buttonContainer.appendChild(detailsButton);
      buttonContainer.appendChild(prevButton);
      buttonContainer.appendChild(nextButton);
      buttonContainer.appendChild(dataFlowButton);

      node.innerHTML = '<div style="margin-bottom:10px">这里的代码有点问题</div>';
      node.appendChild(buttonContainer);

      node.addEventListener('mouseenter', () => {
        node.style.background = 'rgba(255, 0, 0, 0.7)';
        arrow.style.borderBottomColor = 'rgba(255, 0, 0, 0.7)';
      });

      node.addEventListener('mouseleave', () => {
        node.style.background = 'rgba(255, 0, 0, 0.5)';
        arrow.style.borderBottomColor = 'rgba(255, 0, 0, 0.5)';
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
