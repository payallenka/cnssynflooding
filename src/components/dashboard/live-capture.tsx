
"use client";

import { Play, Square, Download, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from "@/lib/utils";
import type { AttackState, Packet, Protocol } from '@/app/page';

interface LiveCaptureProps {
  attackState: AttackState;
  packets: Packet[];
  isCapturing: boolean;
  toggleCapture: () => void;
  clearPackets: () => void;
}

const protocolColors: Record<Protocol, string> = {
  TCP: 'bg-blue-400/20 text-blue-400 border-blue-400/30',
  UDP: 'bg-purple-400/20 text-purple-400 border-purple-400/30',
  ICMP: 'bg-red-400/20 text-red-400 border-red-400/30',
  ARP: 'bg-orange-400/20 text-orange-400 border-orange-400/30',
};


export default function LiveCapture({ attackState, packets, isCapturing, toggleCapture, clearPackets }: LiveCaptureProps) {
  const isAttackActive = attackState.isSimulating && attackState.type === 'syn_flood';

  return (
    <Card>
      <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 space-y-0 pb-2">
        <CardTitle>Live Packet Capture</CardTitle>
        <div className="flex items-center space-x-2">
          <Button onClick={toggleCapture} variant={isCapturing ? 'destructive' : 'default'} size="sm" className="w-[140px]" disabled={isAttackActive}>
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
