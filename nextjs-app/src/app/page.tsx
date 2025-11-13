import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Server, Shield, Zap, Users, Check } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-16">
        <header className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-6">
            Play with your friends on your own game server !
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto mb-8">
            Deploy your server and start playing in minutes with our easy-to-use platform
          </p>
          <div className="flex items-center justify-center mb-8">
            <Select defaultValue="minecraft" >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select a fruit" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="minecraft">Minecraft</SelectItem>
                <SelectItem value="bedrock">Minecraft Bedrock</SelectItem>
                <SelectItem value="csgo">Counter-Strike: Global Offensive</SelectItem>
                <SelectItem value="tf2">Team Fortress 2</SelectItem>
                <SelectItem value="rust">Rust</SelectItem>
                <SelectItem value="ark">ARK: Survival Evolved</SelectItem>
                </SelectContent>
            </Select>
            <Button size="lg" className="ml-4" asChild>
              <Link href="/create">Deploy Now</Link>
            </Button>
          </div>
          <div className="flex items-center gap-4 justify-center space-x-8 text-lg text-gray-700 dark:text-gray-300">
            <span>
              <Check className="h-6 w-6 inline-block mr-2 text-green-600" />
                FreeServers Available
            </span>
            <span>
              <Check className="h-6 w-6 inline-block mr-2 text-green-600" />
                No Credit Card Required
            </span>

          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          <Card>
            <CardHeader className="text-center">
              <Server className="h-12 w-12 mx-auto mb-4 text-blue-600" />
              <CardTitle>Easy Deployment</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-center text-muted-foreground">
                One-click server deployment with pre-configured game templates
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="text-center">
              <Shield className="h-12 w-12 mx-auto mb-4 text-green-600" />
              <CardTitle>Secure & Reliable</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-center text-muted-foreground">
                Enterprise-grade security with 99.9% uptime guarantee
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="text-center">
              <Zap className="h-12 w-12 mx-auto mb-4 text-yellow-600" />
              <CardTitle>High Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-center text-muted-foreground">
                SSD storage, powerful CPUs, and optimized network performance
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="text-center">
              <Users className="h-12 w-12 mx-auto mb-4 text-purple-600" />
              <CardTitle>24/7 Support</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-center text-muted-foreground">
                Round-the-clock technical support and server management
              </p>
            </CardContent>
          </Card>
        </div>
        <div>
          <p>Multiplayer</p>
          <h2 className="text-3xl font-bold text-center mb-8 text-gray-900 dark:text-white">Invite Your Friends to your server</h2>
          <p>Play with your friends when they want and when you want !</p>
          <Button>Create server</Button>

        </div>

        <div className="text-center">
          <Card className="max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle>Ready to Get Started?</CardTitle>
              <CardDescription>
                Join thousands of gamers who trust us with their server hosting needs
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button size="lg" className="w-full" asChild>
                <Link href="/create">View Available Plans</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
