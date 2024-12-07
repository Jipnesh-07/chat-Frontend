// import React, { useEffect, useRef, useState } from 'react';
// import { Container, Typography, Button, TextField, Box, Stack } from '@mui/material';
// import { io } from 'socket.io-client';

// const App = () => {
//   const socketRef = useRef(null);
//   const [messages, setMessages] = useState([]);
//   const [message, setMessage] = useState('');
//   const [room, setRoom] = useState('default-room'); // Default room for testing
//   const [socketID, setSocketID] = useState('');
//   const [roomName, setRoomName] = useState('');

//   // Handle message submission
//   const handleSubmit = (e) => {
//     e.preventDefault();

//     if (!message.trim()) {
//       console.error('Message is empty');
//       return;
//     }

//     if (!room.trim()) {
//       console.error('Room is empty');
//       return;
//     }

//     console.log('Sending message:', { message, room });

//     // Send message to the socket server
//     socketRef.current.emit('message', { message, room });
//     setMessage(''); // Clear the message input
//   };

//   // Handle joining a room
//   const joinRoomHandler = (e) => {
//     e.preventDefault();

//     if (roomName.trim()) {
//       socketRef.current.emit('join-room', roomName, (ack) => {
//         if (ack.error) {
//           console.error('Failed to join room:', ack.error);
//         } else {
//           console.log('Joined room successfully:', roomName);
//           setRoom(roomName); // Set the room for messaging
//         }
//       });
//       setRoomName(''); // Clear the room name input
//     }
//   };

//   // Initialize socket and event listeners
//   useEffect(() => {
//     socketRef.current = io('https://soleseeks-backend.onrender.com', {
//       withCredentials: false,
//       reconnection: true,
//       reconnectionAttempts: 10,
//       reconnectionDelay: 1500,
//     });

//     socketRef.current.on('connect', () => {
//       setSocketID(socketRef.current.id);
//       console.log('Connected:', socketRef.current.id);
//     });

//     socketRef.current.on('connect_error', (error) => {
//       console.error('Socket connection error:', error.message);
//     });

//     socketRef.current.on('receive-message', (data) => {
//       setMessages((prevMessages) => [...prevMessages, data]);
//     });

//     socketRef.current.on('welcome', (msg) => {
//       console.log(msg);
//     });

//     socketRef.current.on('reconnect', () => {
//       console.log('Reconnected:', socketRef.current.id);
//       if (room) {
//         socketRef.current.emit('join-room', room);
//       }
//     });

//     return () => {
//       socketRef.current.disconnect(); // Clean up the socket connection when the component unmounts
//     };
//   }, [room]);

//   return (
//     <Container maxWidth="sm">
//       <Box sx={{ height: 20 }} />
//       <Typography variant="h6" component="div" gutterBottom>
//         Socket ID: {socketID}
//       </Typography>

//       {/* Join Room Form */}
//       <form onSubmit={joinRoomHandler}>
//         <Typography variant="h6">Join Room</Typography>
//         <TextField
//           value={roomName}
//           onChange={(e) => setRoomName(e.target.value)}
//           label="Room Name"
//           variant="outlined"
//           fullWidth
//           margin="normal"
//         />
//         <Button type="submit" variant="contained" color="primary" fullWidth>
//           Join Room
//         </Button>
//       </form>

//       {/* Message Form */}
//       <form onSubmit={handleSubmit}>
//         <TextField
//           value={message}
//           onChange={(e) => setMessage(e.target.value)}
//           label="Message"
//           variant="outlined"
//           fullWidth
//           margin="normal"
//         />
//         <Button type="submit" variant="contained" color="primary" fullWidth>
//           Send Message
//         </Button>
//       </form>

//       {/* Message Display */}
//       <Stack spacing={2} mt={3}>
//         {messages.map((m, i) => (
//           <Box key={i} p={2} bgcolor="grey.200" borderRadius={2}>
//             <Typography variant="subtitle1">
//               <strong>{m.sender || 'User'}:</strong> {m.message}
//             </Typography>
//             <Typography variant="caption">
//               {new Date(m.timestamp).toLocaleString()}
//             </Typography>
//           </Box>
//         ))}
//       </Stack>
//     </Container>
//   );
// };

// export default App;


import { Container, Typography, Button, TextField, Box, Stack } from '@mui/material';
import axios from 'axios';
import React, { useEffect, useMemo, useState } from 'react';
import { io } from "socket.io-client";

const App = () => {
  const socket = useMemo(() => io("http://localhost:5001", {
    withCredentials: false,
    reconnection: true,
    reconnectionAttempts: 10,
    reconnectionDelay: 1500,
  }), []);

  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [room, setRoom] = useState("default-room"); // Default room for testing
  const [socketID, setsocketID] = useState("");
  const [roomName, setRoomName] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (message.trim()) {
      socket.emit("message", { message, room });
      // try{
      //   await axios.post('/chat/message' , {
          
      //   })
      // }
      setMessage("");
    }
  };

  const joinRoomHandler = (e) => {
    e.preventDefault();
    if (roomName.trim()) {
      setRoom(roomName);
      socket.emit('join-room', roomName);
      setRoomName("");
    }
  };

  useEffect(() => {
    socket.on("connect", () => {
      setsocketID(socket.id);
      console.log("connected", socket.id);
    });

    socket.on("connect_error", (error) => {
      console.error("Socket connection error:", error.message);
    });

    socket.on("receive-message", (data) => {
      setMessages((prevMessages) => [...prevMessages, data]);
    });

    socket.on("welcome", (msg) => {
      console.log(msg);
    });

    return () => {
      socket.disconnect();
    };
  }, [socket]);

  return (
    <Container maxWidth="sm">
      <Box sx={{ height: 20 }} />
      <Typography variant="h6" component="div" gutterBottom>
        Socket ID: {socketID}
      </Typography>

      <form onSubmit={joinRoomHandler}>
        <Typography variant="h6">Join Room</Typography>
        <TextField
          value={roomName}
          onChange={(e) => setRoomName(e.target.value)}
          label="Room Name"
          variant="outlined"
          fullWidth
          margin="normal"
        />
        <Button type="submit" variant="contained" color="primary" fullWidth>
          Join Room
        </Button>
      </form>

      <form onSubmit={handleSubmit}>
        <TextField
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          label="Message"
          variant="outlined"
          fullWidth
          margin="normal"
        />
        <Button type="submit" variant="contained" color="primary" fullWidth>
          Send Message
        </Button>
      </form>

      <Stack spacing={2} mt={3}>
        {messages.map((m, i) => (
          <Box key={i} p={2} bgcolor="grey.200" borderRadius={2}>
            <Typography variant="subtitle1">
              <strong>{m.sender || 'User'}:</strong> {m.message}
            </Typography>
            <Typography variant="caption">
              {new Date(m.timestamp).toLocaleString()}
            </Typography>
          </Box>
        ))}
      </Stack>
    </Container>
  );
};

export default App;
