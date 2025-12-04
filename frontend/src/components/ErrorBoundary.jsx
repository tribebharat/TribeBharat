import React from 'react';
import { Link } from 'react-router-dom';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        console.error("Uncaught error:", error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
                    <div className="text-center max-w-md">
                        <h1 className="text-4xl font-serif font-bold text-primary mb-4">Oops!</h1>
                        <p className="text-xl text-gray-600 mb-8">Something went wrong.</p>
                        <p className="text-sm text-gray-500 mb-8 bg-gray-100 p-4 rounded overflow-auto">
                            {this.state.error?.toString()}
                        </p>
                        <button
                            onClick={() => window.location.reload()}
                            className="btn-primary inline-block"
                        >
                            Reload Page
                        </button>
                        <div className="mt-4">
                            <Link to="/" className="text-accent hover:underline">Go Home</Link>
                        </div>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
