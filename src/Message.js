import React, { useCallback } from 'react';
import chroma from 'chroma-js';
import Linkify from 'react-linkify';

export default function Message({ message, currentUserId, setRepliedMessage, inputRef }) {
    const isCurrentUser = message.clientId === currentUserId;
    const { clientId, username, text, color } = message;
    const textColor = chroma(color).luminance() > 0.5 ? 'black' : 'white';

    const userContainerStyles = isCurrentUser ? styles.currentUserContainer : styles.userContainer;
    const userMessageStyles = isCurrentUser ? styles.currentUserMessage : styles.message;

    const handleReplyClick = useCallback(() => {
        setRepliedMessage(message);
        inputRef.current.focus();
    }, [message, setRepliedMessage]);

    const renderMessageContent = (message) => {
        return (
            <React.Fragment>
                {message.quote && (
                    <section style={styles.repliedMessageContent}>
                        <blockquote style={styles.blockquote}>
                            <header style={styles.replyHeader}>{message.quote.username}:</header>
                            <Linkify>{message.quote.text}</Linkify>
                        </blockquote>
                    </section>
                )}
                <Linkify><section>{text}</section></Linkify>
            </React.Fragment>
        );
    }

    return (
        <section style={userContainerStyles}>
            <section style={{ ...userMessageStyles, backgroundColor: color, color: textColor }}>
                <section>
                    <span style={{ fontWeight: 'bold' }}>{username}</span>:
                    <span style={{ float: 'right', fontStyle: 'italic', fontSize: '10px', marginLeft: '10px' }}>{message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: 'false' })}</span>
                </section>
                <section style={{ fontSize: '0.5rem', fontStyle: 'italic' }}>
                    (id: {clientId})
                </section>
                <section>{renderMessageContent(message)}</section>
                {!isCurrentUser && (
                    <button onClick={handleReplyClick} style={styles.replyButton}>
                        Reply
                    </button>
                )}
            </section>
        </section>
    );
}

const styles = {
    currentUserContainer: {
        display: 'flex',
        justifyContent: 'flex-end',
        alignItems: 'center'
    },
    userContainer: {
        display: 'flex',
        justifyContent: 'flex-start',
        alignItems: 'center'
    },
    currentUserMessage: {
        borderRadius: '5px',
        margin: '5px',
        padding: '10px',
        boxShadow: '0 1px 1px 0 rgba(0, 0, 0, 0.1)',
        overflowWrap: 'break-word',
        maxWidth: '95%',
        border: '2px solid black',
        boxShadow: '2px 4px 10px 0px rgba(0,0,0,1)'
    },
    message: {
        borderRadius: '5px',
        margin: '5px',
        padding: '10px',
        boxShadow: '0 1px 1px 0 rgba(0, 0, 0, 0.1)',
        overflowWrap: 'break-word',
        maxWidth: '95%',
        border: '2px solid black',
        boxShadow: '2px 4px 10px 0px rgba(0,0,0,1)'
    },
    replyButton: {
        background: 'black',
        border: '2px solid darkred',
        boxShadow: '0 1px 1px 0 rgba(0, 0, 0, 0.1)',
        borderRadius: '10px',
        marginTop: '10px',
        color: 'white',
        cursor: 'pointer',
        fontWeight: 'bold'
    },
    repliedMessageContainer: {
        backgroundColor: '#000000',
        color: '#ffffff',
        borderRadius: '5px',
        padding: '5px',
        margin: '5px 0'
    },
    repliedMessageContent: {
        backgroundColor: 'black',
        color: 'white',
        fontStyle: 'italic',
        padding: '5px',
        borderRadius: '10px',
        border: '2px solid orange',
        margin: '5px 0'
    },
    blockquote: {
        margin: '0 0 0 5px',
        padding: '0 0 0 5px',
    },
    replyHeader: {
        fontWeight: 'bold',
        fontSize: '0.75rem',
        marginBottom: '4px'
    }
};
