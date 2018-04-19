import React, {Component} from 'react';

class ErrorBoundary extends Component {
    constructor(props) {
        super(props);
        this.state = {hasError: false };
    }

    componentDidCatch(error, info) {
        this.setState({hasError: true });
        console.log('Error ',error, "/n Info",info)
    }

    render() {
        if (this.state.hasError) {
            window.location = '/dashboard'
            return <h1>Oops!!! Something went wrong</h1>;
        } else {
            return this.props.children;
        }
    }
}

export default ErrorBoundary