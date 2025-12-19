import { useEffect, useState } from 'react';
import { CheckCircle, XCircle, Info, X } from 'lucide-react';
import { subscribeToToasts } from '../utils/toast';

interface ToastProps {
    type: 'success' | 'error' | 'info';
    message: string;
    onClose: () => void;
}

const ToastItem = ({ type, message, onClose }: ToastProps) => {
    useEffect(() => {
        const timer = setTimeout(() => {
            onClose();
        }, 4000);

        return () => clearTimeout(timer);
    }, [onClose]);

    const config = {
        success: {
            icon: CheckCircle,
            bgColor: 'bg-green-50',
            borderColor: 'border-green-500',
            textColor: 'text-green-800',
            iconColor: 'text-green-500',
        },
        error: {
            icon: XCircle,
            bgColor: 'bg-red-50',
            borderColor: 'border-red-500',
            textColor: 'text-red-800',
            iconColor: 'text-red-500',
        },
        info: {
            icon: Info,
            bgColor: 'bg-blue-50',
            borderColor: 'border-blue-500',
            textColor: 'text-blue-800',
            iconColor: 'text-blue-500',
        },
    };

    const Icon = config[type].icon;

    return (
        <div
            className={`flex items-center gap-3 p-4 rounded-lg border-l-4 ${config[type].bgColor} ${config[type].borderColor} shadow-lg animate-slide-in`}
        >
            <Icon className={config[type].iconColor} size={20} />
            <p className={`flex-1 font-medium ${config[type].textColor}`}>{message}</p>
            <button
                onClick={onClose}
                className={`${config[type].textColor} hover:opacity-70 transition-opacity`}
            >
                <X size={18} />
            </button>
        </div>
    );
};

const Toast = () => {
    const [toasts, setToasts] = useState<Array<{ id: number; type: 'success' | 'error' | 'info'; message: string }>>([]);
    const [nextId, setNextId] = useState(0);

    useEffect(() => {
        const unsubscribe = subscribeToToasts((event) => {
            const id = nextId;
            setNextId(id + 1);
            setToasts((prev) => [...prev, { id, type: event.type, message: event.message }]);
        });

        return unsubscribe;
    }, [nextId]);

    const removeToast = (id: number) => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
    };

    return (
        <div className="fixed top-4 right-4 z-50 space-y-2 max-w-md">
            {toasts.map((toast) => (
                <ToastItem
                    key={toast.id}
                    type={toast.type}
                    message={toast.message}
                    onClose={() => removeToast(toast.id)}
                />
            ))}
        </div>
    );
};

export default Toast;
