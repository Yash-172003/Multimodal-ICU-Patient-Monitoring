from typing import Dict
from fastapi import WebSocket

class ConnectionManager:
    def __init__(self):
        self.active: Dict[str, WebSocket] = {}

    async def connect(self, key: str, websocket: WebSocket):
        await websocket.accept()
        self.active[key] = websocket

    def disconnect(self, key: str):
        self.active.pop(key, None)

    async def send_json(self, key: str, data):
        ws = self.active.get(key)
        if ws:
            await ws.send_json(data)

manager = ConnectionManager()
