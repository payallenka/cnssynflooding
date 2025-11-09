"use client";

import { useState, useEffect } from 'react';
import { Shield, Zap, Play, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { useToast } from "@/hooks/use-toast";

const attackTypeNames: { [key: string]: string } = {
  syn_flood: 'SYN Flood',
  arp_poisoning: 'ARP Poisoning',
  ddos: 'DDoS Attack',
};

export default function AttackSimulation() {
  const [attackType, setAttackType] = useState('syn_flood');
  const [targetIp, setTargetIp] = useState('192.168.1.102');
  const [duration, setDuration] = useState(30);
  const [isSimulating, setIsSimulating] = useState(false);
  const [progress, setProgress] = useState(0);
  const { toast } = useToast();

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isSimulating && progress < 100) {
      timer = setTimeout(() => setProgress(progress + 100 / duration), 1000);
    } else if (progress >= 100) {
      setIsSimulating(false);
      setProgress(0);
      toast({
        title: "Simulation Complete",
        description: `The ${attackTypeNames[attackType] || 'attack'} simulation has finished.`,
      });
    }
    return () => clearTimeout(timer);
  }, [isSimulating, progress, duration, attackType, toast]);

  const handleLaunchAttack = () => {
    if (targetIp.match(/^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$/)) {
        setIsSimulating(true);
        setProgress(0);
        toast({
            title: "Simulation Started",
            description: `Launching ${attackTypeNames[attackType] || 'attack'} on ${targetIp}.`,
        });
    } else {
        toast({
            variant: "destructive",
            title: "Invalid IP Address",
            description: "Please enter a valid IP address for the target.",
        });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2"><Zap className="w-6 h-6 text-destructive" /> Attack Simulation</CardTitle>
        <CardDescription>Simulate common network attacks to test your system's resilience.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
            <Label htmlFor="attack-type">Attack Type</Label>
            <Select onValueChange={setAttackType} defaultValue={attackType} disabled={isSimulating}>
                <SelectTrigger id="attack-type">
                <SelectValue placeholder="Select an attack" />
                </SelectTrigger>
                <SelectContent>
                <SelectItem value="syn_flood">SYN Flood</SelectItem>
                <SelectItem value="arp_poisoning">ARP Poisoning</SelectItem>
                <SelectItem value="ddos">DDoS Attack</SelectItem>
                </SelectContent>
            </Select>
            </div>
            <div className="space-y-2">
            <Label htmlFor="target-ip">Target IP</Label>
            <Input id="target-ip" placeholder="e.g., 192.168.1.1" value={targetIp} onChange={(e) => setTargetIp(e.target.value)} disabled={isSimulating}/>
            </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="duration">Duration (seconds)</Label>
          <Input id="duration" type="number" placeholder="e.g., 30" value={duration} onChange={(e) => setDuration(Number(e.target.value))} min="10" max="120" disabled={isSimulating}/>
        </div>
        
        {isSimulating && (
          <div className="space-y-4 pt-4">
            <div className="flex justify-between items-center text-sm">
                <p className="text-muted-foreground">Simulation in progress...</p>
                <p className="font-medium">{Math.round(progress)}%</p>
            </div>
            <Progress value={progress} className="w-full" />
            <div className="flex items-center justify-center text-muted-foreground p-8 bg-muted/50 rounded-lg">
                <Shield className="w-16 h-16 animate-pulse text-destructive" />
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button onClick={handleLaunchAttack} disabled={isSimulating} className="w-full sm:w-auto">
          {isSimulating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Play className="mr-2 h-4 w-4" />}
          {isSimulating ? 'Simulation Running...' : 'Launch Attack'}
        </Button>
      </CardFooter>
    </Card>
  );
}
