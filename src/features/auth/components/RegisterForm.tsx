"use client";

import React from "react";
import Link from "next/link";
import { UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

export function RegisterForm() {
  return (
    <Card className="border-rose-100/90 shadow-xl shadow-rose-100/30">
      <CardHeader className="space-y-1 text-center">
        <CardTitle className="text-xl font-bold tracking-tight text-neutral-900">
          Create an Account
        </CardTitle>
        <CardDescription className="text-xs text-neutral-500">
          Sign up to begin ordering your fashion pieces
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 text-center py-6 text-sm text-neutral-500">
        <p>Registration form implementation is coming up in Feature 04.</p>
      </CardContent>
      <CardFooter className="flex flex-col gap-3">
        <Link href="/login" className="w-full">
          <Button variant="outline" className="w-full text-xs font-semibold gap-2 border-rose-200 hover:bg-rose-50/80">
            <UserPlus className="h-4 w-4" />
            Back to Sign In
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
