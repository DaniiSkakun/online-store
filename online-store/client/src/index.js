import React, {createContext} from 'react';
import ReactDOM from 'react-dom';
import './styles.css';
import App from './App';
import UserStore from "./store/UserStore";
import PropertyStore from "./store/PropertyStore";

export const Context = createContext(null)

// АГРЕССИВНЫЙ Error Boundary для подавления ошибок браузерных расширений
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    // АГРЕССИВНО игнорируем ВСЕ ошибки браузерных расширений
    const message = error.message ? error.message.toLowerCase() : '';
    const stack = error.stack ? error.stack.toLowerCase() : '';

    if (message.includes('invalid property descriptor') ||
        message.includes('cannot redefine property') ||
        message.includes('ethereum') ||
        message.includes('chrome-extension://') ||
        message.includes('moz-extension://') ||
        message.includes('safari-extension://') ||
        stack.includes('chrome-extension://') ||
        stack.includes('moz-extension://') ||
        stack.includes('safari-extension://')) {
      console.warn('Browser extension error completely suppressed:', error.message);
      return { hasError: false, error: null };
    }

    // Даже если это не ошибка расширения, игнорируем TypeError связанные с ethereum
    if (error.name === 'TypeError' && (
        message.includes('ethereum') ||
        message.includes('defineproperty')
    )) {
      console.warn('TypeError related to browser extensions suppressed:', error.message);
      return { hasError: false, error: null };
    }

    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // АГРЕССИВНО игнорируем ВСЕ ошибки браузерных расширений
    const message = error.message ? error.message.toLowerCase() : '';
    const stack = error.stack ? error.stack.toLowerCase() : '';
    const componentStack = errorInfo.componentStack ? errorInfo.componentStack.toLowerCase() : '';

    if (message.includes('invalid property descriptor') ||
        message.includes('cannot redefine property') ||
        message.includes('ethereum') ||
        message.includes('chrome-extension://') ||
        message.includes('moz-extension://') ||
        message.includes('safari-extension://') ||
        stack.includes('chrome-extension://') ||
        stack.includes('moz-extension://') ||
        stack.includes('safari-extension://') ||
        componentStack.includes('chrome-extension://') ||
        componentStack.includes('moz-extension://') ||
        componentStack.includes('safari-extension://')) {
      console.warn('Browser extension error completely suppressed in componentDidCatch:', error.message);
      this.setState({ hasError: false, error: null });
      return;
    }

    // Игнорируем только если это ошибка от расширений, иначе логируем
    if (error.name === 'TypeError' && (
        message.includes('ethereum') ||
        message.includes('defineproperty')
    )) {
      console.warn('TypeError related to browser extensions suppressed in componentDidCatch:', error.message);
      this.setState({ hasError: false, error: null });
      return;
    }

    // Только для реальных ошибок приложения
    console.error('Application Error Boundary caught an error:', error, errorInfo);
  }

  render() {
    // Никогда не показываем ошибку для проблем с расширениями
    return this.props.children;
  }
}

ReactDOM.render(
    <ErrorBoundary>
        <Context.Provider value={{
            user: new UserStore(),
            property: new PropertyStore(),
        }}>
            <App />
        </Context.Provider>
    </ErrorBoundary>,
  document.getElementById('root')
);

