import { Route, Routes } from "react-router-dom";
import { Home, Docters, About, Contact, Login, MyAppointments, MyProfile, Appointment } from "./pages";

function App() {
  return (
    <main className="mx-4 sm:mx-[10%] ">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/docters" element={<Docters />} />
        <Route path="/docters/:speciality" element={<Docters />} />
        <Route path="/appointment" element={<Appointment />} />
        <Route path="/login" element={<Login />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/my-profile" element={<MyProfile />} />
        <Route path="/my-appointments" element={<MyAppointments />} />
      </Routes>
    </main>
  );
}

export default App;
