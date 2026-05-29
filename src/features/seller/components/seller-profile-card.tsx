"use client";

import React from "react";
import { Star, ShieldCheck, Clock, Package, Calendar } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface SellerProfileCardProps {
  seller?: {
    name: string;
    avatar: string;
    description: string;
    rating: number;
    totalSales: number;
    verified: boolean;
    memberSince: string;
    responseTime: string;
  };
}

const defaultSeller = {
  name: "Silk & Threads Co.",
  avatar: "ST",
  description:
    "Authentic Cambodian silk products crafted with traditional techniques. We work directly with local artisans in Takeo province to bring you the finest handwoven textiles.",
  rating: 4.9,
  totalSales: 1240,
  verified: true,
  memberSince: "March 2022",
  responseTime: "< 1 hour",
};

export function SellerProfileCard({ seller = defaultSeller }: SellerProfileCardProps) {
  return (
    <div className="rounded-xl border border-white/[0.06] bg-surface p-6">
      <div className="flex flex-col items-center gap-4 text-center sm:flex-row sm:text-left">
        <Avatar className="h-20 w-20">
          <AvatarFallback className="bg-accent-gold/10 text-accent-gold text-2xl font-semibold">
            {seller.avatar}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <div className="flex items-center justify-center gap-2 sm:justify-start">
            <h2 className="text-xl font-bold text-soft-white">{seller.name}</h2>
            {seller.verified && (
              <Badge className="bg-accent-gold/10 text-accent-gold border-accent-gold/30 gap-1">
                <ShieldCheck className="h-3 w-3" />
                Verified
              </Badge>
            )}
          </div>
          <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
            {seller.description}
          </p>

          {/* Stats */}
          <div className="mt-4 flex flex-wrap items-center justify-center gap-4 text-sm sm:justify-start">
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <Star className="h-4 w-4 fill-accent-gold text-accent-gold" />
              <span className="font-medium text-soft-white">{seller.rating}</span>
              rating
            </div>
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <Package className="h-4 w-4 text-accent-gold" />
              <span className="font-medium text-soft-white">
                {seller.totalSales.toLocaleString()}
              </span>
              sales
            </div>
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <Calendar className="h-4 w-4 text-accent-gold" />
              Since {seller.memberSince}
            </div>
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <Clock className="h-4 w-4 text-accent-gold" />
              Responds {seller.responseTime}
            </div>
          </div>
        </div>
        <Button className="bg-accent-gold text-background hover:bg-accent-gold/90">
          Contact Seller
        </Button>
      </div>
    </div>
  );
}
