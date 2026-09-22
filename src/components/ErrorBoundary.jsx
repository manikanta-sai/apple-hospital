import { Component } from "react";

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Chat widget error boundary caught an error", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-clinical-900/40 p-4">
          <div className="w-full max-w-sm rounded-2xl border border-clinical-200 bg-white p-5 text-center shadow-xl">
            <p className="text-sm font-semibold text-ink-900">The chat assistant is unavailable.</p>
            <p className="mt-2 text-xs text-ink-600">
              Please refresh the page and try again.
            </p>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
