"use client";

import { Card, CardTitle, CardHeader, CardAction, CardContent,CardDescription,CardFooter } from "@/components/ui/card";



export default function LoginPage() {
  return (
    <div className="font-sans flex items-center justify-center h-screen">
    <Card className="w-[644px] h-[626px] items-center justify-center">
  <CardHeader>
    <CardTitle>Card Title</CardTitle>
    <CardDescription>Card Description</CardDescription>
    <CardAction>Card Action</CardAction>
  </CardHeader>
  <CardContent>
    <p>Card Content</p>
  </CardContent>
  <CardFooter>
    <p>Card Footer</p>
  </CardFooter>
</Card>
    </div>
  );
}