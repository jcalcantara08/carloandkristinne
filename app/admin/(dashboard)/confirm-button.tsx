"use client";

/**
 * A submit button that asks first. Used only for "Delete for good" and
 * "Empty the recycle bin", the two irreversible actions on the dashboard.
 * A plain browser confirm is the right size of tool for two users and one
 * shared password.
 */
export function ConfirmButton({
  message,
  className,
  children,
}: {
  message: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="submit"
      className={className}
      onClick={(event) => {
        if (!window.confirm(message)) event.preventDefault();
      }}
    >
      {children}
    </button>
  );
}
