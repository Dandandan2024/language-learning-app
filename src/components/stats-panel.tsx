"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type ScheduleItem = { date: string; count: number; sample: Array<{ lexemeId: string; lemma: string; due: string }> };

type StatsResponse = {
  totals: { dueToday: number; due7days: number; totalReviews7d: number; retention7d: number; avgRating7d: number; streak: number };
  reviews: { byDay: Array<{ date: string; count: number; retention: number }> };
  schedule: ScheduleItem[];
};

export function StatsPanel() {
  const [data, setData] = useState<StatsResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch('/api/stats');
        if (!res.ok) throw new Error('Failed to load stats');
        const json = await res.json();
        setData(json as StatsResponse);
      } catch (e: any) {
        setError(e?.message || 'Failed to load stats');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading && !data) {
    return (
      <Card>
        <CardContent className="p-6">Loading…</CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Statistics</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="text-red-700">{error}</div>
        </CardContent>
      </Card>
    );
  }

  if (!data) return null;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Statistics</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div className="p-4 bg-white rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{data.totals.totalReviews7d}</div>
              <div className="text-sm text-gray-600">Reviews (7d)</div>
            </div>
            <div className="p-4 bg-white rounded-lg">
              <div className="text-2xl font-bold text-green-600">{data.totals.retention7d}%</div>
              <div className="text-sm text-gray-600">Retention (7d)</div>
            </div>
            <div className="p-4 bg-white rounded-lg">
              <div className="text-2xl font-bold text-purple-600">{data.totals.streak}</div>
              <div className="text-sm text-gray-600">Streak (days)</div>
            </div>
            <div className="p-4 bg-white rounded-lg">
              <div className="text-2xl font-bold text-orange-600">{data.totals.avgRating7d}</div>
              <div className="text-sm text-gray-600">Avg Rating (7d)</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Next 7 Days</CardTitle>
        </CardHeader>
        <CardContent className="p-6 space-y-3">
          <div className="text-sm text-gray-600">Total scheduled: {data.totals.due7days}</div>
          <div className="space-y-2">
            {data.schedule.map(day => (
              <div key={day.date} className="border rounded p-3 bg-white">
                <div className="flex justify-between items-center">
                  <div className="font-medium">{day.date}</div>
                  <div className="text-sm text-gray-600">{day.count} due</div>
                </div>
                {day.sample.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {day.sample.map(item => (
                      <span key={item.lexemeId + item.due} className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                        {item.lemma}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}