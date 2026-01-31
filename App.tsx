
import React, { useState, useCallback } from 'react';
import { AppStep, AppState, SelectionOption } from './types';
import { CHARACTERS, BACKGROUNDS } from './constants';
import { generateMarketingImage } from './services/geminiService';
import StepIndicator from './components/StepIndicator';

const App: React.FC = () => {
  const [state, setState] = useState<AppState>({
    step: AppStep.UPLOAD,
    productImage: null,
    selectedCharacter: null,
    selectedBackground: null,
    resultImage: null,
    error: null
  });

  const handleProductUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setState(prev => ({ 
          ...prev, 
          productImage: reader.result as string,
          step: AppStep.CHARACTER 
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const selectCharacter = (char: SelectionOption) => {
    setState(prev => ({ ...prev, selectedCharacter: char, step: AppStep.BACKGROUND }));
  };

  const selectBackground = async (bg: SelectionOption) => {
    const newState = { ...state, selectedBackground: bg, step: AppStep.GENERATING, error: null };
    setState(newState);

    try {
      if (!state.productImage || !state.selectedCharacter) return;
      
      const result = await generateMarketingImage(
        state.productImage,
        state.selectedCharacter.promptDescription,
        bg.promptDescription
      );
      
      setState(prev => ({ ...prev, resultImage: result, step: AppStep.RESULT }));
    } catch (err: any) {
      setState(prev => ({ 
        ...prev, 
        error: "Có lỗi xảy ra khi tạo ảnh. Vui lòng thử lại.", 
        step: AppStep.BACKGROUND 
      }));
    }
  };

  const resetAll = () => {
    setState({
      step: AppStep.UPLOAD,
      productImage: null,
      selectedCharacter: null,
      selectedBackground: null,
      resultImage: null,
      error: null
    });
  };

  const downloadImage = () => {
    if (!state.resultImage) return;
    const link = document.createElement('a');
    link.href = state.resultImage;
    link.download = `hmc-beauty-marketing-${Date.now()}.png`;
    link.click();
  };

  return (
    <div className="min-h-screen bg-neutral-50 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-pink-100 py-6 px-4 shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex flex-col items-center">
          <h1 className="text-3xl md:text-4xl font-bold text-pink-700 tracking-widest uppercase">
            HMC AI BEAUTY
          </h1>
          <p className="text-gray-500 text-sm mt-1 font-medium tracking-tight">CÔNG NGHỆ LÀM ĐẸP THÔNG MINH</p>
        </div>
      </header>

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 py-8">
        <StepIndicator currentStep={state.step} />

        {state.error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-6 text-center">
            {state.error}
          </div>
        )}

        {/* Step 1: Upload */}
        {state.step === AppStep.UPLOAD && (
          <div className="max-w-2xl mx-auto text-center animate-fadeIn">
            <h2 className="text-2xl font-semibold mb-6">Phần 1: Tải hình ảnh SẢN PHẨM</h2>
            <div className="relative group">
              <input
                type="file"
                accept="image/*"
                onChange={handleProductUpload}
                className="hidden"
                id="product-upload"
              />
              <label 
                htmlFor="product-upload"
                className="cursor-pointer block border-4 border-dashed border-pink-200 rounded-3xl p-12 transition-all hover:border-pink-400 hover:bg-pink-50"
              >
                <div className="flex flex-col items-center">
                  <div className="w-20 h-20 bg-pink-100 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <i className="fas fa-cloud-upload-alt text-3xl text-pink-600"></i>
                  </div>
                  <h3 className="text-xl font-medium mb-2">Chọn ảnh sản phẩm của bạn</h3>
                  <p className="text-gray-400 text-sm">Hỗ trợ định dạng PNG, JPG, JPEG</p>
                </div>
              </label>
            </div>
            <p className="mt-8 text-sm text-gray-500">
              Lưu ý: Hình ảnh sản phẩm nên rõ nét để đạt được kết quả tốt nhất.
            </p>
          </div>
        )}

        {/* Step 2: Character */}
        {state.step === AppStep.CHARACTER && (
          <div className="animate-fadeIn">
            <h2 className="text-2xl font-semibold mb-8 text-center">Phần 2: Chọn nhân vật người mẫu</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {CHARACTERS.map((char) => (
                <button 
                  key={char.id}
                  onClick={() => selectCharacter(char)}
                  className="group relative overflow-hidden rounded-2xl shadow-lg transition-all hover:-translate-y-2 hover:shadow-2xl"
                >
                  <img src={char.thumbnail} alt={char.name} className="w-full h-[400px] object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end justify-center p-6 opacity-90 group-hover:opacity-100">
                    <span className="text-white text-xl font-bold tracking-wider">{char.name}</span>
                  </div>
                  <div className="absolute top-4 right-4 bg-pink-600 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                    <i className="fas fa-check"></i>
                  </div>
                </button>
              ))}
            </div>
            <button 
              onClick={() => setState(p => ({ ...p, step: AppStep.UPLOAD }))}
              className="mt-12 mx-auto block text-gray-500 hover:text-pink-600 font-medium"
            >
              <i className="fas fa-arrow-left mr-2"></i> Quay lại
            </button>
          </div>
        )}

        {/* Step 3: Background */}
        {state.step === AppStep.BACKGROUND && (
          <div className="animate-fadeIn">
            <h2 className="text-2xl font-semibold mb-8 text-center">Phần 3: Chọn bối cảnh phù hợp</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {BACKGROUNDS.map((bg) => (
                <button 
                  key={bg.id}
                  onClick={() => selectBackground(bg)}
                  className="group relative overflow-hidden rounded-xl shadow-md transition-all hover:scale-105 hover:shadow-xl"
                >
                  <img src={bg.thumbnail} alt={bg.name} className="w-full h-48 object-cover" />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="bg-white text-pink-700 px-4 py-2 rounded-full font-bold text-sm">
                      LỰA CHỌN
                    </div>
                  </div>
                  <div className="p-3 bg-white">
                    <span className="text-gray-800 text-sm font-semibold truncate block">{bg.name}</span>
                  </div>
                </button>
              ))}
            </div>
            <button 
              onClick={() => setState(p => ({ ...p, step: AppStep.CHARACTER }))}
              className="mt-12 mx-auto block text-gray-500 hover:text-pink-600 font-medium"
            >
              <i className="fas fa-arrow-left mr-2"></i> Quay lại
            </button>
          </div>
        )}

        {/* Loading State */}
        {state.step === AppStep.GENERATING && (
          <div className="max-w-2xl mx-auto flex flex-col items-center py-20 text-center animate-fadeIn">
            <div className="relative mb-8">
              <div className="w-24 h-24 border-4 border-pink-100 border-t-pink-600 rounded-full animate-spin"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <i className="fas fa-magic text-pink-600 animate-pulse"></i>
              </div>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Đang tạo kết quả...</h2>
            <p className="text-gray-500 max-w-sm">
              AI của HMC đang tích hợp sản phẩm vào bối cảnh bạn đã chọn. Việc này có thể mất một vài giây.
            </p>
            <div className="mt-8 flex flex-col gap-2 w-full max-w-xs">
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div className="h-full bg-pink-600 animate-[loading_10s_ease-in-out_infinite]" style={{ width: '80%' }}></div>
              </div>
              <style>{`
                @keyframes loading {
                  0% { transform: translateX(-100%); }
                  50% { transform: translateX(0); }
                  100% { transform: translateX(100%); }
                }
              `}</style>
            </div>
          </div>
        )}

        {/* Step 4: Result */}
        {state.step === AppStep.RESULT && state.resultImage && (
          <div className="max-w-4xl mx-auto animate-fadeIn">
            <h2 className="text-3xl font-bold mb-8 text-center text-pink-700">Kết Quả Hoàn Tất</h2>
            
            <div className="bg-white p-4 rounded-3xl shadow-2xl border border-pink-50 mb-12">
              <img 
                src={state.resultImage} 
                alt="AI Generated Result" 
                className="w-full h-auto rounded-2xl shadow-inner"
              />
            </div>

            <div className="flex flex-col md:flex-row gap-6 justify-center">
              <button 
                onClick={downloadImage}
                className="flex-1 max-w-md bg-pink-700 hover:bg-pink-800 text-white py-6 px-10 rounded-2xl text-xl font-bold shadow-xl transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-3"
              >
                <i className="fas fa-download"></i>
                TẢI ẢNH XUỐNG
              </button>
              <button 
                onClick={resetAll}
                className="flex-1 max-w-md bg-white border-4 border-pink-600 text-pink-700 hover:bg-pink-50 py-6 px-10 rounded-2xl text-xl font-bold shadow-xl transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-3"
              >
                <i className="fas fa-redo"></i>
                LÀM THÊM KẾT QUẢ KHÁC
              </button>
            </div>

            <div className="mt-12 p-6 bg-pink-50 rounded-2xl border border-pink-100 flex items-start gap-4">
              <div className="bg-pink-600 text-white w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <i className="fas fa-info text-xs"></i>
              </div>
              <div>
                <h4 className="font-bold text-pink-800 mb-1">Mẹo cho bạn:</h4>
                <p className="text-pink-700 text-sm leading-relaxed">
                  Bạn có thể tạo thêm nhiều kết quả khác với cùng một sản phẩm bằng cách chọn bối cảnh khác nhau. 
                  Sử dụng hình ảnh này cho Landing Page, Facebook Ads hoặc Instagram để tăng tỷ lệ chuyển đổi!
                </p>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-100 py-10 px-4 mt-auto">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-center md:text-left">
            <h3 className="text-xl font-bold text-pink-700">HMC AI BEAUTY</h3>
            <p className="text-gray-400 text-xs mt-1">Powered by Advanced Gemini AI Technology</p>
          </div>
          <div className="flex gap-8 text-gray-400">
            <a href="#" className="hover:text-pink-600 transition-colors">Điều khoản</a>
            <a href="#" className="hover:text-pink-600 transition-colors">Bảo mật</a>
            <a href="#" className="hover:text-pink-600 transition-colors">Hỗ trợ</a>
          </div>
          <p className="text-gray-400 text-sm">
            © {new Date().getFullYear()} HMC Beauty Tech. All rights reserved.
          </p>
        </div>
      </footer>

      {/* Tailwind Animations */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}</style>
    </div>
  );
};

export default App;
