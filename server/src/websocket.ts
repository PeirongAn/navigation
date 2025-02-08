import { WebSocketServer, WebSocket } from 'ws';
import { handleTaskStart } from './controllers/taskController';

interface ExtWebSocket extends WebSocket {
  isAlive: boolean;
}

export function setupWebSocket(wss: WebSocketServer) {
  wss.on('connection', (ws: ExtWebSocket) => {
    console.log('新的WebSocket连接已建立');
    ws.isAlive = true;

    ws.on('message', async (message: string) => {
      try {
        const data = JSON.parse(message);
        
        switch (data.type) {
          case 'start_task':
            await handleTaskStart(ws, data.payload);
            break;
          default:
            console.warn('未知的消息类型:', data.type);
        }
      } catch (error) {
        console.error('处理WebSocket消息时出错:', error);
      }
    });

    ws.on('pong', () => {
      ws.isAlive = true;
    });

    ws.on('close', () => {
      console.log('WebSocket连接已关闭');
    });
  });

  // 心跳检测
  const interval = setInterval(() => {
    wss.clients.forEach((ws) => {
      const extWs = ws as ExtWebSocket;
      if (!extWs.isAlive) {
        return extWs.terminate();
      }
      extWs.isAlive = false;
      extWs.ping();
    });
  }, 30000);

  wss.on('close', () => {
    clearInterval(interval);
  });
} 