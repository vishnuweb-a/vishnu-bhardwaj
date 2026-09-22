export const Card = ({ children, className = '' }) => {
  return (
    <div
      className={`rounded-lg border border-line bg-surface-raised p-6 shadow-sm hover:shadow-md transition-shadow ${className}`}
    >
      {children}
    </div>
  );
};

export default Card;
