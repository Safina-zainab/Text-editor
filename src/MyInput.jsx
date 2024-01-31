import React, { useState, useEffect } from "react";
import { Editor, EditorState, RichUtils, convertToRaw, convertFromRaw } from "draft-js";
import "./MyInput.css"; // Import the CSS file

const MyInput = () => {
  const [editorState, setEditorState] = useState(EditorState.createEmpty());

  const onChange = (newEditorState) => {
    setEditorState(newEditorState);
  };

  const handleBeforeInput = (input) => {
    const currentContent = editorState.getCurrentContent();
    const selection = editorState.getSelection();
    const startKey = selection.getStartKey();
    const startOffset = selection.getStartOffset();
    const block = currentContent.getBlockForKey(startKey);
    const text = block.getText();
  
    if (input === "#") {
      onChange(RichUtils.toggleBlockType(editorState, "header-one"));
      return 'handled';
    } else if (input === "*" && startOffset === 0) {
      onChange(RichUtils.toggleInlineStyle(editorState, "BOLD"));
      return 'handled';
    } else if (input === "*" && text.endsWith("**")) {
      onChange(RichUtils.toggleInlineStyle(editorState, "REDLINE"));
      return 'handled';
    } else if (input === "*" && text.endsWith("***")) {
      onChange(RichUtils.toggleInlineStyle(editorState, "UNDERLINE"));
      return 'handled';
    }
  
    return 'not-handled';
  };
  
  const customStyleMap = {
    'REDLINE': {
      color: "red",
    },
  };

  useEffect(() => {
    const savedContent = localStorage.getItem('editorContent');
    if (savedContent) {
      const rawContent = JSON.parse(savedContent);
      const contentState = convertFromRaw(rawContent);
      setEditorState(EditorState.createWithContent(contentState));
    }
  }, []);

  const onSave = () => {
    const contentState = editorState.getCurrentContent();
    const rawContent = convertToRaw(contentState);
    localStorage.setItem('editorContent', JSON.stringify(rawContent));
    alert('Saved Successfully');
  };

  return (
    <>
      <div className="header">
        <h4>Demo Text Editor by Safina</h4>
        <button className="save-button" onClick={onSave}>Save</button>
      </div>
      <div className="editor-container">
        <Editor
          editorState={editorState}
          handleBeforeInput={handleBeforeInput}
          onChange={onChange}
          customStyleMap={customStyleMap}
        />
      </div>
    </>
  );
};

export default MyInput;
