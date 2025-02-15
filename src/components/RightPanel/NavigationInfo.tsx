import React, { useState, useRef, useEffect } from 'react';
import { Modal, Image, Button, Rate, Input } from 'antd';
import { PlayCircleOutlined, LeftOutlined, RightOutlined, RobotOutlined, StarOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from '../../store';
import { setCurrentTimestamp } from '../../store/slices/navigationSlice';
import { useTheme } from '../../contexts/ThemeContext';
import { submitRating } from '../../store/slices/ratingSlice';
import { message } from 'antd';

interface NavigationInfoProps {
  timestamp: number;
  type: 0 | 1;
  imagesCandidate: {
    path: string;
    description: string;
  }[];
  video?: string; 
  text?: string;
  hasRatting: boolean;
}

const NavigationInfo: React.FC<NavigationInfoProps> = ({
  hasRatting,
  timestamp,
  type,
  imagesCandidate,
  video,
  text,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [thumbnailUrl, setThumbnailUrl] = useState<string>('');
  const [startIndex, setStartIndex] = useState(0);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isImagesExpanded, setIsImagesExpanded] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const { isDarkMode } = useTheme();
  const [isPreviewPlaying, setIsPreviewPlaying] = useState(false);
  const previewVideoRef = useRef<HTMLVideoElement>(null);
  const [isRatingModalOpen, setIsRatingModalOpen] = useState(false);
  const [comment, setComment] = useState('');
  const { TextArea } = Input;
  const [confidenceScore, setConfidenceScore] = useState(-1);
  const [difficultyScore, setDifficultyScore] = useState(-1);
  const [timingScore, setTimingScore] = useState(-1);
  const [contentScore, setContentScore] = useState(-1);
  const [interactionScore, setInteractionScore] = useState(-1);
  const [locationScore, setLocationScore] = useState(-1);

  const taskId = useSelector((state: RootState) => state.navigation.taskId);

  // 每页显示的图片数量
  const IMAGES_PER_PAGE = 4;
  // 是否可以向前/向后滚动
  const canScrollPrev = startIndex > 0;
  const canScrollNext = startIndex + IMAGES_PER_PAGE < imagesCandidate.length;
  // 当前显示的图片
  const visibleImages = imagesCandidate.slice(startIndex, startIndex + IMAGES_PER_PAGE);
  const userId = localStorage.getItem('userId') || 'unknown';
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
      // 创建预览视频元素
      const previewVideo = document.createElement('video');
      previewVideo.src = `/resource${video}`;
      previewVideo.crossOrigin = 'anonymous';
      previewVideo.muted = true; // 静音播放

      // 先生成缩略图
      previewVideo.addEventListener('loadeddata', () => {
        // 设置到视频开始位置
        previewVideo.currentTime = 0;
        
        const canvas = document.createElement('canvas');
        canvas.width = previewVideo.videoWidth;
        canvas.height = previewVideo.videoHeight;
        const ctx = canvas.getContext('2d');
        
        // 生成缩略图
        ctx?.drawImage(previewVideo, 0, 0, canvas.width, canvas.height);
        setThumbnailUrl(canvas.toDataURL('image/jpeg'));

        // 延迟一会儿再开始播放预览
        setTimeout(() => {
          setIsPreviewPlaying(true);
          previewVideo.play().then(() => {
            // 播放结束时
            previewVideo.addEventListener('ended', () => {
              setIsPreviewPlaying(false);
            });
          });
        }, 1000); // 延迟1秒开始播放
      });
    }
  }, [video]);

  const handleTimestampClick = () => {
    dispatch(setCurrentTimestamp(timestamp));
  };

  const handleRatingSubmit = async () => {
    try {
      dispatch(submitRating({
        timestamp,
        confidenceScore,
        difficultyScore,
        timingScore,
        contentScore,
        interactionScore,
        locationScore,
        comment,
        taskId,
        userId
      }));
      
      message.success('评价提交成功！');
      setIsRatingModalOpen(false);
      // 重置表单为 -1
      setConfidenceScore(-1);
      setDifficultyScore(-1);
      setTimingScore(-1);
      setContentScore(-1);
      setInteractionScore(-1);
      setLocationScore(-1);
      setComment('');
    } catch (error) {
      message.error('评价提交失败，请重试');
    }
  };

  return (
    <>
      <div>   
        {hasRatting && <Button 
              type="link"
              icon={<StarOutlined />}
              onClick={() => {setIsRatingModalOpen(true); dispatch(setCurrentTimestamp(timestamp - 1))}}
              className={isDarkMode ? 'bg-[#177ddc]' : ''}
            >
              {`评价 T=${timestamp - 1}`}
        </Button>}
      <div className="flex items-start gap-3 mb-4">
        {/* Agent头像 */}
        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
          isDarkMode ? 'bg-[#49aa19]' : 'bg-[#52c41a]'
        }`}>
          <RobotOutlined className="text-white" />
        </div>
        
        <div className="flex flex-col flex-1">
      
          {/* 时间戳行 - 添加评价按钮 */}
          <div className={`mb-1 flex items-center gap-2 justify-between ${
            isDarkMode ? 'text-[#8c8c8c]' : 'text-gray-500'
          }`}>
            <div className="flex items-center gap-2">
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
            
         
          </div>

          {/* 内容区域 */}
          <div className={`rounded-lg p-3 ${isDarkMode ? 'bg-[#262626]' : 'bg-gray-100'}`}>
            <div className={`rounded p-3 shadow-md ${
              isDarkMode ? 'bg-[#1f1f1f]' : 'bg-white'
            }`}>
              {/* 可选点图片列表 - 可折叠 */}
              <div className="mb-4">
                <div 
                  className={`flex items-center gap-2 cursor-pointer mb-2 ${
                    isDarkMode ? 'text-[#8c8c8c]' : 'text-gray-500'
                  }`}
                  onClick={() => setIsImagesExpanded(!isImagesExpanded)}
                >
                  {isImagesExpanded ? (
                    <RightOutlined className="rotate-90 transition-transform" />
                  ) : (
                    <RightOutlined className="transition-transform" />
                  )}
                  <span>可选点 ({imagesCandidate.length})</span>
                </div>
                
                {isImagesExpanded && (
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
                              src={`/resource${path}`}
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
                )}
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
                    <div 
                      className={`relative h-32 rounded overflow-hidden cursor-pointer ${
                        isDarkMode ? 'bg-[#262626]' : 'bg-gray-50'
                      }`}
                      onClick={() => setIsVideoModalOpen(true)}
                    >
                      {isPreviewPlaying ? (
                        <video
                          ref={previewVideoRef}
                          src={`/resource${video}`}
                          className="w-full h-full object-cover"
                          muted
                          autoPlay
                        />
                      ) : thumbnailUrl ? (
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
                      {!isPreviewPlaying && <div className={`absolute inset-0 flex items-center justify-center ${
                        isDarkMode ? 
                          'bg-black/20 hover:bg-black/40' : 
                          'bg-black/10 hover:bg-black/30'
                      } transition-colors`}>
                        <div className="w-full h-full flex items-center justify-center">
                          <PlayCircleOutlined 
                            className={`text-[64px] ${
                              isDarkMode ? 
                                'text-white/90 hover:text-white' : 
                                'text-white/80 hover:text-white/90'
                            }`}
                            style={{ 
                              cursor: 'pointer',
                              color: isDarkMode ? 
                                'rgba(255, 255, 255, 0.9)' : 
                                'rgba(255, 255, 255, 0.8)',
                              transition: 'color 0.3s'
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.color = 'rgba(255, 255, 255, 1)';
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.color = isDarkMode ? 
                                'rgba(255, 255, 255, 0.9)' : 
                                'rgba(255, 255, 255, 0.8)';
                            }}
                          />
                        </div>
                      </div>}
                    </div>
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
            src={`/resource${video}`}
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
          <Image
            src={`/resource${selectedImage}`}
            alt="预览图片"
            className="w-full h-full object-cover"
          />
        )}
      </Modal>

      {/* 评价弹窗 */}
      <Modal
        title="步骤评价"
        open={isRatingModalOpen}
        onCancel={() => setIsRatingModalOpen(false)}
        onOk={handleRatingSubmit}
        okText="提交"
        cancelText="取消"
        className={isDarkMode ? 'ant-modal-dark' : ''}
      >
        <div className="space-y-4">
          <div>
            <div className="mb-2">回复置信度：</div>
            <Rate 
              value={confidenceScore} 
              onChange={setConfidenceScore}
              count={3}
              className={isDarkMode ? 'text-[#177ddc]' : ''}
            />
          </div>
          <div>
            <div className="mb-2">回复困难度：</div>
            <Rate 
              value={difficultyScore} 
              onChange={setDifficultyScore}
              count={3}
              className={isDarkMode ? 'text-[#177ddc]' : ''}
            />
          </div>
          <div>
            <div className="mb-2">提问时机：</div>
            <Rate 
              value={timingScore} 
              onChange={setTimingScore}
              count={3}
              className={isDarkMode ? 'text-[#177ddc]' : ''}
            />
          </div>
          <div>
            <div className="mb-2">问题内容：</div>
            <Rate 
              value={contentScore} 
              onChange={setContentScore}
              count={3}
              className={isDarkMode ? 'text-[#177ddc]' : ''}
            />
          </div>
          <div>
            <div className="mb-2">交互行为：</div>
            <Rate 
              value={interactionScore} 
              onChange={setInteractionScore}
              count={3}
              className={isDarkMode ? 'text-[#177ddc]' : ''}
            />
          </div>
          <div>
            <div className="mb-2">位置描述：</div>
            <Rate 
              value={locationScore} 
              onChange={setLocationScore}
              count={3}
              className={isDarkMode ? 'text-[#177ddc]' : ''}
            />
          </div>
          <div>
            <div className="mb-2">评价内容：</div>
            <TextArea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="请输入您的评价..."
              rows={4}
              className={isDarkMode ? 'bg-[#1f1f1f] border-[#434343] text-white' : ''}
            />
          </div>
        </div>
      </Modal>
    </>
  );
};

export default NavigationInfo;