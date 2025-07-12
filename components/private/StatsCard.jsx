"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { LucideIcon, TrendingUp, TrendingDown } from "lucide-react";

const colorVariants = {
  blue: {
    bg: "from-blue-500 to-blue-600",
    light: "bg-blue-50",
    text: "text-blue-600",
  },
  green: {
    bg: "from-green-500 to-green-600",
    light: "bg-green-50",
    text: "text-green-600",
  },
  purple: {
    bg: "from-purple-500 to-purple-600",
    light: "bg-purple-50",
    text: "text-purple-600",
  },
  orange: {
    bg: "from-orange-500 to-orange-600",
    light: "bg-orange-50",
    text: "text-orange-600",
  },
};

const StatsCard = ({ title, value, icon: Icon, trend, color }) => {
  const colors = colorVariants[color];

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 border-0 shadow-sm">
      <CardContent className="p-0">
        <div className="p-6">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <p className="text-sm font-medium text-slate-600">{title}</p>
              <p className="text-3xl font-bold text-slate-900">{value}</p>
              {trend !== undefined && (
                <div className="flex items-center space-x-1">
                  {trend > 0 ? (
                    <TrendingUp className="w-4 h-4 text-green-500" />
                  ) : trend < 0 ? (
                    <TrendingDown className="w-4 h-4 text-red-500" />
                  ) : null}
                  <span
                    className={`text-sm font-medium ${
                      trend > 0
                        ? "text-green-500"
                        : trend < 0
                        ? "text-red-500"
                        : "text-slate-500"
                    }`}
                  >
                    {trend > 0 ? "+" : ""}
                    {trend}%
                  </span>
                </div>
              )}
            </div>
            <div className={`p-3 rounded-xl ${colors.light}`}>
              <Icon className={`w-8 h-8 ${colors.text}`} />
            </div>
          </div>
        </div>
        <div className={`h-1 bg-gradient-to-r ${colors.bg}`}></div>
      </CardContent>
    </Card>
  );
};

export default StatsCard;
