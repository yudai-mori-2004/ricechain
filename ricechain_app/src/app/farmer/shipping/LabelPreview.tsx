// ----------------------------------------------
// src/app/(farmer)/shipping/LabelPreview.tsx
// ----------------------------------------------
'use client'
import { Button } from '@/components/ui/button'
import { useRef } from 'react'
import type { LabelResponse } from '@/lib/shipping/types'

export default function LabelPreview({ label, onBack }: { label: LabelResponse; onBack: () => void }) {
    const iframeRef = useRef<HTMLIFrameElement>(null)

    const handlePrint = () => {
        const iframe = iframeRef.current
        if (iframe && iframe.contentWindow) {
            iframe.contentWindow.focus()
            iframe.contentWindow.print()
        }
    }

    return (
        <div className="flex flex-col gap-6">
            <div className="rounded-xl shadow-lg ring-1 ring-muted p-4 w-full max-w-4xl mx-auto bg-white">
                <iframe
                    ref={iframeRef}
                    title="label-preview"
                    className="w-full h-[600px] bg-white"
                    srcDoc={label.printableHtml}
                />
            </div>
            <div className="flex justify-center gap-4">
                <Button variant="secondary" onClick={onBack}>
                    戻る
                </Button>
                <Button onClick={handlePrint}>印刷</Button>
            </div>
        </div>
    )
}