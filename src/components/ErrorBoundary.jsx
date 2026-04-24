import React from "react"

class ErrorBoundary extends React.Component {

    constructor(props) {
        super(props)
        this.state = { hasError: false }
    }

    static getDerivedStateFromError() {
        return { hasError: true }
    }

    componentDidCatch(error, info) {
        console.error("Error caught:", error, info)
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="p-6 text-center">
                    <h2 className="text-red-400 text-lg font-semibold">
                        Something went wrong ⚠️
                    </h2>
                    <p className="text-slate-400 mt-2">
                        Try refreshing or resetting inputs.
                    </p>
                </div>
            )
        }

        return this.props.children
    }
}

export default ErrorBoundary