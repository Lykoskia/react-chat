import React, { useMemo } from 'react';

export default function MemberList({ members, username, currentUserId }) {
    const userMember = members ? members.find(member => member.name === username) : null;
    const userColor = userMember ? userMember.color : 'white';

    const sortedMembers = useMemo(() => {
        if (!members || !userMember) return [];
        
        return [
            userMember, 
            ...members.filter(member => member.name !== username)
        ];
    }, [members, username, userMember]);

    return (
        <section style={styles.container}>
            Online users:{' '}
            {sortedMembers.length ? sortedMembers.map(({ name, color, id }, index) => (
                <span key={id} style={{ ...styles.name, color }}>
                    {id === currentUserId ? 'You' : name}
                    {index < sortedMembers.length - 1 && <span style={{ color: 'white' }}>,&nbsp;</span>}
                </span>
            )) : 'Loading...'}
            <br/>
            <span>Your name: 
                <span style={{ color: userColor }}>&nbsp;{username}</span>
            </span>
        </section>
    );
}

const styles = {
    container: {
        padding: '10px',
        color: 'white',
        textAlign: 'center',
        borderBottom: '1px solid #eaeaea'
    },
    name: {
        display: 'inline-block'
    }
};
