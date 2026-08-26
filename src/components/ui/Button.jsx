// The original primary/secondary/tertiary variants and the md default are
// unchanged so existing callers keep their behaviour (rule.md Rule 18). The
// `pill` and `pillOutline` variants add the reference's component language:
// full-radius controls in --color-pill and white-on-hairline (design.md 3).
export const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  disabled = false,
  ...props
}) => {
  const baseStyles =
    'inline-flex items-center justify-center font-medium rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';

  const variants = {
    primary:
      'bg-blue-600 text-white hover:bg-blue-700 focus-visible:ring-blue-500',
    secondary:
      'bg-slate-200 text-slate-900 hover:bg-slate-300 focus-visible:ring-slate-500',
    tertiary: 'text-slate-900 hover:bg-slate-100 focus-visible:ring-slate-500',
    pill: 'rounded-full bg-pill text-white shadow-pill hover:bg-ink focus-visible:ring-ink',
    pillOutline:
      'rounded-full bg-surface-raised text-ink border border-line shadow-pill hover:border-ink focus-visible:ring-ink',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
    pill: 'h-11 gap-2 px-6 text-base',
    pillLg: 'h-12 gap-2.5 px-7 text-lg',
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]}`}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
