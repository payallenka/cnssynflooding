
"use client";

import { Shield, Zap, Play, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import type { AttackState, AttackType } from '@/app/page';

interface AttackSimulationProps {
    attackState: AttackState;
    onStateChange: (state: AttackState) => void;
    onLaunchAttack: () => void;
}

export default function AttackSimulation({ attackState, onStateChange, onLaunchAttack }: AttackSimulationProps) {
  const { type, targetIp, duration, progress, isSimulating } = attackState;

  const handleValueChange = <K extends keyof AttackState>(key: K, value: AttackState[K]) => {
    onStateChange({ ...attackState, [key]: value });
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
            <Select 
                onValueChange={(value) => handleValueChange('type', value as AttackType)} 
                value={type ?? ''} 
                disabled={isSimulating}
            >
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
            <Input 
                id="target-ip" 
                placeholder="e.g., 192.168.1.1" 
                value={targetIp} 
                onChange={(e) => handleValueChange('targetIp', e.target.value)} 
                disabled={isSimulating}
            />
            </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="duration">Duration (seconds)</Label>
          <Input 
            id="duration" 
            type="number" 
            placeholder="e.g., 30" 
            value={duration} 
            onChange={(e) => handleValueChange('duration', Number(e.target.value))} 
            min="10" 
            max="120" 
            disabled={isSimulating}
          />
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
        <Button onClick={onLaunchAttack} disabled={isSimulating || !type} className="w-full sm:w-auto">
          {isSimulating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Play className="mr-2 h-4 w-4" />}
          {isSimulating ? 'Simulation Running...' : 'Launch Attack'}
        </Button>
      </CardFooter>
    </Card>
  );
}
