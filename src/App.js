import React, { useState, useEffect } from "react";
import "./App.css";

const priorityLabels = {
  0: "No Priority",
  1: "Urgent",
  2: "High",
  3: "Medium",
  4: "Low",
};

const userLabels = {
  "usr-1": "Anoop Sharma",
  "usr-2": "Yogesh",
  "usr-3": "Shankar Kumar",
  "usr-4": "Ramesh",
  "usr-5": "Suresh",
};

const userImages = {
  "usr-1": require('../src/anoopsharma.png'),
  "usr-2": require('../src/yogesh.png'),
  "usr-3": require('../src/shankarkumar.png'),
  "usr-4": require('../src/ram.png'),
  "usr-5": require('../src/suresh.png'),
};

const groupTickets = (tickets, groupBy) => {
  switch (groupBy) {
    case "status":
      return tickets.reduce((acc, ticket) => {
        (acc[ticket.status] = acc[ticket.status] || []).push(ticket);
        return acc;
      }, {});
    case "user":
      return tickets.reduce((acc, ticket) => {
        (acc[ticket.userId] = acc[ticket.userId] || []).push(ticket);
        return acc;
      }, {});
    case "priority":
      return tickets.reduce((acc, ticket) => {
        (acc[ticket.priority] = acc[ticket.priority] || []).push(ticket);
        return acc;
      }, {});
    default:
      return {};
  }
};

const App = () => {
  const [data, setData] = useState([]);
  const [grouping, setGrouping] = useState("status");
  const [ordering, setOrdering] = useState("priority");
  const [displayDropdownOpen, setDisplayDropdownOpen] = useState(false);
  const [checkedTickets, setCheckedTickets] = useState(new Set());
  const [displayGrouping, setDisplayGrouping] = useState('Default');

  useEffect(() => {
    fetch("https://api.quicksell.co/v1/internal/frontend-assignment")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        setData(data.tickets || []);
      })
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  

  const handleCheckboxToggle = (ticketId) => {
    setCheckedTickets((prevChecked) => {
      const newChecked = new Set(prevChecked);
      if (newChecked.has(ticketId)) {
        newChecked.delete(ticketId);
      } else {
        newChecked.add(ticketId);
      }
      return newChecked;
    });
  };

  const groupedData = groupTickets(data, grouping);

  return (
    <div className="kanban-board">
      <div className="header">
        <div className="display-controls">
          <div className="dropdown">
            <button
              className="display-button"
              onClick={() => setDisplayDropdownOpen(!displayDropdownOpen)}
            >
              Display
            </button>
            {displayDropdownOpen && (
              <div className="dropdown-content">
                <div className="grouping">
                  <label>Grouping:</label>
                  <select
                    value={grouping}
                    onChange={(e) => setGrouping(e.target.value)}
                    className="select-dropdown"
                  >
                    <option value="status">Status</option>
                    <option value="user">User</option>
                    <option value="priority">Priority</option>
                  </select>
                </div>
                <div className="ordering">
                  <label>Ordering:</label>
                  <select
                    value={ordering}
                    onChange={(e) => setOrdering(e.target.value)}
                    className="select-dropdown"
                  >
                    <option value="priority">Priority</option>
                    <option value="Title">Title</option>
                  </select>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="grouped-container">
        {grouping === "status" && (
          <>
            <div className="cards-container">
              <h2 className="ticket-cardheading" style={{ margin: 0 }}>Backlog</h2>
              <span className="card-count">
                {groupedData["Backlog"] ? groupedData["Backlog"].length : 0}
              </span>
              {groupedData["Backlog"]?.map((ticket) => (
                <TicketCard key={ticket.id} ticket={ticket} isCheckboxVisible={false} displayGrouping={displayGrouping} />
              ))}
            </div>

            <div className="cards-container" style={{ display: 'flex' }}>
              <h2 className="ticket-cardheading" style={{ margin: 0 }}>Todo</h2>
              <span className="card-count" style={{ color: 'grey', fontSize: '12px', marginLeft: '38px' }}>
                {groupedData["Todo"] ? groupedData["Todo"].length : 0}
              </span>
              {groupedData["Todo"]?.map((ticket) => (
                <TicketCard key={ticket.id} ticket={ticket} isCheckboxVisible={false} displayGrouping={displayGrouping} />
              ))}
            </div>

            <div className="cards-container" style={{ display: 'flex' }}>
              <h2 className="ticket-cardheading" style={{ margin: 0 }}>In Progress</h2>
              <span className="card-count" style={{ color: 'grey', fontSize: '12px', marginLeft: '8px' }}>
                {groupedData["In progress"] ? groupedData["In progress"].length : 0}
              </span>
              {groupedData["In progress"]?.map((ticket) => (
                <TicketCard key={ticket.id} ticket={ticket} isCheckboxVisible={false} displayGrouping={displayGrouping} />
              ))}
            </div>

            <div className="cards-container" style={{ display: 'flex' }}>
              <h2 className="ticket-cardheading" style={{ margin: 0 }}>Done</h2>
              <span className="card-count" style={{ color: 'grey', fontSize: '12px', marginLeft: '8px' }}>
                {data.filter((ticket) => checkedTickets.has(ticket.id)).length}
              </span>
              {data
                .filter((ticket) => checkedTickets.has(ticket.id))
                .map((ticket) => (
                  <TicketCard key={ticket.id} ticket={ticket} isCheckboxVisible={false} displayGrouping={displayGrouping} />
                ))}
            </div>

            <div className="cards-container" style={{ display: 'flex' }}>
              <h2 className="ticket-cardheading" style={{ margin: 0 }}>Cancelled</h2>
              <span className="card-count" style={{ color: 'grey', fontSize: '12px', marginLeft: '8px' }}>
                {groupedData["Cancelled"] ? groupedData["Cancelled"].length : 0}
              </span>
              {groupedData["Cancelled"]?.map((ticket) => (
                <TicketCard key={ticket.id} ticket={ticket} isCheckboxVisible={false} displayGrouping={displayGrouping} />
              ))}
            </div>
          </>
        )}

        {grouping !== "status" && Object.keys(groupedData).map((group) => {
          const uniqueUsers = new Set(); // To track unique users
          const sortedTickets = ordering === "Title"
                ? [...groupedData[group]].sort((a, b) => a.title.localeCompare(b.title))
                : groupedData[group];

  
          return (
            <div className="group" key={group}>
              <div className="user-heading-box" style={{ display: 'flex', alignItems: 'center' }}>
                {grouping === "user" && groupedData[group].map((ticket) => {
                  if (!uniqueUsers.has(ticket.username)) {
                    uniqueUsers.add(ticket.username); // Add user to the Set
                    return (
                      <img
                        key={ticket.username} // Use username as the key to ensure uniqueness
                        src={userImages[ticket.userId]}  // Use the correct path for user images
                        alt={ticket.userId}
                        style={{ width: '20px', height: '20px', marginRight: '8px' }} // Adjust size as needed
                      />
                    );
                  }
                  return null; // Return null if the user has already been added
                })}

                <h2 className="ticket-cardheading">
                  {grouping === "priority" ? priorityLabels[group] : userLabels[group]}
                </h2>
        
                <span className="card-count">
                  {groupedData[group] ? groupedData[group].length : 0}
                  {sortedTickets ? sortedTickets.length : 0}
                </span>
              </div>
      
              <div className="cards-container">
                {groupedData[group] && Array.isArray(groupedData[group]) ? (
                  groupedData[group].map((ticket) => (
                    <TicketCard
                      key={ticket.id}
                      ticket={ticket}
                      isCheckboxVisible={grouping === "user" || grouping === "priority"}
                      onCheckboxToggle={() => handleCheckboxToggle(ticket.id)}
                      grouping={grouping} 
                    />
                  ))
                ) : (
                <p>No tickets available in this group.</p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};


const TicketCard = ({ ticket , isCheckboxVisible,  onCheckboxToggle, grouping}) => {
  const [isChecked, setIsChecked] = useState(false);

  const toggleCheckmark = () => {
    setIsChecked(!isChecked);
    if (onCheckboxToggle) {
      onCheckboxToggle();
    }
  };
  // Get the image based on the user associated with the ticket
  const userImage = userImages[ticket.userId]; // Assuming ticket.userName holds the user's name


  return (
    <div className="card" style={{ position: 'relative' }}>
      {/* Image in the top right corner based on the user */}
      {userImage && grouping !== "user" &&  (
        <img 
          src={userImage} 
          alt="User Icon" 
          style={{
            position: 'absolute', 
            top: '5px', 
            right: '5px', 
            width: '20px', 
            height: '20px',
            objectFit: 'contain' 
          }} 
        />
      )}
      <p className="ticket-id">{ticket.id}</p>
      <div className="title-container">
        {/* Only show checkmark if no status is selected */}
        {isCheckboxVisible && (
          <button className={`checkmark-button ${isChecked ? 'checked' : ''}`} onClick={toggleCheckmark}>
            {isChecked && <span className="checkmark"></span>} {/* Checkmark */}
          </button>
        )}
        <p className="ticket-title">{ticket.title}</p>
      </div>
      {/* New Ticket: Tag section */}
      <div className="ticket-tag">
        <div className="circle"></div> {/* New circle element */}
        <span>Feature Request</span> {/* Adjust text as needed */}
      </div>
    </div>
  );
};

export default App;
