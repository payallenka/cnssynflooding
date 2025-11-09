"use client";

import { BarChart, LineChart, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Bar, BarChart as RechartsBarChart, Line, LineChart as RechartsLineChart, XAxis, YAxis, CartesianGrid, Cell } from 'recharts';

const protocolChartData = [
  { protocol: 'TCP', packets: 450, fill: "var(--color-tcp)" },
  { protocol: 'UDP', packets: 300, fill: "var(--color-udp)" },
  { protocol: 'ICMP', packets: 150, fill: "var(--color-icmp)" },
  { protocol: 'ARP', packets: 100, fill: "var(--color-arp)" },
];

const trafficChartData = [
  { time: '10:00', packets: 200 },
  { time: '10:05', packets: 350 },
  { time: '10:10', packets: 300 },
  { time: '10:15', packets: 450 },
  { time: '10:20', packets: 400 },
  { time: '10:25', packets: 600 },
  { time: '10:30', packets: 550 },
];

const chartConfig = {
  packets: { label: "Packets", color: "hsl(var(--primary))" },
  tcp: { label: "TCP", color: "hsl(var(--chart-1))" },
  udp: { label: "UDP", color: "hsl(var(--chart-2))" },
  icmp: { label: "ICMP", color: "hsl(var(--chart-3))" },
  arp: { label: "ARP", color: "hsl(var(--chart-4))" },
};


export default function AnalysisReport() {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
      <Card className="lg:col-span-4">
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><LineChart className="w-5 h-5"/> Traffic Over Time</CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-[300px] w-full">
            <RechartsLineChart data={trafficChartData}>
              <CartesianGrid vertical={false} />
              <XAxis dataKey="time" tickLine={false} axisLine={false} tickMargin={8} />
              <YAxis tickLine={false} axisLine={false} tickMargin={8} />
              <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
              <Line type="monotone" dataKey="packets" stroke="hsl(var(--primary))" strokeWidth={2} dot={true} />
            </RechartsLineChart>
          </ChartContainer>
        </CardContent>
      </Card>

      <Card className="lg:col-span-3">
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><BarChart className="w-5 h-5"/> Protocol Distribution</CardTitle>
        </CardHeader>
        <CardContent>
            <ChartContainer config={chartConfig} className="h-[300px] w-full">
                <RechartsBarChart data={protocolChartData} layout="vertical" margin={{ left: 10 }}>
                    <CartesianGrid horizontal={false} />
                    <XAxis type="number" hide />
                    <YAxis dataKey="protocol" type="category" tickLine={false} axisLine={false} tickMargin={8} width={60} />
                    <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
                    <Bar dataKey="packets" radius={5}>
                      {protocolChartData.map((entry) => (
                        <Cell key={`cell-${entry.protocol}`} fill={entry.fill} />
                      ))}
                    </Bar>
                </RechartsBarChart>
            </ChartContainer>
        </CardContent>
      </Card>
      
      <Card className="lg:col-span-7">
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><FileText className="w-5 h-5"/> Security Report</CardTitle>
          <CardDescription>A summary of findings from the captured data and simulated attacks.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
            <div>
                <h3 className="font-semibold">Vulnerability Summary</h3>
                <p className="text-muted-foreground text-sm">
                    High volume of TCP SYN packets detected, potentially indicating a SYN flood attempt. 
                    Several ARP requests for non-existent IPs were observed, which could be a sign of network scanning.
                    No critical vulnerabilities were exploited during the simulation.
                </p>
            </div>
             <div>
                <h3 className="font-semibold">Recommendations</h3>
                <p className="text-muted-foreground text-sm">
                    1. Implement rate limiting on SYN packets to mitigate flood attacks.
                    2. Monitor ARP traffic for anomalies and consider static ARP entries for critical servers.
                    3. Regularly perform security audits and penetration testing.
                </p>
            </div>
        </CardContent>
        <CardFooter>
            <Button>Generate Full Report (PDF)</Button>
        </CardFooter>
      </Card>
    </div>
  );
}
