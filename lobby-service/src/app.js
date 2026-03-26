import express from "express";
import cors from "cors";

const app = express();
const PORT = 4000;

app.use(cors());
app.use(express.json());

const rooms = new Map();

function generateRoomId() {
  return Math.random().toString(36).slice(2, 8).toUpperCase();
}

function createInitialRoom(playerName) {
  return {
    roomId: generateRoomId(),
    player1: playerName,
    player2: null,
    player1Ready: false,
    player2Ready: false,
    gameStarted: false,
    winner: null,
  };
}

app.get("/health", (req, res) => {
  res.json({ ok: true, service: "lobby-service" });
});

app.post("/create-room", (req, res) => {
  const { playerName } = req.body;

  if (!playerName || !playerName.trim()) {
    return res.status(400).json({ error: "playerName is required" });
  }

  let room = createInitialRoom(playerName.trim());

  while (rooms.has(room.roomId)) {
    room = createInitialRoom(playerName.trim());
  }

  rooms.set(room.roomId, room);
  res.status(201).json(room);
});

app.post("/join-room", (req, res) => {
  const { roomId, playerName } = req.body;

  if (!roomId || !playerName || !playerName.trim()) {
    return res.status(400).json({ error: "roomId and playerName are required" });
  }

  const room = rooms.get(roomId);

  if (!room) {
    return res.status(404).json({ error: "Room not found" });
  }

  if (room.player2) {
    return res.status(400).json({ error: "Room is full" });
  }

  if (room.player1 === playerName.trim()) {
    return res.status(400).json({ error: "Player name already in room" });
  }

  room.player2 = playerName.trim();
  rooms.set(roomId, room);

  res.json(room);
});

app.post("/ready", (req, res) => {
  const { roomId, playerName } = req.body;

  if (!roomId || !playerName || !playerName.trim()) {
    return res.status(400).json({ error: "roomId and playerName are required" });
  }

  const room = rooms.get(roomId);

  if (!room) {
    return res.status(404).json({ error: "Room not found" });
  }

  if (room.player1 === playerName.trim()) {
    room.player1Ready = true;
  } else if (room.player2 === playerName.trim()) {
    room.player2Ready = true;
  } else {
    return res.status(400).json({ error: "Player is not in this room" });
  }

  if (room.player1 && room.player2 && room.player1Ready && room.player2Ready) {
    room.gameStarted = true;
  }

  rooms.set(roomId, room);
  res.json(room);
});

app.get("/room/:roomId", (req, res) => {
  const { roomId } = req.params;
  const room = rooms.get(roomId);

  if (!room) {
    return res.status(404).json({ error: "Room not found" });
  }

  res.json(room);
});

app.listen(PORT, () => {
  console.log(`Lobby service running on http://localhost:${PORT}`);
});