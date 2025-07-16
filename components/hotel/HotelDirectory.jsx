"use client";

import React, { useState } from "react";
import {
  hotelDirectory,
} from "@/data/hotelDirectory";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

const ServiceCard = ({ item, category }) => {
  const IconComponent = item.icon;

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Card className="group cursor-pointer transition-all duration-300 hover:shadow-xl hover:-translate-y-2 bg-gradient-to-br from-white to-gray-50 border-0 shadow-lg">
          <div className="relative overflow-hidden rounded-t-lg">
            <img
              src={item.image}
              alt={item.name}
              className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div
              className={cn(
                "absolute top-4 right-4 p-2 rounded-full text-white shadow-lg",
                category.color
              )}
            >
              <IconComponent className="w-4 h-4" />
            </div>
          </div>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg group-hover:text-primary transition-colors">
              {item.name}
            </CardTitle>
            <CardDescription className="text-sm text-muted-foreground">
              {item.subtitle}
            </CardDescription>
          </CardHeader>
        </Card>
      </DialogTrigger>
      <DialogContent className="max-w-2xl bg-white">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-4">
            <div className={cn("p-3 rounded-full text-white", category.color)}>
              <IconComponent className="w-6 h-6" />
            </div>
            <div>
              <DialogTitle className="text-2xl">{item.name}</DialogTitle>
              <DialogDescription className="text-lg">
                {item.subtitle}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>
        <div className="space-y-4">
          <img
            src={item.image}
            alt={item.name}
            className="w-full h-64 object-cover rounded-lg"
          />
          <p className="text-gray-700 leading-relaxed">{item.description}</p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

const HotelDirectory = () => {
  const [activeCategory, setActiveCategory] = useState(100);

  const activeData = hotelDirectory.find((cat) => cat.id === activeCategory);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      {/* Hero Section */}
      <div className="relative h-[60vh] bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600 overflow-hidden">
        <div className="absolute inset-0 bg-black/30" />
        <div
          className="absolute inset-0 bg-cover bg-center opacity-20"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1500375592092-40eb2168fd21?w=1200&h=800&fit=crop')",
          }}
        />
        <div className="relative z-10 container mx-auto px-4 h-full flex items-center justify-center text-center">
          <div className="max-w-4xl text-white">
            <h1 className="text-6xl font-bold mb-6 bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
              The Tamarind Hotel
            </h1>
            <p className="text-xl mb-8 text-blue-100 leading-relaxed">
              Experience Kenya's finest hospitality with our comprehensive range
              of services. From luxurious accommodations to world-class dining,
              every moment is crafted to perfection.
            </p>
            <Badge
              variant="secondary"
              className="text-lg px-6 py-2 bg-white/20 backdrop-blur-sm border-white/30"
            >
              Premium Hotel Directory
            </Badge>
          </div>
        </div>
        {/* Decorative elements */}
        <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-br from-white/10 to-transparent rounded-full blur-3xl" />
        <div className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-gradient-to-tl from-cyan-300/10 to-transparent rounded-full blur-3xl" />
      </div>

      {/* Directory Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
            Hotel Directory
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Discover all the services and amenities we offer to make your stay
            exceptional
          </p>
        </div>

        {/* Category Tabs */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {hotelDirectory.map((category) => {
            const IconComponent = category.icon;
            const isActive = activeCategory === category.id;

            return (
              <Button
                key={category.id}
                variant={isActive ? "default" : "outline"}
                size="lg"
                onClick={() => setActiveCategory(category.id)}
                className={cn(
                  "flex items-center gap-3 px-6 py-3 rounded-full transition-all duration-300",
                  isActive
                    ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg scale-105"
                    : "hover:shadow-md hover:scale-105 bg-white"
                )}
              >
                <IconComponent className="w-5 h-5" />
                <span className="font-medium">{category.name}</span>
              </Button>
            );
          })}
        </div>

        {/* Services Grid */}
        {activeData && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {activeData.items.map((item) => (
              <ServiceCard key={item.id} item={item} category={activeData} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default HotelDirectory;
