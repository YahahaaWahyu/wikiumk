interface FieldErrorProps {
  message?: string;
}

export default function FieldError({ message }: FieldErrorProps) {
  if (!message) return null;
  return (
    <p className="mt-1 text-[12px] leading-[15px] text-red-600" role="alert">
      {message}
    </p>
  );
}

