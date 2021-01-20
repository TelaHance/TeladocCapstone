import { useMemo } from 'react';
import { createEditor, Editor, Text, Transforms } from 'slate';
import { withReact } from 'slate-react';

/**
 * If text in a node becomes empty, merge the end time of the current node with
 * the previous node (if it exists).
 * @param editor SlateJS Editor
 */
const withMergeNoPrecedingSpace = (editor: Editor) => {
  const { normalizeNode } = editor;
  editor.normalizeNode = (entry) => {
    const [node, path] = entry;
    if (Text.isText(node) && node.text.charAt(0) !== ' ' && path[1] > 0) {
      const [, prevPath] = Editor.previous(editor, { at: path }) ?? [
        undefined,
        undefined,
      ];
      Transforms.mergeNodes(editor, { at: path });
      Transforms.setNodes(editor, { end: node.end }, { at: prevPath });
      return;
    }
    normalizeNode(entry);
  };
  return editor;
};

/**
 * When typing a space (' ') character, create a new node
 * @param editor SlateJS Editor
 */
const withNewNodeOnSpace = (editor: Editor) => {
  const { normalizeNode } = editor;
  editor.normalizeNode = (entry) => {
    const [node, path] = entry;
    if (Text.isText(node) && node.text.length > 0) {
      // Ensure we don't detect the spaces at the beginning of some nodes.
      const offset = node.text.lastIndexOf(' ');
      if (offset !== 0) {
        Transforms.splitNodes(editor, {
          at: { path, offset },
          match: (m) => Text.isText(m),
        });
        const splitIdx = (node.splitIdx as number) ?? 0;
        // Before Node
        Transforms.setNodes(
          editor,
          {
            confidence: 1,
            splitIdx: splitIdx,
          },
          { at: path }
        );
        // After Node
        Transforms.setNodes(
          editor,
          {
            confidence: 1,
            splitIdx: splitIdx + 1,
          },
          { at: [path[0], path[1] + 1] }
        );
        return;
      }
    }
    normalizeNode(entry);
  };
  return editor;
};

type Middleware = (editor: Editor) => Editor;

const initEditor = () => {
  const middleware: Middleware[] = [
    withNewNodeOnSpace,
    withMergeNoPrecedingSpace,
  ];
  let editor = createEditor();
  for (let withMiddleware of middleware) {
    editor = withMiddleware(editor);
  }
  return withReact(editor);
};

export default function useCustomEditor() {
  return useMemo(() => initEditor(), []);
}
