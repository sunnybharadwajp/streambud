import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import cors from "cors";
import { OBSWebSocket } from "obs-websocket-js";

const app = express();
const httpServer = createServer(app);

app.use(cors());

const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

const obs = new OBSWebSocket();

obs
  .connect("ws://10.0.0.103:4455", "0Wbw1ATDYAl1cBnM")
  .then(() => {
    console.log("Connected to OBS");
  })
  .catch((error) => {
    console.error("Failed to connect to OBS:", error);
  });

io.on("connection", (socket) => {
  console.log("User Connected");

  socket.on("overlayUpdate", (data) => {
    obs
      .call("SetInputSettings", {
        inputName: data.sourceName,
        inputSettings: {
          url: data.url,
        },
      })
      .then(() => {
        console.log("Overlay updated");
      })
      .catch((error) => {
        console.error("Failed to update overlay:", error);
      });
  });

  socket.on("dragUpdate", (data) => {
    console.log(`Box moved to X:${data.posX}, Y:${data.posY}`);
    io.emit("boxMoved", data);
  });

  socket.on("disconnect", () => {
    console.log("User Disconnected");
  });
});

httpServer.listen(3000, () => {
  console.log("Server is running on port 3000");
});
