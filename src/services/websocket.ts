type MessageHandler = (data: any) => void;

class WebSocketService {
  private static instance: WebSocketService;
  private ws: WebSocket | null = null;
  private messageHandlers: Map<string, MessageHandler> = new Map();
  private errorHandlers: Set<() => void> = new Set();
  
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

  connect(url = 'ws://localhost:8080/ws') {
    if (this.ws?.readyState === WebSocket.OPEN) return;

    try {
      this.ws = new WebSocket(url);

      this.ws.onopen = () => {
        console.log('WebSocket连接已建立');
      };

      this.ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          const { type, payload } = data;
          
          const handler = this.messageHandlers.get(type);
          if (handler) {
            handler(payload);
          }
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
      this.ws.send(JSON.stringify({ type, payload }));
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
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }
}

export const wsService = WebSocketService.getInstance(); 