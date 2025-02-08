假设你是一个经验丰富的UI设计工程师和优秀的前端开发工程师，现在需要设计一个ai自主导航网页，导航网页需要包含以下内容：
## 项目需求
1. 左侧的任务选择以及当前环境图片
2. 右侧 agent 聊天助手
   - 各时刻agent 自主导航信息：包含可选点图片列表、回放视频链接、自主决策信息
   - 当agent不确定时，会将寻求帮助信息高亮展示出来，用户可以通过下方输入框输入信息，点击发送后，agent 会根据用户的问题给出回答，并更新自主决策信息。
   - 用户可以点击回放视频链接，查看agent 自主导航的视频。
   - 用户可以点击可选点图片列表，查看agent 自主导航的图片。
   - 聊天历史包含滚动条，输入框固定在底部。
3. 页面中部有一个分隔栏，用户可以自动调节左右两侧的宽度
## 项目技术栈
- 前端框架: React + TypeScript
- 样式库: Tailwind CSS
- UI组件库: Ant Design
- 状态管理: Redux Toolkit
- 请求库: Axios
- 项目管理: git
- 代码规范: ESLint
- 代码格式化: Prettier
# 构建镜像
## 先构建基础镜像
docker build -t ai-navigation-base -f Dockerfile.base .

## 再构建最终镜像
docker build -t ai-navigation-dev .

# 运行容器并挂载源代码目录
docker run -d --name ai-navigation -p 8081:8081 -v ./src:/app/src  --add-host=host.docker.internal:host-gateway ai-navigation-dev

# 进入容器
docker exec -it ai-navigation bash

# 在容器内修改代码后

npm run build  # 重新构建
nginx -s reload  # 重新加载 nginx 配置
