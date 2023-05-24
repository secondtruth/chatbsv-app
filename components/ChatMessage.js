// components/ChatMessage.js

import React from 'react';
import styles from './ChatMessage.module.css';

function ChatMessage({ message, user, tokens, txid }) {
  const isAssistantMessage = !user;

  return (
    <div className={`${styles.chatMessage} ${user ? styles.userMessage : styles.assistantMessage}`}>
      {isAssistantMessage ? (
        <div>
          <span className={styles.message} style={{ fontSize: '16pt' }}>{message}</span>
          <div className={styles.link}>
            <a href={`https://whatsonchain.com/tx/${txid}`} style={{ fontSize: '14pt' }} target="_blank" rel="noopener noreferrer" className={styles.linkIcon}>
              <img src="/link-icon.png" alt="Link Icon" />
            </a>
            <span className={styles.txid}>{txid}</span>
            <span className={styles.tokens}>{tokens} Tokens</span>
          </div>
        </div>
      ) : (
        <span className={styles.message} style={{ fontSize: '16pt' }}>{message}</span>
      )}
    </div>
  );
}


export default ChatMessage;