import React from 'react';

// Компонент-обертка для подавления ошибок браузерных расширений
class BrowserExtensionGuard extends React.Component {
  constructor(props) {
    super(props);
    this.state = { error: null, errorInfo: null };
  }

  componentDidCatch(error, errorInfo) {
    // АГРЕССИВНО подавляем ВСЕ ошибки, связанные с браузерными расширениями
    const message = error.message ? error.message.toLowerCase() : '';
    const stack = error.stack ? error.stack.toLowerCase() : '';

    if (message.includes('cannot redefine property: ethereum') ||
        message.includes('invalid property descriptor') ||
        message.includes('cannot redefine property') ||
        message.includes('ethereum') ||
        message.includes('chrome-extension://') ||
        message.includes('moz-extension://') ||
        message.includes('safari-extension://') ||
        stack.includes('chrome-extension://') ||
        stack.includes('moz-extension://') ||
        stack.includes('safari-extension://')) {
      console.warn('Browser extension error suppressed in guard:', error.message);
      this.setState({ error: null, errorInfo: null });
      return;
    }

    // Для всех остальных ошибок - передаем выше
    this.setState({ error, errorInfo });
  }

  render() {
    if (this.state.error) {
      // Если это не ошибка расширения, но все равно произошла ошибка - рендерим fallback
      return <div className="alert alert-warning">
        Произошла ошибка. Попробуйте обновить страницу.
      </div>;
    }

    return this.props.children;
  }
}

export default BrowserExtensionGuard;
