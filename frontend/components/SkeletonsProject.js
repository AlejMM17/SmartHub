const Skeleton = () => (
    <div className="w-4/5 border rounded border-slate-900 mx-auto p-3 animate-pulse">
        <div className="h-6 bg-slate-300 rounded mb-2"></div>
        <div className="h-4 bg-slate-300 rounded mb-2"></div>
        <div className="h-4 bg-slate-300 rounded mb-2"></div>
        <div className="h-4 bg-slate-300 rounded"></div>
    </div>
);

const SkeletonLoader = ({ count }) => (
    <div className="flex flex-col gap-3">
        {Array.from({ length: count }).map((_, i) => (
            <Skeleton key={i} />
        ))}
    </div>
);

export default SkeletonLoader;