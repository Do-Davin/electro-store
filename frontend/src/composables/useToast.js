import { h, render } from 'vue';
import ToastNotification from '@/components/ToastNotification.vue';

let toastId = 0;
const activeToasts = new Set();

export const useToast = () => {
  const updatePositions = () => {
    const toasts = Array.from(activeToasts);
    toasts.forEach((container, index) => {
      const offset = index * 112; // toast height + gap
      container.style.top = `${24 + offset}px`;
    });
  };

  const show = ({ type = 'info', title = '', message, duration = 3000 }) => {
    const id = ++toastId;

    // Create container for this specific toast
    const container = document.createElement('div');
    container.setAttribute('data-toast-id', String(id));
    container.style.position = 'fixed';
    container.style.right = '24px';
    container.style.zIndex = '999999';
    container.style.pointerEvents = 'none';
    container.style.transition = 'all 0.3s ease';
    
    document.body.appendChild(container);
    activeToasts.add(container);
    updatePositions();

    const close = () => {
      // Remove from active set
      activeToasts.delete(container);
      updatePositions();

      // Unmount and cleanup
      render(null, container);

      // Remove from DOM after transition
      setTimeout(() => {
        if (container && container.parentNode) {
          container.parentNode.removeChild(container);
        }
      }, 300);
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