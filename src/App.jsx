import Header from "./components/Header";
import ActivityLogger from "./components/ActivityLogger";
import Dashboard from "./components/Dashboard";
import Footer from "./components/Footer";
import { Separator } from "@/components/ui/separator"
export default function App() {

  return (
    <>
      <Header />
      <ActivityLogger />
      <Separator />
      <Dashboard/>
      <Footer></Footer>
    </>
  );
}
