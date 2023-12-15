// src/components/HelpMessage.js

import React, { useEffect, useRef } from 'react';
import styles from '../body/ChatMessage.module.css';
import { marked } from 'marked'; // Corrected import statement
import { processCodeElements, handleCopyCode } from '../../utils/markdownParser'; // Import the utility functions

const helpMessageStyle = {
  whiteSpace: 'pre-line',
};

function HelpMessage({ content, avatarUrl }) {
  const markdownContent = marked(content); // Parse Markdown to HTML
  const contentRef = useRef(null);

  useEffect(() => {
    if (contentRef.current) {
      const htmlContent = contentRef.current;

      // Use the utility function to process code elements
      processCodeElements(htmlContent);
    }
  }, [content]);

  return (
    <div className={styles.messageWrapper}>
      {avatarUrl && <img src={avatarUrl} alt="ChatBSV" className={styles.avatar} />}
      <div className={`${styles.chatMessage} ${styles.helpMessage}`}>
        <div
          className="markdown-content"
          ref={contentRef}
          dangerouslySetInnerHTML={{ __html: markdownContent }}
        />
      </div>
    </div>
  );
}

export default HelpMessage;
