import React from 'react';
import { Sparkles, TrendingUp, AlertTriangle, Lightbulb, CheckCircle, XCircle, AlertCircle } from 'lucide-react';

interface InsightsData {
    summary: string;
    keyInsights: string[];
    risks: string[];
    smartSuggestions: string[];
    dataQualityIssues?: string[];
}

interface AIInsightsDisplayProps {
    insights: InsightsData;
    loading?: boolean;
}

const AIInsightsDisplay: React.FC<AIInsightsDisplayProps> = ({ insights, loading }) => {
    if (loading) {
        return (
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
                <div className="flex items-center gap-3 mb-4">
                    <Sparkles className="text-purple-600 animate-pulse" size={24} />
                    <h2 className="text-xl font-semibold text-gray-900">AI Financial Insights</h2>
                </div>
                <div className="space-y-4">
                    <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4"></div>
                    <div className="h-4 bg-gray-200 rounded animate-pulse w-full"></div>
                    <div className="h-4 bg-gray-200 rounded animate-pulse w-5/6"></div>
                </div>
            </div>
        );
    }

    const hasRisks = insights.risks.length > 0 && insights.risks[0] !== 'No major risks detected';

    return (
        <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-xl shadow-lg p-6 border border-purple-200">
            {/* Header */}
            <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-purple-600 rounded-lg">
                    <Sparkles className="text-white" size={24} />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">AI Financial Insights</h2>
            </div>

            {/* Summary Section */}
            <div className="bg-white rounded-lg p-4 mb-6 border-l-4 border-blue-500">
                <div className="flex items-start gap-3">
                    <TrendingUp className="text-blue-600 mt-1 flex-shrink-0" size={20} />
                    <div>
                        <h3 className="font-semibold text-gray-900 mb-2">Summary</h3>
                        <p className="text-gray-700 leading-relaxed">{insights.summary}</p>
                    </div>
                </div>
            </div>

            {/* Key Insights Section */}
            {insights.keyInsights.length > 0 && (
                <div className="bg-white rounded-lg p-4 mb-6">
                    <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                        <CheckCircle className="text-green-600" size={20} />
                        Key Insights
                    </h3>
                    <ul className="space-y-2">
                        {insights.keyInsights.map((insight, index) => (
                            <li key={index} className="flex items-start gap-3">
                                <span className="text-green-600 mt-1 flex-shrink-0">•</span>
                                <span className="text-gray-700">{insight}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {/* Risks Section */}
            <div className={`rounded-lg p-4 mb-6 ${hasRisks ? 'bg-red-50 border border-red-200' : 'bg-green-50 border border-green-200'}`}>
                <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    {hasRisks ? (
                        <AlertTriangle className="text-red-600" size={20} />
                    ) : (
                        <CheckCircle className="text-green-600" size={20} />
                    )}
                    Risks
                </h3>
                <ul className="space-y-2">
                    {insights.risks.map((risk, index) => (
                        <li key={index} className="flex items-start gap-3">
                            {hasRisks ? (
                                risk.toLowerCase().includes('critical') ? (
                                    <XCircle className="text-red-600 mt-1 flex-shrink-0" size={18} />
                                ) : (
                                    <AlertCircle className="text-orange-600 mt-1 flex-shrink-0" size={18} />
                                )
                            ) : (
                                <CheckCircle className="text-green-600 mt-1 flex-shrink-0" size={18} />
                            )}
                            <span className={hasRisks ? 'text-red-900' : 'text-green-900'}>{risk}</span>
                        </li>
                    ))}
                </ul>
            </div>

            {/* Smart Suggestions Section */}
            {insights.smartSuggestions.length > 0 && (
                <div className="bg-white rounded-lg p-4 mb-6 border-l-4 border-purple-500">
                    <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                        <Lightbulb className="text-purple-600" size={20} />
                        Smart Suggestions
                    </h3>
                    <ol className="space-y-3">
                        {insights.smartSuggestions.map((suggestion, index) => (
                            <li key={index} className="flex items-start gap-3">
                                <span className="flex-shrink-0 w-6 h-6 bg-purple-100 text-purple-700 rounded-full flex items-center justify-center text-sm font-semibold">
                                    {index + 1}
                                </span>
                                <span className="text-gray-700 flex-1">{suggestion}</span>
                            </li>
                        ))}
                    </ol>
                </div>
            )}

            {/* Data Quality Issues (if any) */}
            {insights.dataQualityIssues && insights.dataQualityIssues.length > 0 && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                        <AlertTriangle className="text-yellow-600" size={20} />
                        Data Quality Issues
                    </h3>
                    <ul className="space-y-2">
                        {insights.dataQualityIssues.map((issue, index) => (
                            <li key={index} className="flex items-start gap-3">
                                <span className="text-yellow-600 mt-1 flex-shrink-0">⚠</span>
                                <span className="text-yellow-900 text-sm">{issue}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default AIInsightsDisplay;
