"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TARGET_LANGUAGE_OPTIONS, NATIVE_LANGUAGE_OPTIONS, LANGUAGE_LABELS } from "@/lib/languages";
import Link from "next/link";

type Settings = {
  dailyGoal: number;
  hideTranslation: boolean;
  enableTTS: boolean;
  language: string;
  nativeLanguage: string;
};

export default function SettingsPage() {
  const [settings, setSettings] = useState<Settings | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [saved, setSaved] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch('/api/settings');
        if (!res.ok) throw new Error('Failed to load settings');
        const data = await res.json();
        setSettings(data.settings as Settings);
      } catch (e: any) {
        setError(e?.message || 'Failed to load settings');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const update = async () => {
    if (!settings) return;
    setLoading(true);
    setSaved(false);
    setError(null);
    try {
      const res = await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      });
      if (!res.ok) throw new Error('Failed to save settings');
      const data = await res.json();
      setSettings(data.settings as Settings);
      setSaved(true);
    } catch (e: any) {
      setError(e?.message || 'Failed to save settings');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader className="text-center">
          <CardTitle>Settings</CardTitle>
          <div className="mt-2">
            <Button variant="outline" asChild>
              <Link href="/">Home</Link>
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {error && (
            <div className="p-3 bg-red-50 text-red-700 rounded">{error}</div>
          )}
          {!settings ? (
            <div className="text-center">
              {loading ? 'Loading…' : 'No settings loaded'}
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-600 mb-1">Daily Goal</label>
                <input
                  type="number"
                  min={5}
                  max={200}
                  value={settings.dailyGoal}
                  onChange={(e) => setSettings({ ...settings, dailyGoal: parseInt(e.target.value || '0') })}
                  className="w-full border rounded px-3 py-2"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Target Language</label>
                  <select
                    value={settings.language}
                    onChange={(e) => setSettings({ ...settings, language: e.target.value })}
                    className="w-full border rounded px-3 py-2 bg-white"
                  >
                    {TARGET_LANGUAGE_OPTIONS.map(opt => (
                      <option key={opt.code} value={opt.code}>{opt.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Native Language</label>
                  <select
                    value={settings.nativeLanguage}
                    onChange={(e) => setSettings({ ...settings, nativeLanguage: e.target.value })}
                    className="w-full border rounded px-3 py-2 bg-white"
                  >
                    {NATIVE_LANGUAGE_OPTIONS.map(opt => (
                      <option key={opt.code} value={opt.code}>{opt.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <input
                  id="hide-translation"
                  type="checkbox"
                  checked={settings.hideTranslation}
                  onChange={(e) => setSettings({ ...settings, hideTranslation: e.target.checked })}
                />
                <label htmlFor="hide-translation" className="text-sm text-gray-700">Hide translation by default</label>
              </div>

              <div className="flex items-center gap-2">
                <input
                  id="enable-tts"
                  type="checkbox"
                  checked={settings.enableTTS}
                  onChange={(e) => setSettings({ ...settings, enableTTS: e.target.checked })}
                />
                <label htmlFor="enable-tts" className="text-sm text-gray-700">Enable TTS (if available)</label>
              </div>

              <div className="pt-2">
                <Button onClick={update} disabled={loading}>
                  {loading ? 'Saving…' : 'Save Settings'}
                </Button>
                {saved && (
                  <span className="ml-3 text-sm text-green-700">Saved!</span>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}