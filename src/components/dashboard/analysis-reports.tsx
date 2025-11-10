"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpen, ShieldCheck, Cpu } from 'lucide-react';

export default function AnalysisReports() {
  return (
    <div className="grid gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Cpu className="w-6 h-6 text-primary" /> How The Simulation Works</CardTitle>
          <CardDescription>A breakdown of what happens when you launch a SYN Flood attack in this app.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 text-sm text-muted-foreground">
          <p>When you launch a "SYN Flood" from the **Attack Simulation** tab, the following happens behind the scenes:</p>
          <ol className="list-decimal space-y-2 pl-5">
            <li>
              <strong>Capture Starts:</strong> The app automatically starts the "Live Packet Capture" if it isn't already running.
            </li>
            <li>
              <strong>Packet Generation Speeds Up:</strong> The rate of new packet creation increases tenfold (from 1 per second to 10 per second) to simulate a "flood" of traffic.
            </li>
            <li>
              <strong>SYN Packets are Injected:</strong> Instead of generating random packets, the app starts creating specific TCP packets with the `[SYN]` flag. These are all directed to the "Target IP" you specified.
            </li>
            <li>
              <strong>Visual Feedback:</strong> You see this flood in the **Live Capture** table, with the SYN packets highlighted in red, clearly showing the simulated attack traffic.
            </li>
            <li>
              <strong>Simulation Ends:</strong> Once the timer runs out, the packet generation returns to its normal speed, and the capture stops, leaving the captured data for you to review.
            </li>
          </ol>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><BookOpen className="w-6 h-6 text-primary" /> What is a Real SYN Flood?</CardTitle>
          <CardDescription>Understanding the concept behind this common Denial-of-Service (DoS) attack.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 text-sm text-muted-foreground">
          <p>
            A SYN Flood attack exploits a fundamental part of how many internet connections are made: the **TCP Three-Way Handshake**.
          </p>
          <div className='px-4'>
            <p className="font-semibold text-foreground mb-2">Normal Handshake:</p>
            <ol className="list-decimal space-y-2 pl-5">
              <li><strong>Client → Server:</strong> "Hi, I'd like to connect!" (This is a <strong>SYN</strong> packet).</li>
              <li><strong>Server → Client:</strong> "Great! I've saved a spot for you. Are you still there?" (This is a <strong>SYN-ACK</strong> packet). The server now waits.</li>
              <li><strong>Client → Server:</strong> "Yep, I'm here!" (This is an <strong>ACK</strong> packet). The connection is now open.</li>
            </ol>
          </div>
          <p>
            In a **SYN Flood attack**, an attacker sends a massive number of **SYN** packets, often from fake IP addresses. The server diligently responds to each one and waits for the final reply that never arrives. The server's connection queue fills up with these half-open connections, and it can no longer accept new, legitimate connections, making the service appear down.
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><ShieldCheck className="w-6 h-6 text-primary" /> Mitigation Techniques</CardTitle>
          <CardDescription>How modern systems defend against SYN Flood attacks.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 text-sm text-muted-foreground">
           <ul className="list-disc space-y-3 pl-5">
            <li>
              <strong className="text-foreground">SYN Cookies:</strong> A clever cryptographic trick. Instead of saving the connection right away, the server sends a special response (a "cookie"). A legitimate client will respond correctly, allowing the server to reconstruct the connection without having to store anything initially.
            </li>
            <li>
              <strong className="text-foreground">Rate Limiting:</strong> A firewall can limit the number of connection requests from a single source. This is a simple but effective way to absorb smaller attacks.
            </li>
            <li>
              <strong className="text-foreground">Increased Backlog Queue:</strong> The server's capacity for holding half-open connections can be increased. This doesn't prevent the attack, but it makes it harder for the attacker to overwhelm the server.
            </li>
            <li>
              <strong className="text-foreground">Firewall Filtering:</strong> Network firewalls can be configured to identify and drop malicious SYN packets before they ever reach the server, often using sophisticated pattern detection.
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
