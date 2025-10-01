// Simple toast notification utility
export const toast = {
  success: (message) => {
    showToast(message, 'success');
  },
  error: (message) => {
    showToast(message, 'error');
  },
  info: (message) => {
    showToast(message, 'info');
  },
  warning: (message) => {
    showToast(message, 'warning');
  }
};

function showToast(message, type) {
  // Remove existing toasts
  const existingToasts = document.querySelectorAll('.custom-toast');
  existingToasts.forEach(toast => toast.remove());

  // Create toast element
  const toastEl = document.createElement('div');
  toastEl.className = `custom-toast custom-toast-${type}`;
  toastEl.textContent = message;

  // Style the toast
  Object.assign(toastEl.style, {
    position: 'fixed',
    top: '20px',
    right: '20px',
    padding: '16px 24px',
    borderRadius: '8px',
    color: 'white',
    fontSize: '14px',
    fontWeight: '500',
    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
    zIndex: '10000',
    animation: 'slideIn 0.3s ease-out',
    minWidth: '250px',
    maxWidth: '400px'
  });

  // Set background color based on type
  const colors = {
    success: '#27ae60',
    error: '#e74c3c',
    info: '#3498db',
    warning: '#f39c12'
  };
  toastEl.style.background = colors[type] || colors.info;

  // Add animation keyframes if not already added
  if (!document.querySelector('#toast-animations')) {
    const style = document.createElement('style');
    style.id = 'toast-animations';
    style.textContent = `
      @keyframes slideIn {
        from {
          transform: translateX(400px);
          opacity: 0;
        }
        to {
          transform: translateX(0);
          opacity: 1;
        }
      }
      @keyframes slideOut {
        from {
          transform: translateX(0);
          opacity: 1;
        }
        to {
          transform: translateX(400px);
          opacity: 0;
        }
      }
    `;
    document.head.appendChild(style);
  }

  // Add to document
  document.body.appendChild(toastEl);

  // Auto remove after 3 seconds
  setTimeout(() => {
    toastEl.style.animation = 'slideOut 0.3s ease-out';
    setTimeout(() => {
      toastEl.remove();
    }, 300);
  }, 3000);
}
