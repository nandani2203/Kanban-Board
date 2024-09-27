import React, { useState, useEffect } from 'react';
import './App.css'; // Create a corresponding CSS file for styling

function App() {
    const [tickets, setTickets] = useState([]);
    const [grouping, setGrouping] = useState('status');
    const [sortBy, setSortBy] = useState('priority');

    // Fetch tickets data from API
    useEffect(() => {
        fetch('https://api.quicksell.co/v1/internal/frontend-assignment')
        .then(response => response.json())
        .then(data => setTickets(data.tickets))
        .catch(error => console.error('Error fetching tickets:', error));
    }, []);

    // Function to group tickets
    const groupTickets = (tickets, grouping) => {
        switch(grouping) {
        case 'user':
            return tickets.reduce((acc, ticket) => {
            const user = ticket.user || 'Unassigned';
            acc[user] = acc[user] || [];
            acc[user].push(ticket);
            return acc;
            }, {});
        case 'priority':
            return tickets.reduce((acc, ticket) => {
            const priority = ticket.priority;
            acc[priority] = acc[priority] || [];
            acc[priority].push(ticket);
            return acc;
            }, {});
        default:
            return tickets.reduce((acc, ticket) => {
            const status = ticket.status;
            acc[status] = acc[status] || [];
            acc[status].push(ticket);
            return acc;
            }, {});
        }
    };

  // Function to sort tickets
    const sortTickets = (tickets, sortBy) => {
        return tickets.sort((a, b) => {
        if (sortBy === 'priority') {
            return b.priority - a.priority;
        } else {
            return a.title.localeCompare(b.title);
        }
        });
    };

  // Group and sort tickets before rendering
    const groupedTickets = groupTickets(tickets, grouping);
    Object.keys(groupedTickets).forEach(key => {
        groupedTickets[key] = sortTickets(groupedTickets[key], sortBy);
    });

    return (
        <div className="kanban-board">
            <div className="controls">
                <label htmlFor="grouping">Group By: </label>
                <select id="grouping" value={grouping} onChange={e => setGrouping(e.target.value)}>
                    <option value="status">Status</option>
                    <option value="user">User</option>
                    <option value="priority">Priority</option>
                </select>

                <label htmlFor="sortBy">Sort By: </label>
                <select id="sortBy" value={sortBy} onChange={e => setSortBy(e.target.value)}>
                    <option value="priority">Priority</option>
                    <option value="title">Title</option>
                </select>
            </div>

            <div className="columns">
                {Object.keys(groupedTickets).map(group => (
                    <div key={group} className="column">
                        <h3>{group}</h3>
                        {groupedTickets[group].map(ticket => (
                        <div key={ticket.id} className={ticket priority-${ticket.priority}}>
                            <h4>{ticket.title}</h4>
                            <p>{ticket.description}</p>
                        </div>
                        ))}
                    </div>
                ))}
            </div>
        </div>
    );
}

export default App;