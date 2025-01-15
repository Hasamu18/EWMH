import Placeholder from "@tiptap/extension-placeholder";
import Underline from "@tiptap/extension-underline";
import CharacterCount from "@tiptap/extension-character-count";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import clsx from "clsx";
import { useEffect } from "react";
import { Form } from "../form";
import TextEditorMenuBar from "./tiptap-menubar";

export default function Tiptap(props: TextEditorProps) {
  const { status } = Form.Item.useStatus();
  const editorClass = clsx(
    "px-3 transition duration-300 min-h-[150px] cursor-text rounded-lg border border-solid hover:ring-1 focus-within:outline-none text-[16px]",
    {
      "!ring-[#ff4d4f] border-[#ff4d4f] hover:border-red-300 hover:ring-0 focus-within:!border-[#ff4d4f]":
        status === "error",
      "border-gray-200 ring-primary focus-within:ring-1": status !== "error",
    },
  );

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Placeholder.configure({
        placeholder: props.placeholder,
        emptyEditorClass:
          "cursor-text before:content-[attr(data-placeholder)] before:absolute before:top-4 before:left-3 before:text-slate-400 before:text-[16px] before:opacity-50 before-pointer-events-none",
      }),
      CharacterCount.configure({
        limit: props.limit,
      }),
    ],
    content: props.value,
    onUpdate: ({ editor }) => {
      const content = editor.getText().trim() ? editor.getHTML() : "";
      props.onChange?.(content);
    },
    editorProps: {
      attributes: {
        class: editorClass,
      },
    },
  });

  useEffect(() => {
    if (editor && !editor.isDestroyed && editor.getHTML() !== props.value) {
      editor?.commands.setContent(props.value ?? null);
    }
  }, [editor, props.value]);

  if (!editor) {
    return null;
  }

  return (
    <div>
      <TextEditorMenuBar editor={editor} />
      <EditorContent editor={editor} />
      {props.limit && (
        <div>
          {editor.storage.characterCount.characters()} / {props.limit}{" "}
          characters
        </div>
      )}
    </div>
  );
}

type TextEditorProps = {
  value?: string;
  onChange?: (content: string) => void;
  placeholder?: string;
  limit?: number;
};
