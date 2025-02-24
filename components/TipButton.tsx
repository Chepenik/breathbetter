"use client";

import React from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Copy, ExternalLink, X } from 'lucide-react';

interface TipButtonProps {
  isOpen: boolean;
  onClose: () => void;
}

const TipButton: React.FC<TipButtonProps> = ({ isOpen, onClose }) => {
  const btcAddress = 'bc1q2gqqevaj6vjehkgsawdldyer4xp9qx4lqfstncewl8scp9thtdfsn6prqe';
  const lightningAddress = 'https://strike.me/chepenik/';

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      console.info('BTC Address copied to clipboard');
    } catch (error) {
      console.error('Failed to copy BTC Address', error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/75 dark:bg-black/75 flex items-center justify-center p-4 z-50" role="dialog" aria-modal="true">
      <div className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-lg rounded-xl shadow-2xl max-w-md w-full relative overflow-hidden text-slate-900 dark:text-white border border-slate-200 dark:border-white/10">
        <button
          className="absolute top-2 right-2 text-gray-300 hover:text-white transition-colors"
          onClick={onClose}
          aria-label="Close modal"
        >
          <X size={24} />
        </button>
        
        <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-center pt-4 sm:pt-6 bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-violet-500">
          Support Breath Better
        </h2>
        
        <div className="px-4 sm:px-6 pb-4 sm:pb-6">
          <a
            href={lightningAddress}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center w-full bg-gradient-to-r from-pink-500 to-violet-500 text-white py-2.5 sm:py-3 px-3 sm:px-4 rounded-lg font-bold 
                     hover:from-pink-600 hover:to-violet-600 transition duration-300 mb-4 shadow-lg hover:shadow-xl transform hover:-translate-y-1 text-sm sm:text-base"
          >
            ⚡ Pay with Lightning <ExternalLink size={18} className="ml-2" />
          </a>
          
          <div className="mt-4 sm:mt-6 text-center">
            <h3 className="text-lg sm:text-xl font-semibold mb-2">Bitcoin Address</h3>
            <div className="mb-4 flex justify-center bg-white/5 p-2 sm:p-4 rounded-lg">
              <QRCodeSVG 
                value={btcAddress} 
                size={160} 
                bgColor="transparent" 
                fgColor="currentColor" 
                level="H"
              />
            </div>
            <p className="text-xs sm:text-sm text-slate-900 dark:text-gray-300 mb-2 break-all font-mono">{btcAddress}</p>
            <button
              className="inline-flex items-center justify-center bg-white/10 hover:bg-white/20 text-slate-900 dark:text-white py-1.5 sm:py-2 px-3 sm:px-4 rounded-lg 
                       transition duration-300 border border-slate-300 dark:border-white/10 text-xs sm:text-sm"
              onClick={() => copyToClipboard(btcAddress)}
            >
              Copy BTC Address <Copy size={16} className="ml-2" />
            </button>
          </div>
          
          <p className="text-center text-slate-900 dark:text-gray-300 font-medium mt-4 sm:mt-6 text-xs sm:text-sm">
            Thank you for supporting Breath Better! 🙏
          </p>
        </div>
      </div>
    </div>
  );
};

export default TipButton; 