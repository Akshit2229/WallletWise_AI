import React, { useState, useRef } from 'react';
import { X, Upload, FileText, AlertCircle, CheckCircle } from 'lucide-react';
import AIInsightsDisplay from './AIInsightsDisplay';
import { showSuccess } from '../utils/toast';

interface CSVUploadModalProps {
    isOpen: boolean;
    onClose: () => void;
    onUploadComplete?: () => void; // Callback to refresh dashboard
}

interface AnalysisResponse {
    summary: string;
    keyInsights: string[];
    risks: string[];
    smartSuggestions: string[];
    dataQualityIssues?: string[];
    csvInfo?: {
        totalRows: number;
        validTransactions: number;
        rowsWithErrors: number;
    };
}

const CSVUploadModal: React.FC<CSVUploadModalProps> = ({ isOpen, onClose, onUploadComplete }) => {
    const [file, setFile] = useState<File | null>(null);
    const [uploading, setUploading] = useState(false);
    const [analyzing, setAnalyzing] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [analysis, setAnalysis] = useState<AnalysisResponse | null>(null);
    const [dragActive, setDragActive] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    if (!isOpen) return null;

    const handleDrag = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === 'dragenter' || e.type === 'dragover') {
            setDragActive(true);
        } else if (e.type === 'dragleave') {
            setDragActive(false);
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);

        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFileSelect(e.dataTransfer.files[0]);
        }
    };

    const handleFileSelect = (selectedFile: File) => {
        setError(null);
        setAnalysis(null);

        // Validate file type
        if (!selectedFile.name.endsWith('.csv')) {
            setError('Please select a CSV file');
            return;
        }

        // Validate file size (5MB limit)
        if (selectedFile.size > 5 * 1024 * 1024) {
            setError('File size must be less than 5MB');
            return;
        }

        setFile(selectedFile);
    };

    const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            handleFileSelect(e.target.files[0]);
        }
    };

    const handleUpload = async () => {
        if (!file) return;

        setUploading(true);
        setAnalyzing(true);
        setError(null);

        try {
            const formData = new FormData();
            formData.append('file', file);

            const response = await fetch('http://localhost:5001/api/ai/analyze-csv', {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to analyze CSV');
            }

            const data: AnalysisResponse = await response.json();
            setAnalysis(data);

            // Show success message
            showSuccess(`Successfully uploaded ${data.csvInfo?.validTransactions || 0} transactions!`);

            // Call the callback to refresh dashboard
            if (onUploadComplete) {
                onUploadComplete();
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to analyze CSV file');
        } finally {
            setUploading(false);
            setAnalyzing(false);
        }
    };

    const resetModal = () => {
        setFile(null);
        setAnalysis(null);
        setError(null);
        setUploading(false);
        setAnalyzing(false);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const handleClose = () => {
        resetModal();
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between rounded-t-2xl">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-purple-100 rounded-lg">
                            <FileText className="text-purple-600" size={24} />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900">Upload CSV for Analysis</h2>
                            <p className="text-sm text-gray-600">Get AI-powered insights from your transaction data</p>
                        </div>
                    </div>
                    <button
                        onClick={handleClose}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        <X size={24} className="text-gray-600" />
                    </button>
                </div>

                <div className="p-6 space-y-6">
                    {/* File Upload Section */}
                    {!analysis && (
                        <>
                            <div
                                className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors ${dragActive
                                    ? 'border-purple-500 bg-purple-50'
                                    : 'border-gray-300 hover:border-purple-400'
                                    }`}
                                onDragEnter={handleDrag}
                                onDragLeave={handleDrag}
                                onDragOver={handleDrag}
                                onDrop={handleDrop}
                            >
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept=".csv"
                                    onChange={handleFileInputChange}
                                    className="hidden"
                                />

                                {!file ? (
                                    <div className="space-y-4">
                                        <div className="flex justify-center">
                                            <div className="p-4 bg-purple-100 rounded-full">
                                                <Upload className="text-purple-600" size={32} />
                                            </div>
                                        </div>
                                        <div>
                                            <p className="text-lg font-semibold text-gray-700 mb-2">
                                                Drop your CSV file here or click to browse
                                            </p>
                                            <p className="text-sm text-gray-500">
                                                Maximum file size: 5MB
                                            </p>
                                        </div>
                                        <button
                                            onClick={() => fileInputRef.current?.click()}
                                            className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium"
                                        >
                                            Choose File
                                        </button>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        <div className="flex justify-center">
                                            <CheckCircle className="text-green-600" size={48} />
                                        </div>
                                        <div>
                                            <p className="text-lg font-semibold text-gray-700">{file.name}</p>
                                            <p className="text-sm text-gray-500">
                                                {(file.size / 1024).toFixed(2)} KB
                                            </p>
                                        </div>
                                        <div className="flex gap-3 justify-center">
                                            <button
                                                onClick={() => {
                                                    setFile(null);
                                                    if (fileInputRef.current) {
                                                        fileInputRef.current.value = '';
                                                    }
                                                }}
                                                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                                            >
                                                Remove
                                            </button>
                                            <button
                                                onClick={handleUpload}
                                                disabled={uploading}
                                                className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                {uploading ? 'Analyzing...' : 'Analyze CSV'}
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Info Box */}
                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                <h3 className="font-semibold text-blue-900 mb-2">CSV Format Information</h3>
                                <ul className="text-sm text-blue-800 space-y-1">
                                    <li>• The AI will automatically detect column names (Date, Category, Amount, etc.)</li>
                                    <li>• CSV can have varying column formats - the system uses intelligent mapping</li>
                                    <li>• Any data quality issues will be reported in the analysis</li>
                                </ul>
                            </div>
                        </>
                    )}

                    {/* Error Message */}
                    {error && (
                        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
                            <AlertCircle className="text-red-600 flex-shrink-0 mt-0.5" size={20} />
                            <div>
                                <h4 className="font-semibold text-red-900">Error</h4>
                                <p className="text-sm text-red-800">{error}</p>
                            </div>
                        </div>
                    )}

                    {/* Loading State */}
                    {analyzing && (
                        <div className="text-center py-8">
                            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-purple-200 border-t-purple-600 mb-4"></div>
                            <p className="text-lg font-semibold text-gray-700">Analyzing your transactions...</p>
                            <p className="text-sm text-gray-500 mt-2">This may take a few seconds</p>
                        </div>
                    )}

                    {/* Analysis Results */}
                    {analysis && !analyzing && (
                        <div className="space-y-4">
                            {/* CSV Info */}
                            {analysis.csvInfo && (
                                <div className="bg-gray-50 rounded-lg p-4 grid grid-cols-3 gap-4 text-center">
                                    <div>
                                        <p className="text-2xl font-bold text-purple-600">{analysis.csvInfo.totalRows}</p>
                                        <p className="text-sm text-gray-600">Total Rows</p>
                                    </div>
                                    <div>
                                        <p className="text-2xl font-bold text-green-600">{analysis.csvInfo.validTransactions}</p>
                                        <p className="text-sm text-gray-600">Valid Transactions</p>
                                    </div>
                                    <div>
                                        <p className="text-2xl font-bold text-red-600">{analysis.csvInfo.rowsWithErrors}</p>
                                        <p className="text-sm text-gray-600">Errors</p>
                                    </div>
                                </div>
                            )}

                            {/* Insights Display */}
                            <AIInsightsDisplay insights={analysis} />

                            {/* Action Buttons */}
                            <div className="flex gap-3 justify-end">
                                <button
                                    onClick={resetModal}
                                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                                >
                                    Analyze Another File
                                </button>
                                <button
                                    onClick={handleClose}
                                    className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium"
                                >
                                    Done
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CSVUploadModal;
