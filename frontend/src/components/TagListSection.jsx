const TagListSection = ({ title, items = [] }) => {
  if (!items.length) return null;

  return (
    <div className="p-4 bg-white border shadow-sm rounded-xl border-slate-200">
      <h3 className="mb-4 font-semibold text-md text-slate-800">
        {title}
      </h3>

      <div className="flex flex-wrap gap-3">
        {items.map((item, index) => (
          <span
            key={index}
            className="px-4 py-2 text-sm font-medium rounded-full bg-slate-200 text-slate-700"
          >
            {item}
          </span>
        ))}
      </div>
    </div>
  );
};

export default TagListSection;
