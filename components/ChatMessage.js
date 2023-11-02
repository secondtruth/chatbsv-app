// components/ChatMessage.js

import React, { useState } from 'react';
import styles from './ChatMessage.module.css';

function ChatMessage({ content, role, tokens, txid }) {
  const isAssistantMessage = role === 'assistant';
  const isUserMessage = role === 'user';
  const isDalleImage = role === 'dalle-image';
  const isLoadingMessage = role === 'loading';
  const isIntroMessage = role === 'intro';

  const [copyButtonText, setCopyButtonText] = useState('Copy');

  const handleCopy = (message) => {
    navigator.clipboard.writeText(message);
    setCopyButtonText('Copied!');
    setTimeout(() => {
      setCopyButtonText('Copy');
    }, 2000);
  };

  const shouldShowWidget = isAssistantMessage || isDalleImage;

  return (
    <div
      className={`${styles.chatMessage} ${
        isAssistantMessage ? styles.assistantMessage : ''
      } ${isUserMessage ? styles.userMessage : ''} ${
        isLoadingMessage ? styles.loadingMessage : ''
      } ${isIntroMessage ? styles.introMessage : ''} ${
        isDalleImage ? styles.dalleImage : ''
      }`}
    >
      {isDalleImage ? (
        <img src={content} alt="DALL-E Generated Image" />
      ) : (
        <div dangerouslySetInnerHTML={{ __html: content.replace(/\n/g, '<br />') }}>
        </div>
      )}
      {shouldShowWidget && !isLoadingMessage && (
        <div className={styles.chatLink}>
          {txid ? (
            <a
              className={`${styles.copyButton} copyButton`}
              href={`https://whatsonchain.com/tx/${txid}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                textDecoration: 'none',
              }}
            >
              <img
                className={styles.copyIcon}
                src="https://uploads-ssl.webflow.com/646064abf2ae787ad9c35019/6474a9bf4a0547694b83498c_linked.svg"
                alt="Transaction Link"
              />
              <span 
                style={{
                  fontSize: '10px',
                  color: 'gray',
                  textDecoration: 'none',
                }}
              >
                TxID:{txid.slice(0, 5)}
              </span>
            </a>
          ) : (
            <span>N/A</span>
          )}
          <img
            className={styles.copyIcon}
            src="https://uploads-ssl.webflow.com/646064abf2ae787ad9c35019/6474a81e31e9c343912ede78_coins.svg"
            alt="Token Count"
          />
          <span style={{ fontSize: '10px', color: 'gray', marginRight: '10px' }}>
            Tokens:{tokens || 0}
          </span>
          <a
            className={`${styles.copyButton} copyButton`}
            onClick={() => handleCopy(content)}
          >
            <img
              className={styles.copyIcon}
              src="https://uploads-ssl.webflow.com/646064abf2ae787ad9c35019/6474a7ac96040b5fe425c4f8_copy-two-paper-sheets-interface-symbol.svg"
              alt="Copy"
            />
            <span style={{ fontSize: '10px', color: 'gray' }}>{copyButtonText}</span>
          </a>
        </div>
      )}
    </div>
  );
}

export default ChatMessage;
