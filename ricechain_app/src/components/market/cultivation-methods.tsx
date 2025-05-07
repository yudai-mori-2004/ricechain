'use client';

interface CultivationMethodsProps {
    methods: string[];
    className?: string;
}

const methodInfo = {
    organic: {
        title: '有機栽培',
        description: '化学肥料や農薬を使わず、自然の力を活かした栽培方法です。',
        iconBg: 'bg-green-100 dark:bg-green-900/30',
        iconColor: 'text-green-600 dark:text-green-400',
        icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
        ),
    },
    reduced_pesticide: {
        title: '減農薬栽培',
        description: '農薬の使用量を一般的な栽培方法より削減して安全性を高めています。',
        iconBg: 'bg-blue-100 dark:bg-blue-900/30',
        iconColor: 'text-blue-600 dark:text-blue-400',
        icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
        ),
    },
    conventional: {
        title: '慣行栽培',
        description: '一般的な栽培方法で、効率的かつ安定した生産を実現しています。',
        iconBg: 'bg-gray-100 dark:bg-gray-800',
        iconColor: 'text-gray-600 dark:text-gray-400',
        icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
        ),
    },
};

export function CultivationMethods({ methods, className = '' }: CultivationMethodsProps) {
    if (!methods || methods.length === 0) {
        return null;
    }

    return (
        <div className={`space-y-3 ${className}`}>
            {methods.map((method) => {
                const info = methodInfo[method as keyof typeof methodInfo];
                if (!info) return null;

                return (
                    <div key={method} className="flex items-start">
                        <div className={`${info.iconBg} p-2 rounded-full mr-3`}>
                            <div className={info.iconColor}>{info.icon}</div>
                        </div>
                        <div>
                            <h3 className="font-medium">{info.title}</h3>
                            <p className="text-sm text-text/70 dark:text-background/70">
                                {info.description}
                            </p>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
