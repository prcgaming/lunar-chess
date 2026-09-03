import React from 'react';
import { Button } from './Button';
import { AlertTriangle, RotateCcw } from 'lucide-react';

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Unhandled React Error:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
    if (this.props.onReset) {
      this.props.onReset();
    } else {
      window.location.reload();
    }
  };

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '60px 20px',
          textAlign: 'center',
          gap: '16px',
          color: 'var(--text-primary, #ffffff)',
          minHeight: '50vh'
        }}>
          <AlertTriangle size={48} color="#ef4444" />
          <h2 style={{ margin: 0, fontSize: '1.4rem' }}>Something went wrong</h2>
          <p style={{ margin: 0, color: 'var(--text-secondary, #a8a29e)', maxWidth: '400px', fontSize: '0.95rem' }}>
            We encountered an unexpected issue. Tap below to resume playing.
          </p>
          <Button variant="primary" size="md" icon={RotateCcw} onClick={this.handleReset}>
            Reload & Continue
          </Button>
        </div>
      );
    }
    return this.props.children;
  }
}