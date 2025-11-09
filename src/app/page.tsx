import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Header from '@/components/header';
import LiveCapture from '@/components/dashboard/live-capture';
import AttackSimulation from '@/components/dashboard/attack-simulation';
import AnalysisReport from '@/components/dashboard/analysis-report';

export default function Home() {
  return (
    <div className="flex min-h-screen w-full flex-col bg-background text-foreground">
      <Header />
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8 lg:p-12">
        <Tabs defaultValue="capture" className="w-full">
          <TabsList className="grid w-full grid-cols-1 sm:grid-cols-3 h-auto sm:h-10">
            <TabsTrigger value="capture">Live Capture</TabsTrigger>
            <TabsTrigger value="simulation">Attack Simulation</TabsTrigger>
            <TabsTrigger value="analysis">Analysis & Reports</TabsTrigger>
          </TabsList>
          <TabsContent value="capture" className="mt-6">
            <LiveCapture />
          </TabsContent>
          <TabsContent value="simulation" className="mt-6">
            <AttackSimulation />
          </TabsContent>
          <TabsContent value="analysis" className="mt-6">
            <AnalysisReport />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
