import { h, render } from 'vue';
import ToastNotification from '@/components/ToastNotification.vue';

let toastId = 0;

export const useToast = () => {
  const show = ({ type = 'info', title = '', message, duration = 3000 }) => {
    const id = ++toastId;

    // Create container for this specific toast
    const container = document.createElement('div');
    container.setAttribute('data-toast-id', String(id));
    document.body.appendChild(container);

    const close = () => {
      // Unmount and cleanup
      render(null, container);

      // Remove from DOM after transition
      setTimeout(() => {
        if (container && container.parentNode) {
          container.parentNode.removeChild(container);
        }
      }, 300); // Match transition duration
    };

    // Create VNode with proper props
    const vnode = h(ToastNotification, {
      type,
      title,
      message,
      duration,
      onClose: close,
    });

    // Render the component
    render(vnode, container);

    return { close };
  };

  const success = (message, title = 'Success') => {
    return show({ type: 'success', title, message });
  };

  const error = (message, title = 'Error') => {
    return show({ type: 'error', title, message });
  };

  const warning = (message, title = 'Warning') => {
    return show({ type: 'warning', title, message });
  };

  const info = (message, title = '') => {
    return show({ type: 'info', title, message });
  };

  return {
    show,
    success,
    error,
    warning,
    info,
  };
};
