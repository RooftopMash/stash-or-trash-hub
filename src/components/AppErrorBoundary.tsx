import { Component, type ErrorInfo, type ReactNode } from "react";
import { reportApplicationError } from "@/lib/error-reporting";

interface AppErrorBoundaryProps {
  children: ReactNode;
  fallbackTitle?: string;
  fallbackMessage?: string;
}

interface AppErrorBoundaryState {
  hasError: boolean;
}

/**
 * Global React Error Boundary that catches render and lifecycle errors
 * and renders a clean, generic fallback UI without leaking raw stack traces
 * or internal component names.
 */
export class AppErrorBoundary extends Component<
  AppErrorBoundaryProps,
  AppErrorBoundaryState
> {
  constructor(props: AppErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): AppErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, _errorInfo: ErrorInfo): void {
    reportApplicationError(error, { boundary: "app_error_boundary" });
  }

  private handleReset = () => {
    this.setState({ hasError: false });
    if (typeof window !== "undefined") {
      window.location.reload();
    }
  };

  render() {
    if (this.state.hasError) {
      return (
        <div
          role="alert"
          className="flex min-h-screen items-center justify-center bg-background px-4 py-12"
        >
          <div className="w-full max-w-md rounded-2xl border border-border bg-card p-8 text-center shadow-sm">
            <h1 className="font-display text-xl font-bold tracking-tight text-foreground">
              {this.props.fallbackTitle ?? "Something went wrong, please refresh"}
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              {this.props.fallbackMessage ??
                "We encountered a temporary issue loading this view. Please refresh the page or return to the home screen."}
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <button
                type="button"
                onClick={this.handleReset}
                className="inline-flex items-center justify-center rounded-xl bg-foreground px-4 py-2.5 text-xs font-bold text-background transition hover:opacity-90"
              >
                Refresh page
              </button>
              <a
                href="/"
                className="inline-flex items-center justify-center rounded-xl border border-border bg-background px-4 py-2.5 text-xs font-bold text-foreground transition hover:bg-secondary"
              >
                Go home
              </a>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
