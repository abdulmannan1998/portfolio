"use client";

import { Component, type ReactNode } from "react";

type GitHubActivityErrorProps = {
  children: ReactNode;
};

type GitHubActivityErrorState = {
  hasError: boolean;
};

export class GitHubActivityError extends Component<
  GitHubActivityErrorProps,
  GitHubActivityErrorState
> {
  constructor(props: GitHubActivityErrorProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("GitHub Activity Error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="relative bg-stone-900 p-6">
          {/* Corner accent */}
          <div className="absolute top-0 left-0 w-8 h-8 bg-orange-500" />

          <div className="relative text-center py-8">
            <p className="text-white/40 font-mono text-sm mb-4">
              Unable to load GitHub activity
            </p>
            <button
              onClick={() => this.setState({ hasError: false })}
              className="px-4 py-2 bg-orange-500/20 text-orange-500 font-mono text-xs uppercase tracking-wider hover:bg-orange-500/30 transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
