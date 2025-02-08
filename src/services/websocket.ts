type MessageHandler = (data: any) => void;

type MessageLog = {
  type: 'send' | 'receive';
  timestamp: number;
  data: any;
};

class WebSocketService {
  private static instance: WebSocketService;
  private ws: WebSocket | null = null;
  private messageHandlers: Map<string, MessageHandler> = new Map();
  private errorHandlers: Set<() => void> = new Set();
  private messageLogs: MessageLog[] = [];
  private logHandlers: Set<(logs: MessageLog[]) => void> = new Set();
  private pingInterval: NodeJS.Timeout | null = null;
  
  // 私有构造函数用于单例模式，不需要初始化逻辑
  private constructor() {
    // 使用单例模式，构造函数故意留空
  }

  static getInstance(): WebSocketService {
    if (!WebSocketService.instance) {
      WebSocketService.instance = new WebSocketService();
    }
    return WebSocketService.instance;
  }

  connect() {
    if (this.ws?.readyState === WebSocket.OPEN) return;

    try {
      this.ws = new WebSocket(window.websocketURL);

      this.ws.onopen = () => {
        console.log('WebSocket连接已建立');
        // 启动心跳
        this.startPing();
      };

      this.ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          const { type, payload } = data;
          
          const handler = this.messageHandlers.get(type);
          if (handler) {
            handler(payload);
          }
          this.addMessageLog('receive', event.data);
        } catch (error) {
          console.error('处理WebSocket消息失败:', error);
        }
      };

      this.ws.onerror = (error) => {
        console.error('WebSocket错误:', error);
        this.errorHandlers.forEach(handler => handler());
      };

      this.ws.onclose = () => {
        console.log('WebSocket连接已关闭');
        this.stopPing();
        this.errorHandlers.forEach(handler => handler());
        // 尝试重新连接
        setTimeout(() => this.connect(), 3000);
      };
    } catch (error) {
      console.error('WebSocket连接失败:', error);
      this.errorHandlers.forEach(handler => handler());
    }
  }

  sendMessage(type: string, payload?: any) {
    if (this.ws?.readyState === WebSocket.OPEN) {
        const message = { type, payload };
        this.ws.send(JSON.stringify(message));
        this.addMessageLog('send', JSON.stringify(message));
      
    } else {
      console.error('WebSocket未连接');
    }

  }

  addMessageHandler(type: string, handler: MessageHandler) {
    this.messageHandlers.set(type, handler);
  }

  removeMessageHandler(type: string) {
    this.messageHandlers.delete(type);
  }

  addErrorHandler(handler: () => void) {
    this.errorHandlers.add(handler);
  }

  removeErrorHandler(handler: () => void) {
    this.errorHandlers.delete(handler);
  }

  disconnect() {
    this.stopPing();
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }

  isConnected(): boolean {
    return this.ws?.readyState === WebSocket.OPEN;
  }

  private addMessageLog(type: 'send' | 'receive', data: string) {
    const log = {
      type,
      timestamp: Date.now(),
      data
    };
    this.messageLogs.push(log);
    this.logHandlers.forEach(handler => handler(this.messageLogs));
  }

  addLogHandler(handler: (logs: MessageLog[]) => void) {
    this.logHandlers.add(handler);
    handler(this.messageLogs); // 立即发送当前日志
  }

  removeLogHandler(handler: (logs: MessageLog[]) => void) {
    this.logHandlers.delete(handler);
  }

  clearLogs() {
    this.messageLogs = [];
    this.logHandlers.forEach(handler => handler(this.messageLogs));
  }

  private startPing() {
    console.log('启动心跳');
    this.pingInterval = setInterval(() => {
      this.sendMessage('ping');
    }, 1000);
  }

  private stopPing() {
    if (this.pingInterval) {
      clearInterval(this.pingInterval);
      this.pingInterval = null;
    }
  }
}

export const wsService = WebSocketService.getInstance(); 