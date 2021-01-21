import { useMemo } from 'react';
import { createEditor, Editor, Text, Transforms } from 'slate';
import { withReact } from 'slate-react';

/**
 * When typing a space (' ') character, create a new node
 * @param editor SlateJS Editor
 */
function withNewNodeOnSpace(editor: Editor) {
  const { normalizeNode } = editor;
  editor.normalizeNode = (entry) => {
    const [node, path] = entry;
    if (Text.isText(node) && node.text.length > 0) {
      // Detect spaces in the node, but NOT as the last character.
      const offset = node.text.indexOf(' ') + 1;
      if (offset > 1 && offset < node.text.length - 1) {
        Transforms.splitNodes(editor, {
          at: { path, offset },
          match: (m) => Text.isText(m),
        });
        const splitIdx = (node.splitIdx as number) ?? 0;
        // Get New Nodes (after Split)
        Transforms.setNodes(
          editor,
          {
            confidence: 1,
            splitIdx: splitIdx,
          },
          { at: path }
        );
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
}

/**
 * Merge two words if no space is at the end of the first word.
 * @param editor SlateJS Editor
 */
function withMergeNoTrailingSpace(editor: Editor) {
  const { normalizeNode } = editor;
  editor.normalizeNode = (entry) => {
    const [node, path] = entry;
    if (Text.isText(node) && node.text.charAt(node.text.length - 1) !== ' ') {
      const [, nextPath] = Editor.next(editor, { at: path }) ?? [];
      // Check if current word and next word are in the same message block
      if (nextPath && path[0] !== nextPath[0]) {
        Transforms.mergeNodes(editor, { at: nextPath });
        Transforms.setNodes(editor, { end: node.end }, { at: path });
        return;
      }
    }
    normalizeNode(entry);
  };
  return editor;
}

type Middleware = (editor: Editor) => Editor;

const initEditor = () => {
  const middleware: Middleware[] = [
    withNewNodeOnSpace,
    withMergeNoTrailingSpace,
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
