
from typing import List, Dict, Any
from fastapi import WebSocket

class ConnectionManager:
    def __init__(self) -> None:
        self.active_connections: List[WebSocket] = []

    async def connect(self, websocket: WebSocket) -> None:
        await websocket.accept()
        self.active_connections.append(websocket)

    def disconnect(self, websocket: WebSocket) -> None:
        if websocket in self.active_connections:
            self.active_connections.remove(websocket)

    async def send_personal_message(self, data: Dict[str, Any], websocket: WebSocket) -> None:
        await websocket.send_json(data)

    async def broadcast(self, data: Dict[str, Any]) -> None:
        # Envia para todos; remove silenciosamente quem caiu
        to_remove = []
        for ws in self.active_connections:
            try:
                await ws.send_json(data)
            except Exception:
                to_remove.append(ws)
        for ws in to_remove:
            self.disconnect(ws)

manager = ConnectionManager()
