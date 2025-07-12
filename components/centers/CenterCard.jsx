"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Phone, FileText, Star, Eye } from "lucide-react";


const CenterCard = ({ center }) => {
  const totalForms = center.feedback_forms.length;
  const avgRating =
    center.feedback_forms.reduce((acc, form) => acc + form.average_rating, 0) /
      totalForms || 0;

  return (
    <Card className="group hover:shadow-lg transition-all duration-300 border-0 shadow-sm">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <CardTitle className="text-lg">{center.name}</CardTitle>
            <p className="text-sm text-slate-600">{center.description}</p>
          </div>
          <div className="flex items-center gap-1 bg-yellow-50 px-2 py-1 rounded-lg">
            <Star className="w-4 h-4 text-yellow-500 fill-current" />
            <span className="text-sm font-medium text-yellow-700">
              {avgRating.toFixed(1)}
            </span>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm text-slate-600">
            <MapPin className="w-4 h-4" />
            <span>{center.location}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-slate-600">
            <Phone className="w-4 h-4" />
            <span>+254{center.contact}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-slate-600">
            <FileText className="w-4 h-4" />
            <span>{totalForms} Feedback Forms</span>
          </div>
        </div>

        <div className="flex items-center justify-between pt-2 border-t">
          <Badge
            variant="outline"
            className="bg-blue-50 text-blue-700 border-blue-200"
          >
            Active
          </Badge>
          <Button
            size="sm"
            variant="outline"
            className="group-hover:bg-blue-50 group-hover:border-blue-200"
          >
            <Eye className="w-4 h-4 mr-2" />
            Manage
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default CenterCard;
