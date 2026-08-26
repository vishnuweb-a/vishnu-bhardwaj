export const Card = ({ children, className = '' }) => {
  return (
    <div
      className={`rounded-lg border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md transition-shadow ${className}`}
    >
      {children}
    </div>
  );
};

export default Card;
