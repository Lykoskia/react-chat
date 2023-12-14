import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import MemberList from './MemberList';
import MessagesList from './MessagesList';

export default function Chat({ username, members, setMembers }) {
    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState('');
    const [drone, setDrone] = useState(null);
    const [repliedMessage, setRepliedMessage] = useState(null);
    const [hasNewMessage, setHasNewMessage] = useState(false);
    const [isWindowFocused, setIsWindowFocused] = useState(true);

    const randomColor = () => '#' + Math.floor(Math.random()*16777215).toString(16).padStart(6, '0');

    const userColor = useMemo(() => randomColor(), []);

    const inputRef = useRef();
    const currentUserIdRef = useRef(null);

    useEffect(() => {
        const onFocus = () => {
            setIsWindowFocused(true);
            setHasNewMessage(false);
            document.title = "React Chat App";
        };

        const onBlur = () => setIsWindowFocused(false);

        window.addEventListener('focus', onFocus);
        window.addEventListener('blur', onBlur);

        return () => {
            window.removeEventListener('focus', onFocus);
            window.removeEventListener('blur', onBlur);
        };
    }, []);

    useEffect(() => {
        const droneInstance = new window.Scaledrone('h2ar8AdzvVkFCOrl', {
            data: {
                name: username,
                color: userColor
            },
        });

        const room = droneInstance.subscribe('observable-room');

        room.on('open', (error) => {
            if (error) return console.error(error);
            console.log('Successfully joined room!');
            currentUserIdRef.current = droneInstance.clientId;
        });

        room.on('members', (members) => {
            setMembers(members.map(member => ({ name: member.clientData.name, color: member.clientData.color, id: member.id })));
        });

        room.on('member_join', member => {
            setMembers(prevMembers => [...prevMembers, {
                ...member.clientData,
                id: member.id
            }]);
            setMessages(prevMessages => [...prevMessages, {
                type: 'system',
                subtype: 'join',
                text: (
                    <React.Fragment>
                        {member.clientData.name}
                        <span style={{ fontSize: '0.75rem', fontStyle: 'italic' }}>&nbsp;(id: {member.id})&nbsp;</span>
                        has joined.
                    </React.Fragment>
                )
            }]);
            if (!isWindowFocused) {
                setHasNewMessage(true);
            }
        });

        room.on('member_leave', member => {
            setMembers(prevMembers => prevMembers.filter(m => m.id !== member.id));
            setMessages(prevMessages => [...prevMessages, {
                type: 'system',
                subtype: 'leave',
                text: (
                    <React.Fragment>
                        {member.clientData.name}
                        <span style={{ fontSize: '0.75rem', fontStyle: 'italic' }}>&nbsp;(id: {member.id})&nbsp;</span>
                        has left.
                    </React.Fragment>
                )
            }]);
            if (!isWindowFocused) {
                setHasNewMessage(true);
            }
        });

        room.on('message', (message) => {
            if (message && message.data && message.member && message.member.clientData) {
                let newMessage = {
                    username: message.member.clientData.name,
                    text: message.data.text,
                    color: message.member.clientData.color,
                    clientId: message.clientId,
                    timestamp: new Date(),
                    quote: message.data.quote
                };
                setMessages((prevMessages) => [...prevMessages, newMessage]);
            }
            if (currentUserIdRef.current !== message.clientId) {
                setHasNewMessage(true);
            }
        });

        setDrone(droneInstance);

        return () => {
            droneInstance.close();
        };
    }, [username, userColor]);

    const sendMessage = () => {
        let fullMessage = {
            text: message,
            quote: repliedMessage ? {
                username: repliedMessage.username,
                text: repliedMessage.text,
                color: repliedMessage.color
            } : null
        };

        drone.publish({
            room: 'observable-room',
            message: fullMessage,
        });
        setMessage('');
        setRepliedMessage(null);
    };

    const handleCancelReplyClick = useCallback(() => {
        setRepliedMessage(null);
        inputRef.current.focus();
    }, [setRepliedMessage]);

    useEffect(() => {
        if (!isWindowFocused && hasNewMessage) {
            const intervalId = setInterval(() => {
                document.title = document.title === "React Chat App" ? "New Message!" : "React Chat App";
            }, 2000);
            return () => clearInterval(intervalId);
        }
    }, [isWindowFocused, hasNewMessage]);

    return (
        <section style={styles.chatContainer}>
            <MemberList members={members} username={username} currentUserId={currentUserIdRef} />
            <MessagesList messages={messages} currentUserId={currentUserIdRef.current} setRepliedMessage={setRepliedMessage} inputRef={inputRef} />
            <section style={styles.inputContainerBaseStyle}>
                {repliedMessage && (
                    <section style={styles.repliedMessageContainer}>
                        Reply to: <span style={{ fontWeight: 'bold' }}>{repliedMessage.username}</span>: <span style={{ fontStyle: 'italic' }}>"{repliedMessage.text}"</span>
                        <button onClick={handleCancelReplyClick} style={styles.cancelReplyButton}>
                            X
                        </button>
                    </section>
                )}
                <section style={styles.inputContainer}>
                    <input
                        type="text"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' && message) {
                                sendMessage();
                            }
                        }}
                        ref={inputRef}
                        style={styles.input}
                        placeholder={`Type a ${repliedMessage ? `reply to ${repliedMessage.username}` : 'message'}...`}
                        autoFocus
                    />
                    <button
                        onClick={sendMessage}
                        style={{
                            ...styles.button,
                            opacity: message ? 1 : 0.5,
                            cursor: message ? 'pointer' : 'not-allowed'
                        }}
                        disabled={!message}
                    >
                        Send <i className="fa fa-paper-plane"></i>
                    </button>
                </section>
            </section>
        </section>
    );
}

const styles = {
    chatContainer: {
        display: 'flex',
        flexDirection: 'column',
        width: '80%',
        maxWidth: '600px',
        minHeight: '95vh',
        margin: '20px',
        background: '#052e16',
        borderRadius: '10px',
        border: '2px solid black',
        boxShadow: '0px 0px 10px 0px rgba(0,0,0,1)'
    },
    messageContainer: {
        flex: 1,
        overflowY: 'auto',
        padding: '20px'
    },
    inputContainer: {
        display: 'flex',
        padding: '10px'
    },
    input: {
        flex: 1,
        minWidth: '0',
        padding: '10px',
        marginRight: '10px',
        border: 'none',
        borderRadius: '10px',
        outline: 'none'
    },
    button: {
        background: '#007bff',
        color: '#fff',
        border: 'none',
        borderRadius: '10px',
        padding: '5px 10px',
        cursor: 'pointer',
        flexShrink: 0
    },
    repliedMessageContainer: {
        backgroundColor: '#000000',
        color: '#ffffff',
        borderRadius: '8px',
        padding: '10px',
        margin: '10px 0',
        border: '1px solid #ccc'
    },
    cancelReplyButton: {
        background: 'red',
        color: 'white',
        border: 'none',
        cursor: 'pointer',
        borderRadius: '5px',
        marginLeft: '10px'
    },
    inputContainerBaseStyle: {
        display: 'flex',
        flexDirection: 'column',
        padding: '10px',
        borderTop: '1px solid #eaeaea'
    }
};
