import React from 'react';
import styles from './MessageList.css';

const Message = props => (
    <div className={props.className}>
        {(props.from === 'chat') ? null : <strong>{props.from}: </strong>}
        <span>{props.text}</span>
    </div>
);

const MessageList = props => (
    <div className={styles.MessageList}>
        {
            props.messages.map((message, i) => {
                return (
                    <Message
                        key={i}
                        from={message.from}
                        text={message.text}
                        className={`${styles.Message} ${(message.from === props.name) && styles.MyMessage} ${message.from === 'chat' && styles.AutoMessage}`}
                    />
                );
            })
        }
    </div>
);

export default MessageList;