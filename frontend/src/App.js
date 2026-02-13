import "@/App.css";
import "@/index.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from '@/components/ui/sonner';
import DashboardLayout from '@/components/DashboardLayout';
import Dashboard from '@/pages/Dashboard';
import Simulator from '@/pages/Simulator';
import Logs from '@/pages/Logs';
import Education from '@/pages/Education';

function App() {
  return (
    <div className="App dark">
      <BrowserRouter>
        <DashboardLayout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/simulator" element={<Simulator />} />
            <Route path="/logs" element={<Logs />} />
            <Route path="/education" element={<Education />} />
          </Routes>
        </DashboardLayout>
      </BrowserRouter>
      <Toaster position="top-right" theme="dark" />
    </div>
  );
}

export default App;