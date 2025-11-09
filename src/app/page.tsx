
"use client";

import { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Header from '@/components/header';
import LiveCapture from '@/components/dashboard/live-capture';
import AttackSimulation from '@/components/dashboard/attack-simulation';
import { useToast } from "@/hooks/use-toast";

export type AttackType = 'syn_flood' | 'arp_poisoning' | 'ddos';

const attackTypeNames: { [key in AttackType]: string } = {
  syn_flood: 'SYN Flood',
  arp_poisoning: 'ARP Poisoning',
  ddos: 'DDoS Attack',
};

export type AttackState = {
  type: AttackType | null;
  targetIp: string;
  duration: number;
  progress: number;
  isSimulating: boolean;
};

export default function Home() {
  const [attackState, setAttackState] = useState<AttackState>({
    type: 'syn_flood',
    targetIp: '192.168.1.102',
    duration: 30,
    progress: 0,
    isSimulating: false,
  });
  const { toast } = useToast();

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (attackState.isSimulating && attackState.progress < 100) {
      timer = setTimeout(() => {
        setAttackState(prevState => ({
          ...prevState,
          progress: prevState.progress + 100 / prevState.duration
        }));
      }, 1000);
    } else if (attackState.isSimulating && attackState.progress >= 100) {
      if (attackState.type) {
        toast({
            title: "Simulation Complete",
            description: `The ${attackTypeNames[attackState.type]} simulation has finished.`,
        });
      }
      setAttackState(prevState => ({ ...prevState, isSimulating: false, progress: 0, type: null }));
    }
    return () => clearTimeout(timer);
  }, [attackState.isSimulating, attackState.progress, attackState.duration, attackState.type, toast]);


  const handleLaunchAttack = () => {
    if (attackState.targetIp.match(/^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$/)) {
        setAttackState(prevState => ({ ...prevState, isSimulating: true, progress: 0 }));
        if (attackState.type) {
            toast({
                title: "Simulation Started",
                description: `Launching ${attackTypeNames[attackState.type]} on ${attackState.targetIp}.`,
            });
        }
    } else {
        toast({
            variant: "destructive",
            title: "Invalid IP Address",
            description: "Please enter a valid IP address for the target.",
        });
    }
  };

  return (
    <div className="flex min-h-screen w-full flex-col bg-background text-foreground">
      <Header />
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8 lg:p-12">
        <Tabs defaultValue="capture" className="w-full">
          <TabsList className="grid w-full grid-cols-1 sm:grid-cols-2 h-auto sm:h-10">
            <TabsTrigger value="capture">Live Capture</TabsTrigger>
            <TabsTrigger value="simulation">Attack Simulation</TabsTrigger>
          </TabsList>
          <TabsContent value="capture" className="mt-6">
            <LiveCapture attackState={attackState} />
          </TabsContent>
          <TabsContent value="simulation" className="mt-6">
            <AttackSimulation 
              attackState={attackState}
              onStateChange={setAttackState}
              onLaunchAttack={handleLaunchAttack}
            />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
