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
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50" role="dialog" aria-modal="true">
      <div className="bg-gray-900/90 backdrop-blur-lg rounded-xl shadow-2xl max-w-md w-full relative overflow-hidden text-white border border-white/10">
        <button
          className="absolute top-2 right-2 text-gray-300 hover:text-white transition-colors"
          onClick={onClose}
          aria-label="Close modal"
        >
          <X size={24} />
        </button>
        
        <h2 className="text-2xl font-bold mb-6 text-center pt-6 bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-violet-500">
          Support Breath Better
        </h2>
        
        <div className="px-6 pb-6">
          <a
            href={lightningAddress}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center w-full bg-gradient-to-r from-pink-500 to-violet-500 text-white py-3 px-4 rounded-lg font-bold 
                     hover:from-pink-600 hover:to-violet-600 transition duration-300 mb-4 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
          >
            ⚡ Pay with Lightning <ExternalLink size={20} className="ml-2" />
          </a>
          
          <div className="mt-6 text-center">
            <h3 className="text-xl font-semibold mb-2">Bitcoin Address</h3>
            <div className="mb-4 flex justify-center bg-white/5 p-4 rounded-lg">
              <QRCodeSVG 
                value={btcAddress} 
                size={200} 
                bgColor="transparent" 
                fgColor="#ffffff" 
                level="H"
              />
            </div>
            <p className="text-sm text-gray-300 mb-2 break-all font-mono">{btcAddress}</p>
            <button
              className="inline-flex items-center justify-center bg-white/10 text-white py-2 px-4 rounded-lg 
                       hover:bg-white/20 transition duration-300 border border-white/10"
              onClick={() => copyToClipboard(btcAddress)}
            >
              Copy BTC Address <Copy size={20} className="ml-2" />
            </button>
          </div>
          
          <p className="text-center text-gray-300 font-medium mt-6">
            Thank you for supporting Breath Better! 🙏
          </p>
        </div>
      </div>
    </div>
  );
};

export default TipButton; 