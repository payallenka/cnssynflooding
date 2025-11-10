
"use client";

import { useState, useEffect, useRef } from 'react';
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

export type Protocol = 'TCP' | 'UDP' | 'ICMP' | 'ARP';

export interface Packet {
  id: number;
  time: string;
  source: string;
  destination: string;
  protocol: Protocol;
  length: number;
  info: string;
}

const generateRandomIp = () => `${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`;
const protocols: Protocol[] = ['TCP', 'UDP', 'ICMP', 'ARP'];

const generateRandomPacket = (id: number): Packet => {
  const protocol = protocols[Math.floor(Math.random() * protocols.length)];
  return {
    id,
    time: new Date().toLocaleTimeString(),
    source: generateRandomIp(),
    destination: generateRandomIp(),
    protocol,
    length: Math.floor(Math.random() * 1400) + 60,
    info: `[${protocol}] Segment of a reassembled PDU`,
  };
};

const generateSynPacket = (id: number, destination: string): Packet => {
  return {
    id,
    time: new Date().toLocaleTimeString(),
    source: generateRandomIp(),
    destination: destination,
    protocol: 'TCP',
    length: 60,
    info: '[SYN] Connection request',
  };
}


export default function Home() {
  const [attackState, setAttackState] = useState<AttackState>({
    type: 'syn_flood',
    targetIp: '192.168.1.102',
    duration: 30,
    progress: 0,
    isSimulating: false,
  });
  const [isCapturing, setIsCapturing] = useState(false);
  const [packets, setPackets] = useState<Packet[]>([]);
  const { toast } = useToast();
  const nextPacketId = useRef(1);

  const isAttackActive = attackState.isSimulating && attackState.type === 'syn_flood';

  // Effect for attack simulation progress
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
      setAttackState(prevState => ({ ...prevState, isSimulating: false, progress: 0, type: prevState.type }));
    }
    return () => clearTimeout(timer);
  }, [attackState.isSimulating, attackState.progress, attackState.duration, attackState.type, toast]);

  // Effect for packet generation
  useEffect(() => {
    let interval: NodeJS.Timeout | undefined;
    if (isCapturing) {
      interval = setInterval(() => {
        setPackets(prevPackets => {
          let newPacket: Packet;
          const newId = nextPacketId.current++;
          if (isAttackActive && attackState.targetIp) {
            newPacket = generateSynPacket(newId, attackState.targetIp);
          } else {
            newPacket = generateRandomPacket(newId);
          }
          const newPackets = [newPacket, ...prevPackets];
          return newPackets.length > 200 ? newPackets.slice(0, 200) : newPackets;
        });
      }, isAttackActive ? 100 : 1000); // Faster packet generation during attack
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isCapturing, isAttackActive, attackState.targetIp]);

  const handleLaunchAttack = () => {
    if (attackState.targetIp.match(/^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$/)) {
        if (!isCapturing) setIsCapturing(true); // Start capturing if not already
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
  
  const toggleCapture = () => {
    const newIsCapturing = !isCapturing;
    if (newIsCapturing && packets.length === 0) {
      // Prefill some data on first start
      const initialPackets = Array.from({ length: 10 }, (_, i) => {
        const newId = nextPacketId.current++;
        return generateRandomPacket(newId);
      }).reverse();
      setPackets(initialPackets);
    }
    setIsCapturing(newIsCapturing);
  };
  
  const clearPackets = () => {
    setPackets([]);
  }

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
            <LiveCapture 
              attackState={attackState} 
              packets={packets}
              isCapturing={isCapturing}
              toggleCapture={toggleCapture}
              clearPackets={clearPackets}
            />
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
