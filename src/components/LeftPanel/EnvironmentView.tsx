import React, { useMemo, useState } from 'react';
import { Card } from 'antd';
import { LeftOutlined, RightOutlined } from '@ant-design/icons';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { useTheme } from '../../contexts/ThemeContext';

const EnvironmentView: React.FC = () => {
  // 获取导航信息和当前时间戳
  const navigationInfos = useSelector((state: RootState) => state.navigation.navigationInfos);
  const currentTimestamp = useSelector((state: RootState) => state.navigation.currentTimestamp);
  const { isDarkMode } = useTheme();
  const [startIndex, setStartIndex] = useState(0);

  // 每页显示的图片数量
  const IMAGES_PER_PAGE = 4;

  // 根据当前时间戳获取对应的导航信息
  const currentInfo = useMemo(() => {
    return navigationInfos.find(info => info.timestamp === currentTimestamp) || navigationInfos[navigationInfos.length - 1];
  }, [navigationInfos, currentTimestamp]);

  // 当前显示的图片
  const visibleImages = currentInfo?.imagesSurrounding.slice(startIndex, startIndex + IMAGES_PER_PAGE) || [];
  
  // 是否可以向前/向后滚动
  const canScrollPrev = startIndex > 0;
  const canScrollNext = currentInfo?.imagesSurrounding && startIndex + IMAGES_PER_PAGE < currentInfo.imagesSurrounding.length;

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

  return (
    <Card className={`flex-1 flex flex-col ${
      isDarkMode ? 'bg-[#1f1f1f] border-[#303030]' : 'bg-white border-gray-200'
    }`}>
      <div className={`text-lg mb-2 ${
        isDarkMode ? 'text-[#177ddc]' : 'text-[#1890ff]'
      }`}>
        T = {currentInfo?.timestamp || '当前时刻'}
      </div>
      
      {/* 智能体当前视角 */}
      <div className="flex-1 mb-2">
        <div className={`h-[33vh] rounded ${isDarkMode ? 'bg-[#262626]' : 'bg-gray-50'}`}>
          {currentInfo?.currentImage ? (
            <img 
              src={`/resource${currentInfo.currentImage}`} 
              alt="当前视角"
              className="w-full h-full object-contain"
            />

          ) : (
            <div className={`h-[33vh] flex items-center justify-center ${
              isDarkMode ? 'text-[#8c8c8c]' : 'text-gray-400'
            }`}>
              暂无视角图片
            </div>
          )}
        </div>
      </div>
      
      {/* 周边环境图片 */}
      <div className="mb-4">
        <div className={`mb-2 ${isDarkMode ? 'text-[#8c8c8c]' : 'text-gray-500'}`}>
          周边环境
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
            {visibleImages.map((image, i) => (
              <div key={startIndex + i} className={`border rounded ${
                isDarkMode ? 'border-[#303030]' : 'border-gray-200'
              }`}>
                <div className={`h-24 ${isDarkMode ? 'bg-[#262626]' : 'bg-gray-50'}`}>
                  <img 
                    src={`/resource${image}`} 
                    alt={`周边环境 ${startIndex + i + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className={`text-center py-1 border-t ${
                  isDarkMode ? 
                    'border-[#303030] text-[#8c8c8c]' : 
                    'border-gray-200 text-gray-500'
                }`}>
                  {startIndex + i + 1}
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

      {/* 环境描述 */}
      <div className={`border rounded p-4 ${
        isDarkMode ? 
          'border-[#303030] bg-[#262626]' : 
          'border-gray-200 bg-gray-50'
      }`}>
        <div className={`mb-2 ${isDarkMode ? 'text-[#8c8c8c]' : 'text-gray-500'}`}>
          环境描述
        </div>
        <div className={isDarkMode ? 'text-white' : 'text-gray-800'}>
          {currentInfo?.currentDescription || '暂无环境描述'}
        </div>
      </div>
    </Card>
  );
};

export default EnvironmentView; 