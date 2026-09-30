import React from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { ShieldCheck, ExternalLink, Download } from 'lucide-react';

interface QRCodeGeneratorProps {
  donationId: string;
  size?: number;
  showDownloadBtn?: boolean;
}

export const QRCodeGenerator: React.FC<QRCodeGeneratorProps> = ({
  donationId,
  size = 180,
  showDownloadBtn = true
}) => {
  const traceabilityUrl = `${window.location.origin}/#traceability?id=${donationId}`;

  const downloadQR = () => {
    const svg = document.getElementById(`qr-svg-${donationId}`);
    if (!svg) return;
    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    img.onload = () => {
      canvas.width = size;
      canvas.height = size;
      ctx?.drawImage(img, 0, 0);
      const pngFile = canvas.toDataURL('image/png');
      const downloadLink = document.createElement('a');
      downloadLink.download = `FoodBridge-QR-${donationId}.png`;
      downloadLink.href = pngFile;
      downloadLink.click();
    };
    img.src = 'data:image/svg+xml;base64,' + btoa(svgData);
  };

  return (
    <div className="flex flex-col items-center p-5 bg-white dark:bg-navy-950 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-card-soft text-center">
      <div className="relative p-3 bg-white rounded-xl border border-slate-200 shadow-inner">
        <QRCodeSVG
          id={`qr-svg-${donationId}`}
          value={traceabilityUrl}
          size={size}
          bgColor={"#FFFFFF"}
          fgColor={"#0B1220"}
          level={"H"}
          includeMargin={true}
        />
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20">
          <ShieldCheck className="w-10 h-10 text-cyan-600" />
        </div>
      </div>

      <div className="mt-3">
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-mono font-semibold bg-cyan-500/10 text-cyan-500 border border-cyan-500/20">
          <ShieldCheck className="w-3.5 h-3.5 text-cyan-500" />
          {donationId}
        </span>
        <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
          Scan to inspect immutable Polygon blockchain audit record
        </p>
      </div>

      {showDownloadBtn && (
        <div className="mt-4 flex items-center gap-2">
          <button
            onClick={downloadQR}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-navy-900 hover:bg-navy-800 text-white text-xs font-medium transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            Download QR
          </button>
          <a
            href={traceabilityUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-medium transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5 text-cyan-500" />
            Open Trace Link
          </a>
        </div>
      )}
    </div>
  );
};
