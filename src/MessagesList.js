import React, { useEffect, useRef } from 'react';
import Message from './Message';

export default function MessagesList({ messages, currentUserId, setRepliedMessage, inputRef }) {
    const messagesEndRef = useRef(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    return (
        <section style={ styles.container }>
            {messages.map((msg, index) => (
                msg.type === 'system' ? (
                    <section key={index} style={{ ...styles.systemMessage, ...(msg.subtype === 'join' ? styles.join : styles.leave) }}>
                        {msg.text}
                    </section>
                ) : (
                    <Message
                        key={index}
                        message={msg}
                        currentUserId={currentUserId}
                        setRepliedMessage={setRepliedMessage}
                        inputRef={inputRef}
                    />
                )
            ))}
            <section ref={messagesEndRef} />
        </section>
    );
}

const styles = {
    container: {
        flex: 1,
        overflowY: 'auto',
        padding: '20px'
    },
    systemMessage: {
        textAlign: 'left',
        padding: '5px'
    },
    join: {
        color: 'green'
    },
    leave: {
        color: 'red'
    }
};