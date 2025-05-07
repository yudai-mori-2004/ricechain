// ----------------------------------------------
// src/app/(farmer)/shipping/page.tsx
// ----------------------------------------------
'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { SERVICES } from '@/lib/shipping/services'
import type { ParcelInfo, LabelResponse } from '@/lib/shipping/types'
import { Button } from '@/components/ui/button'
import LabelPreview from './LabelPreview'

const parcelSchema = z.object({
    recipientName: z.string().min(1, '必須項目です'),
    recipientZip: z.string().min(1, '必須'),
    recipientAddress: z.string().min(1, '必須'),
    weightGram: z
        .string()
        .refine((v) => !isNaN(Number(v)) && Number(v) > 0, '正の数で入力'),
    serviceId: z.string().min(1, '必須')
})

type ParcelForm = z.infer<typeof parcelSchema>

export default function ShippingPage() {
    const [label, setLabel] = useState<LabelResponse | null>(null)
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting }
    } = useForm<ParcelForm>({
        resolver: zodResolver(parcelSchema),
        defaultValues: { serviceId: Object.keys(SERVICES)[0] }
    })

    const onSubmit = async (data: ParcelForm) => {
        const sender = {
            senderName: '田中農園', // TODO: replace with logged‑in farmer profile
            senderZip: '999-9999',
            senderAddress: '山形県米沢市田んぼ1‑1'
        }
        const weight = Number(data.weightGram)
        const parcel: ParcelInfo = {
            ...sender,
            recipientName: data.recipientName,
            recipientZip: data.recipientZip,
            recipientAddress: data.recipientAddress,
            weightGram: weight,
        }
        try {
            const res = await fetch('/api/shipping', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ serviceId: data.serviceId, parcel })
            })
            const body = await res.json()
            if (body.ok) {
                setLabel(body.label as LabelResponse)
            } else {
                alert(body.error ?? 'ラベル生成に失敗しました')
            }
        } catch (err) {
            console.error(err)
            alert('通信エラーが発生しました')
        }
    }

    if (label) {
        return <LabelPreview label={label} onBack={() => setLabel(null)} />
    }

    return (
        <div className="max-w-xl mx-auto p-4 space-y-6">
            <h1 className="text-2xl font-bold">送り状発行</h1>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-1 gap-2">
                    <label className="font-medium">宛名</label>
                    <input
                        {...register('recipientName')}
                        className="input input-bordered"
                        placeholder="山田 太郎"
                    />
                    {errors.recipientName && <p className="text-destructive text-sm">{errors.recipientName.message}</p>}
                </div>
                <div className="grid grid-cols-1 gap-2">
                    <label className="font-medium">郵便番号</label>
                    <input {...register('recipientZip')} className="input input-bordered" placeholder="123-4567" />
                    {errors.recipientZip && <p className="text-destructive text-sm">{errors.recipientZip.message}</p>}
                </div>
                <div className="grid grid-cols-1 gap-2">
                    <label className="font-medium">住所</label>
                    <textarea
                        {...register('recipientAddress')}
                        className="textarea textarea-bordered"
                        placeholder="東京都千代田区1‑1‑1"
                    />
                    {errors.recipientAddress && <p className="text-destructive text-sm">{errors.recipientAddress.message}</p>}
                </div>
                <div className="grid grid-cols-1 gap-2">
                    <label className="font-medium">重量 (g)</label>
                    <input {...register('weightGram')} className="input input-bordered" placeholder="5000" />
                    {errors.weightGram && <p className="text-destructive text-sm">{errors.weightGram.message as string}</p>}
                </div>
                <div className="grid grid-cols-1 gap-2">
                    <label className="font-medium">配送サービス</label>
                    <select {...register('serviceId')} className="select select-bordered">
                        {Object.values(SERVICES).map((s) => (
                            <option key={s.id} value={s.id}>
                                {s.displayName}
                            </option>
                        ))}
                    </select>
                </div>
                <Button type="submit" disabled={isSubmitting} className="w-full">
                    {isSubmitting ? '発行中...' : '送り状を発行'}
                </Button>
            </form>
        </div>
    )
}
