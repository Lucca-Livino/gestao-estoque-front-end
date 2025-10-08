"use client";

import { Button } from "@/components/ui/button";
import { Card, CardTitle, CardHeader, CardAction, CardContent,CardDescription,CardFooter } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";



export default function LoginPage() {
  return (
    <div className="font-sans flex items-center justify-center h-screen">
    <Card className="w-[645px] h-[626px] flex-col items-center ">
  <CardHeader className="flex-col items-center ">
    <CardTitle className="text-3xl ">Login</CardTitle>
  </CardHeader>
  <CardContent className="mt-20">
    <p className="text-xl font-sans">Matricula*</p>
    <Input className="w-[481px] h-[60px]"/>    
  </CardContent>
  <CardContent className="">
     <p className="text-xl font-sans">Senha*</p>
    <Input className="w-[481px] h-[60px]"  />
  </CardContent>
  <Checkbox className="mt-4"/>Lembrar-me
  <CardFooter>
   <Button className="w-[481px] h-[60px] bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded">
      Entrar
    </Button>
  </CardFooter>
</Card>
    </div>
  );
}