import React, { useState } from 'react';
import Chat from './Chat';
import './Chat.css';
import 'bootstrap/dist/css/bootstrap.min.css';

export default function App() {
    const [username, setUsername] = useState('');
    const [inputValue, setInputValue] = useState('');
    const [members, setMembers] = useState([]);

    const handleSetUsername = () => {
        setUsername(inputValue.trim());
    }
    
    return (
        <section className="App" style={styles.app}>
            {username ? (
                <Chat username={username} members={members} setMembers={setMembers} />
            ) : (
                <section style={styles.usernameContainer}>
                    Pick a username
                    <br/>
                    <span style={{ fontSize: '0.8em' }}>(max: <strong>16</strong> characters)</span>
                    <input
                        type="text"
                        placeholder="Enter Username"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' && inputValue.trim()) {
                                handleSetUsername();
                            }
                        }}
                        style={{ margin: '10px' }}
                        maxLength='16'
                        autoFocus
                    />
                    <button 
                        onClick={handleSetUsername}
                        disabled={!inputValue.trim()}
                        style={{ ...styles.button, opacity: !inputValue.trim() ? '0.5' : '1' }}
                    >
                        {!inputValue.trim() ? 'Required' : 'Join Chat'}
                    </button>
                </section>
            )}
        </section>
    );
}

const styles = {
    app: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        background: 'linear-gradient(to bottom, #082f49, #450a0a)',
        color: '#fff'
    },
    usernameContainer: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
    },
    button: {
        background: '#007bff',
        color: '#fff',
        border: 'none',
        padding: '5px 10px',
        cursor: 'pointer'
    }
};