import React, { useState, useRef, useEffect } from 'react';
import { Modal, Image } from 'antd';
import { PlayCircleOutlined, LeftOutlined, RightOutlined, RobotOutlined } from '@ant-design/icons';
import { useDispatch } from 'react-redux';
import { setCurrentTimestamp } from '../../store/slices/navigationSlice';
import { useTheme } from '../../contexts/ThemeContext';

interface NavigationInfoProps {
  timestamp: number;
  type: 0 | 1;
  imagesCandidate: {
    path: string;
    description: string;
  }[];
  video?: string; 
  text?: string;
}

const NavigationInfo: React.FC<NavigationInfoProps> = ({
  timestamp,
  type,
  imagesCandidate,
  video,
  text,
}) => {
  const dispatch = useDispatch();
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [thumbnailUrl, setThumbnailUrl] = useState<string>('');
  const [startIndex, setStartIndex] = useState(0);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const { isDarkMode } = useTheme();

  // 每页显示的图片数量
  const IMAGES_PER_PAGE = 4;
  // 是否可以向前/向后滚动
  const canScrollPrev = startIndex > 0;
  const canScrollNext = startIndex + IMAGES_PER_PAGE < imagesCandidate.length;
  // 当前显示的图片
  const visibleImages = imagesCandidate.slice(startIndex, startIndex + IMAGES_PER_PAGE);

  // 翻页处理
  const handlePrevImage = () => {
    if (canScrollPrev) {
      setStartIndex(prev => prev - 1);
    }
  };

  const handleNextImage = () => {
    if (canScrollNext) {
      setStartIndex(prev => prev + 1);
    }
  };

  useEffect(() => {
    if (video) {
      // 创建一个临时视频元素来生成缩略图
      const tempVideo = document.createElement('video');
      tempVideo.src = video;
      tempVideo.crossOrigin = 'anonymous'; // 如果视频来自其他域名

      tempVideo.addEventListener('loadeddata', () => {
        // 视频加载完成后，在 1 秒处生成缩略图
        tempVideo.currentTime = 1;
      });

      tempVideo.addEventListener('seeked', () => {
        // 创建 canvas 并绘制视频帧
        const canvas = document.createElement('canvas');
        canvas.width = tempVideo.videoWidth;
        canvas.height = tempVideo.videoHeight;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(tempVideo, 0, 0, canvas.width, canvas.height);
        
        // 将 canvas 转换为图片 URL
        const dataUrl = canvas.toDataURL('image/jpeg');
        setThumbnailUrl(dataUrl);
      });
    }
  }, [video]);

  const handleTimestampClick = () => {
    dispatch(setCurrentTimestamp(timestamp));
  };

  return (
    <>
      <div className="flex items-start gap-3 mb-4">
        {/* Agent头像 */}
        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
          isDarkMode ? 'bg-[#49aa19]' : 'bg-[#52c41a]'
        }`}>
          <RobotOutlined className="text-white" />
        </div>

        <div className="flex flex-col flex-1">
          {/* 时间戳 */}
          <div className={`mb-1 flex items-center gap-2 ${
            isDarkMode ? 'text-[#8c8c8c]' : 'text-gray-500'
          }`}>
            <span>Agent</span>
            <span 
              className={`cursor-pointer ${
                isDarkMode ? 
                  'text-[#177ddc] hover:text-[#1765ad]' : 
                  'text-[#1890ff] hover:text-[#40a9ff]'
              }`}
              onClick={handleTimestampClick}
            >
              T={timestamp}
            </span>
          </div>

          {/* 内容区域 */}
          <div className={`rounded-lg p-3 ${isDarkMode ? 'bg-[#262626]' : 'bg-gray-100'}`}>
            <div className={`rounded p-3 shadow-md ${
              isDarkMode ? 'bg-[#1f1f1f]' : 'bg-white'
            }`}>
              {/* 可选点图片列表 - 轮播样式 */}
              <div className="mb-4">
                <div className={`mb-2 ${
                  isDarkMode ? 'text-[#8c8c8c]' : 'text-gray-500'
                }`}>
                  可选点
                </div>
                <div className="relative">
                  {/* 左箭头 */}
                  {canScrollPrev && (
                    <button 
                      className={`absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 
                        ${isDarkMode ? 
                          'bg-[#262626] hover:bg-[#303030] text-[#8c8c8c]' : 
                          'bg-white hover:bg-gray-100 text-gray-600'
                        } rounded-full p-2 shadow-md transition-colors`}
                      onClick={handlePrevImage}
                    >
                      <LeftOutlined className="text-lg" />
                    </button>
                  )}
                  
                  {/* 图片列表 */}
                  <div className="grid grid-cols-4 gap-4">
                    {visibleImages.map(({path, description}, i) => (
                      <div key={startIndex + i} className={`border rounded ${
                        isDarkMode ? 'border-[#303030]' : 'border-gray-200'
                      }`}>
                        <div 
                          className={`h-24 ${isDarkMode ? 'bg-[#262626]' : 'bg-gray-50'} cursor-pointer`}
                          onClick={() => setSelectedImage(path)}
                        >
                          <img 
                            src={path}
                            alt={`可选点 ${startIndex + i + 1}`}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className={`text-center py-1 border-t ${
                          isDarkMode ? 
                            'border-[#303030] text-[#8c8c8c]' : 
                            'border-gray-200 text-gray-500'
                        }`}>
                          {description}
                        </div>
                      </div>
                    ))}
                    {/* 填充空白格子保持布局 */}
                    {visibleImages.length < IMAGES_PER_PAGE && 
                      Array(IMAGES_PER_PAGE - visibleImages.length)
                        .fill(null)
                        .map((_, i) => (
                          <div key={`empty-${i}`} className={`border rounded ${
                            isDarkMode ? 'border-[#303030]' : 'border-gray-200'
                          } opacity-0`}>
                            <div className={`h-24 ${isDarkMode ? 'bg-[#262626]' : 'bg-gray-50'}`} />
                            <div className={`text-center py-1 border-t ${
                              isDarkMode ? 
                                'border-[#303030] text-[#8c8c8c]' : 
                                'border-gray-200 text-gray-500'
                            }`}>空</div>
                          </div>
                        ))
                    }
                  </div>

                  {/* 右箭头 */}
                  {canScrollNext && (
                    <button 
                      className={`absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 
                        ${isDarkMode ? 
                          'bg-[#262626] hover:bg-[#303030] text-[#8c8c8c]' : 
                          'bg-white hover:bg-gray-100 text-gray-600'
                        } rounded-full p-2 shadow-md transition-colors`}
                      onClick={handleNextImage}
                    >
                      <RightOutlined className="text-lg" />
                    </button>
                  )}
                </div>
              </div>

              {/* 视频预览部分 - 始终显示区域 */}
              <div className="mb-4">
                <div className={`mb-2 ${
                  isDarkMode ? 'text-[#8c8c8c]' : 'text-gray-500'
                }`}>
                  路径回放视频（从T=1到当前时刻轨迹视频）
                </div>
                <div className="w-1/2">
                  {video ? (
                    <>
                      {/* 有视频时显示缩略图和播放按钮 */}
                      <div 
                        className={`relative h-32 rounded overflow-hidden cursor-pointer ${
                          isDarkMode ? 'bg-[#262626]' : 'bg-gray-50'
                        }`}
                        onClick={() => setIsVideoModalOpen(true)}
                      >
                        {thumbnailUrl ? (
                          <img 
                            src={thumbnailUrl}
                            alt="视频缩略图"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className={`w-full h-full flex items-center justify-center ${
                            isDarkMode ? 'text-[#8c8c8c]' : 'text-gray-400'
                          }`}>
                            加载中...
                          </div>
                        )}
                        <div className={`absolute inset-0 flex items-center justify-center ${
                          isDarkMode ? 
                            'bg-black/20 hover:bg-black/40' : 
                            'bg-black/10 hover:bg-black/30'
                        } transition-colors`}>
                          <div className="w-full h-full flex items-center justify-center">
                            <PlayCircleOutlined className={`text-[64px] ${
                              isDarkMode ? 
                                'text-white/90 hover:text-white' : 
                                'text-white/80 hover:text-white/90'
                            } transition-colors`} />
                          </div>
                        </div>
                      </div>
                     
                    </>
                  ) : (
                    // 无视频时显示占位区域
                    <div className={`h-32 rounded flex items-center justify-center ${
                      isDarkMode ? 
                        'bg-[#262626] text-[#8c8c8c]' : 
                        'bg-gray-50 text-gray-400'
                    }`}>
                      暂无回放视频
                    </div>
                  )}
                </div>
              </div>

              {/* 决策/问题内容 */}
              {type === 0 ? (
                <div className={`border rounded p-2 ${
                  isDarkMode ? 
                    'border-[#303030] text-white' : 
                    'border-gray-200 text-gray-800'
                }`}>
                  自主决策：{text}
                </div>
              ) : (
                <div className={`border rounded p-2 ${
                  isDarkMode ? 
                    'border-[#303030] text-white' : 
                    'border-gray-200 text-gray-800'
                }`}>
                  <div className="text-[#ff4d4f]">
                    寻求帮助：{text}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 视频播放弹窗 */}
      <Modal
        title={`路径回放视频 (T=1 到 T=${timestamp})`}
        open={isVideoModalOpen}
        onCancel={() => setIsVideoModalOpen(false)}
        footer={null}
        width={800}
        centered
        className={isDarkMode ? 'ant-modal-dark' : ''}
      >
        <div className="aspect-w-16 aspect-h-9">
          <video 
            ref={videoRef}
            controls 
            className={`w-full rounded ${
              isDarkMode ? 'bg-[#262626]' : 'bg-gray-50'
            }`}
            src={video}
          >
            <div className={isDarkMode ? 'text-[#8c8c8c]' : 'text-gray-500'}>
              您的浏览器不支持视频播放。
            </div>
          </video>
        </div>
      </Modal>

      {/* 图片预览弹窗 */}
      <Modal
        open={!!selectedImage}
        onCancel={() => setSelectedImage(null)}
        footer={null}
        width={800}
        centered
        className={isDarkMode ? 'ant-modal-dark' : ''}
        title={`可选点${selectedImage ? imagesCandidate.findIndex(item => item.path === selectedImage) + 1 : ''}预览`}
      >
        {selectedImage && (
          <div className={`flex items-center justify-center ${
            isDarkMode ? 'bg-[#262626]' : 'bg-gray-50'
          }`}>
            <Image
              src={selectedImage}
              alt={`可选点${imagesCandidate.findIndex(item => item.path === selectedImage) + 1}`}
              className="max-h-[600px] object-contain"
              preview={false}
            />
          </div>
        )}
      </Modal>
    </>
  );
};

export default NavigationInfo; 