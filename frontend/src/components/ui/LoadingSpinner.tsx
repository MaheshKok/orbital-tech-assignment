/**
 * Loading spinner component.
 * Displays an animated spinner during data loading.
 */

interface LoadingSpinnerProps {
	size?: "sm" | "md" | "lg";
	message?: string;
}

const sizeClasses = {
	sm: "h-6 w-6",
	md: "h-10 w-10",
	lg: "h-16 w-16",
};

export function LoadingSpinner({
	size = "md",
	message = "Loading...",
}: LoadingSpinnerProps) {
	return (
		<div
			className="flex flex-col items-center justify-center py-12"
			role="status"
			aria-live="polite"
		>
			<div
				className={`${sizeClasses[size]} animate-spin rounded-full border-4 border-gray-200 border-t-blue-600`}
				aria-hidden="true"
			/>
			{message && <p className="mt-4 text-sm text-gray-600">{message}</p>}
			<span className="sr-only">{message}</span>
		</div>
	);
}
