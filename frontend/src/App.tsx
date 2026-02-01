import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { TicketList } from "@/features/tickets/TicketList";
import { TicketDetail } from "@/features/tickets/TicketDetail";
import { CreateTicket } from "@/features/tickets/CreateTicket";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<TicketList />} />
          <Route path="tickets/new" element={<CreateTicket />} />
          <Route path="tickets/:id" element={<TicketDetail />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
