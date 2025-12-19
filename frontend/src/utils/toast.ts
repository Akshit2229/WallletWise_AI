type ToastType = 'success' | 'error' | 'info';

interface ToastEvent {
    type: ToastType;
    message: string;
}

// Simple event emitter for toast notifications
const toastListeners: ((event: ToastEvent) => void)[] = [];

export const subscribeToToasts = (callback: (event: ToastEvent) => void) => {
    toastListeners.push(callback);
    return () => {
        const index = toastListeners.indexOf(callback);
        if (index > -1) {
            toastListeners.splice(index, 1);
        }
    };
};

const emitToast = (type: ToastType, message: string) => {
    toastListeners.forEach(listener => listener({ type, message }));
};

export const showSuccess = (message: string) => {
    emitToast('success', message);
};

export const showError = (message: string) => {
    emitToast('error', message);
};

export const showInfo = (message: string) => {
    emitToast('info', message);
};
