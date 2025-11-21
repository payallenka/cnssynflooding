# CNS SYN Flooding Studio

This project is a Next.js-based web application for simulating, capturing, and analyzing network attacks, specifically SYN Flood, ARP Poisoning, and DDoS attacks. It provides an interactive dashboard for cybersecurity education and experimentation.

## Features

- **Live Packet Capture:**
  - Simulates network traffic and displays live packet data.
  - Allows starting/stopping capture and clearing packet logs.
- **Attack Simulation:**
  - Supports launching SYN Flood, ARP Poisoning, and DDoS attack simulations.
  - Configurable target IP and duration.
  - Visual progress tracking and notifications.
- **Analysis & Reports:**
  - Provides a section for reviewing attack results and packet data.

## Main Components

- `src/app/page.tsx`: Main dashboard with tabs for Live Capture, Attack Simulation, and Analysis & Reports.
- `src/components/dashboard/live-capture.tsx`: Displays live packet data and controls for capture.
- `src/components/dashboard/attack-simulation.tsx`: UI for configuring and launching attack simulations.
- `src/components/dashboard/analysis-reports.tsx`: Section for reviewing analysis and reports.

## Stepwise Workflow

1. **Live Capture Tab:**
   - Start capturing simulated network packets.
   - View real-time updates of packet data (source, destination, protocol, etc.).
   - Option to clear packet logs.
2. **Attack Simulation Tab:**
   - Select attack type (SYN Flood, ARP Poisoning, DDoS).
   - Enter target IP and duration.
   - Launch attack simulation; progress is tracked and displayed.
   - During SYN Flood, packets are generated rapidly to simulate the attack.
   - Notifications indicate start and completion of simulation.
3. **Analysis & Reports Tab:**
   - Review results and data from previous simulations and captures.

## Technologies Used

- Next.js (React framework)
- TypeScript
- Tailwind CSS (UI styling)

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```
2. Run the development server:
   ```bash
   npm run dev
   ```
3. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Educational Purpose

This tool is intended for learning and demonstration of network attack simulations and packet analysis. It does not perform real attacks but simulates traffic and attack scenarios for safe experimentation.

---

For more details, see the main dashboard in `src/app/page.tsx`.
