import ReactMarkdown  from 'react-markdown';
const ListAnalysisSection = ({ title, items = [] }) => {
    if (!items.length) return null;

    return (
        <div className="p-4 bg-white border shadow-sm rounded-xl border-slate-200">
            <h3 className="mb-4 font-semibold text-md text-slate-800">
                <ReactMarkdown>{title}</ReactMarkdown>
            </h3>

            <div className="space-y-2 text-sm list-disc list-inside text-slate-700">
                {items.map((item, index) => (
                    <div key={index}>
                        <ReactMarkdown>{item}</ReactMarkdown>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ListAnalysisSection;
