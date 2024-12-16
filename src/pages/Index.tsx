import { motion } from "framer-motion";
import { EnergyChart } from "@/components/dashboard/EnergyChart";
import { PowerStats } from "@/components/dashboard/PowerStats";
import { Chatbot } from "@/components/Chatbot";
import { DarkModeToggle } from "@/components/DarkModeToggle";
import { FileUpload } from "@/components/FileUpload";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <DarkModeToggle />
      <main className="container px-4 py-12 mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="flex flex-col gap-8"
        >
          <div className="flex flex-col gap-4">
            <h1 className="text-3xl font-bold tracking-tight">
              Panel Sieci Energetycznej
            </h1>
            <p className="text-muted-foreground">
              Monitoruj zużycie i generację energii w czasie rzeczywistym
            </p>
          </div>

          <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
            <PowerStats />
          </div>

          <div className="grid gap-4 md:grid-cols-4">
            <EnergyChart />
          </div>

          <div className="mt-8 grid gap-8 md:grid-cols-2">
            <div>
              <h2 className="text-2xl font-bold mb-4">Wgraj plik</h2>
              <FileUpload />
            </div>
            <div>
              <h2 className="text-2xl font-bold mb-4">Asystent AI</h2>
              <Chatbot />
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
};

export default Index;