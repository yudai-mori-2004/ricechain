// Create a new file: src/components/komepon/settings-form.tsx
'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

type SettingsFormProps = {
  discountAmount: number;
  maxRedemptions: number;
  budget: number;
  // Add other props you need
};

export function SettingsForm({ discountAmount, maxRedemptions, budget }: SettingsFormProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>設定変更</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Copy the form content from your original component */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="discount-amount" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              1件あたりの値引き額
            </label>
            <div className="flex items-center">
              <input
                type="range"
                id="discount-amount"
                min="100"
                max="1000"
                step="50"
                defaultValue={discountAmount}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
              />
              <span className="ml-4 min-w-[80px] text-gray-900 dark:text-white">
                {new Intl.NumberFormat('ja-JP', { style: 'currency', currency: 'JPY' }).format(discountAmount)}
              </span>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              値引き額が大きいほど、消費者の購入意欲は高まりますが、予算の消費も早くなります。
            </p>
          </div>

          {/* Copy the rest of your form here */}
        </div>

        {/* Copy the rest of your CardContent here */}
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={() => window.history.back()}>
          キャンセル
        </Button>
        <Button>
          設定を保存
        </Button>
      </CardFooter>
    </Card>
  );
}