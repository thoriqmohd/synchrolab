import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Layout } from "@/components/layout/Layout";
import Index from "./pages/Index.tsx";
import Courses from "./pages/Courses.tsx";
import CourseDetail from "./pages/CourseDetail.tsx";
import Rooms from "./pages/Rooms.tsx";
import CheckBooking from "./pages/CheckBooking.tsx";
import Contact from "./pages/Contact.tsx";
import HostCourse from "./pages/HostCourse.tsx";
import ListVenue from "./pages/ListVenue.tsx";
import NotFound from "./pages/NotFound.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Index />} />
            <Route path="/kursus" element={<Courses />} />
            <Route path="/kursus/:id" element={<CourseDetail />} />
            <Route path="/sewa-bilik" element={<Rooms />} />
            <Route path="/anjur-kursus" element={<HostCourse />} />
            <Route path="/senarai-tempat" element={<ListVenue />} />
            <Route path="/semak-tempahan" element={<CheckBooking />} />
            <Route path="/hubungi" element={<Contact />} />
          </Route>
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
