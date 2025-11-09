
"use client";

import { useState, useEffect } from 'react';
import { Play, Square, Download, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from "@/lib/utils";
import type { AttackState } from '@/app/page';

type Protocol = 'TCP' | 'UDP' | 'ICMP' | 'ARP';

interface Packet {
  id: number;
  time: string;
  source: string;
  destination: string;
  protocol: Protocol;
  length: number;
  info: string;
}

interface LiveCaptureProps {
  activeAttack: AttackState;
}

const protocolColors: Record<Protocol, string> = {
  TCP: 'bg-blue-400/20 text-blue-400 border-blue-400/30',
  UDP: 'bg-purple-400/20 text-purple-400 border-purple-400/30',
  ICMP: 'bg-red-400/20 text-red-400 border-red-400/30',
  ARP: 'bg-orange-400/20 text-orange-400 border-orange-400/30',
};

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

export default function LiveCapture({ activeAttack }: LiveCaptureProps) {
  const [isCapturing, setIsCapturing] = useState(false);
  const [packets, setPackets] = useState<Packet[]>([]);

  useEffect(() => {
    if (activeAttack.isActive && activeAttack.type === 'syn_flood' && activeAttack.targetIp) {
      // If an attack is active, force capture to start
      if (!isCapturing) setIsCapturing(true);
    }
  }, [activeAttack.isActive, activeAttack.type, isCapturing]);

  useEffect(() => {
    let interval: NodeJS.Timeout | undefined;
    if (isCapturing) {
      interval = setInterval(() => {
        setPackets(prevPackets => {
          let newPacket: Packet;
          if (activeAttack.isActive && activeAttack.type === 'syn_flood' && activeAttack.targetIp) {
            newPacket = generateSynPacket(prevPackets.length + 1, activeAttack.targetIp);
          } else {
            newPacket = generateRandomPacket(prevPackets.length + 1);
          }
          const newPackets = [newPacket, ...prevPackets];
          return newPackets.length > 200 ? newPackets.slice(0, 200) : newPackets;
        });
      }, activeAttack.isActive ? 100 : 1000); // Faster packet generation during attack
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isCapturing, activeAttack]);


  const toggleCapture = () => {
    if (!isCapturing && packets.length === 0) {
      // Prefill some data on first start
      const initialPackets = Array.from({ length: 10 }, (_, i) => generateRandomPacket(i + 1)).reverse();
      setPackets(initialPackets);
    }
    setIsCapturing(!isCapturing);
  };
  
  const clearPackets = () => {
    setPackets([]);
  }

  return (
    <Card>
      <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 space-y-0 pb-2">
        <CardTitle>Live Packet Capture</CardTitle>
        <div className="flex items-center space-x-2">
          <Button onClick={toggleCapture} variant={isCapturing ? 'destructive' : 'default'} size="sm" className="w-[140px]" disabled={activeAttack.isActive}>
            {isCapturing ? <Square className="mr-2 h-4 w-4" /> : <Play className="mr-2 h-4 w-4" />}
            {isCapturing ? 'Stop Capture' : 'Start Capture'}
          </Button>
          <Button variant="outline" size="sm" onClick={clearPackets} disabled={packets.length === 0}>
            <Trash2 className="mr-2 h-4 w-4" />
            Clear
          </Button>
          <Button variant="outline" size="sm" disabled={packets.length === 0}>
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[500px] w-full rounded-md border">
          <Table>
            <TableHeader className="sticky top-0 bg-card z-10">
              <TableRow>
                <TableHead className="w-[100px]">Time</TableHead>
                <TableHead>Source</TableHead>
                <TableHead>Destination</TableHead>
                <TableHead>Protocol</TableHead>
                <TableHead>Length</TableHead>
                <TableHead>Info</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {packets.length > 0 ? (
                packets.map((packet) => (
                  <TableRow key={packet.id} className={cn(
                    "animate-in fade-in-20 duration-500",
                    packet.protocol === 'TCP' && packet.info.includes('[SYN]') && 'bg-destructive/10'
                  )}>
                    <TableCell className="font-mono text-xs">{packet.time}</TableCell>
                    <TableCell className="font-mono text-xs">{packet.source}</TableCell>
                    <TableCell className="font-mono text-xs">{packet.destination}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className={cn("font-semibold", protocolColors[packet.protocol])}>{packet.protocol}</Badge>
                    </TableCell>
                    <TableCell>{packet.length}</TableCell>
                    <TableCell className="text-muted-foreground">{packet.info}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                    No packets captured. Start capturing to see live data.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
