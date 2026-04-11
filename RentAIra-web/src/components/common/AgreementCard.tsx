import React, { useState } from 'react';
import { Agreement } from '../../types';
import { getFunctions, httpsCallable } from 'firebase/functions';
import { app } from '../../lib/firebase';
import { useLocale } from '../../context/LocaleContext';

interface AgreementCardProps {
  agreement: Agreement;
  role: 'tenant' | 'landlord';
  onGenerateSuccess?: () => void;
}

const statusStyles: Record<string, string> = {
  active:    'bg-green-100 text-green-800',
  draft:     'bg-yellow-100 text-yellow-800',
  expired:   'bg-gray-100 text-gray-600',
  cancelled: 'bg-red-100 text-red-700',
};

const fmt = (d: any): string => {
  if (!d) return '—';
  const date = d?.seconds ? new Date(d.seconds * 1000) : new Date(d);
  return isNaN(date.getTime()) ? '—' : date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
};

const AgreementCard: React.FC<AgreementCardProps> = ({ agreement, role, onGenerateSuccess }) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const { formatCurrency } = useLocale();

  const handleGeneratePdf = async () => {
    try {
      setIsGenerating(true);
      const functions = getFunctions(app);
      const generatePdf = httpsCallable(functions, 'generateAgreementPdfFn');
      await generatePdf({ agreementId: agreement.id });
      if (onGenerateSuccess) onGenerateSuccess();
    } catch (err) {
      console.error(err);
      alert('Error generating PDF.');
    } finally {
      setIsGenerating(false);
    }
  };

  // Ensure platform fee is always shown (compute from rent if somehow missing)
  const platformFeeAmt = agreement.platformFeeAmount ?? Math.round((agreement.monthlyRent ?? 0) * 0.01);

  return (
    <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-200">
      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <div>
          <h4 className="text-base font-bold text-gray-900">Agreement #{agreement.id?.slice(-6)}</h4>
          <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold mt-1 ${statusStyles[agreement.status] ?? statusStyles.draft}`}>
            {agreement.status?.toUpperCase()}
          </span>
        </div>
        <div className="text-right">
          <p className="text-xl font-bold text-[#FF4D5A]">
            {formatCurrency(agreement.monthlyRent ?? 0)}
            <span className="text-sm font-normal text-gray-500">/mo</span>
          </p>
          <p className="text-xs text-gray-500">Deposit: {formatCurrency(agreement.deposit ?? 0)}</p>
          {/* Platform fee — always shown */}
          <p className="text-xs font-semibold text-purple-700 mt-0.5">
            Platform Fee (1%): {formatCurrency(platformFeeAmt)}
          </p>
        </div>
      </div>

      {/* Dates row */}
      <div className="flex gap-4 text-xs text-gray-500 mb-3">
        <span>📅 Start: <strong className="text-gray-700">{fmt(agreement.startDate)}</strong></span>
        <span>📅 End: <strong className="text-gray-700">{fmt(agreement.endDate)}</strong></span>
      </div>

      {/* Terms */}
      {agreement.termsSummary && (
        <div className="bg-gray-50 p-3 rounded-md text-sm text-gray-700 mb-4 whitespace-pre-wrap">
          {agreement.termsSummary}
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-4 items-center">
        {agreement.pdfUrl ? (
          <a
            href={agreement.pdfUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#FF4D5A] font-semibold hover:underline text-sm"
          >
            📄 View / Download PDF
          </a>
        ) : (
          <p className="text-sm text-gray-400 italic">No PDF attached yet.</p>
        )}

        {role === 'landlord' && agreement.status === 'draft' && !agreement.pdfUrl && (
          <button
            onClick={handleGeneratePdf}
            disabled={isGenerating}
            className="ml-auto bg-gray-900 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-700 disabled:opacity-50 transition-colors"
          >
            {isGenerating ? 'Generating…' : 'Generate PDF'}
          </button>
        )}
      </div>
    </div>
  );
};

export default AgreementCard;
