import MainSection from "../components/Home/MainSection";
import SideBar from "../components/Home/Sidebar";
import { useState } from "react";
// import { useAuth } from "../context/AuthProvider";

const Home = () => {
  // const { user } = useAuth();

  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="flex ">
      <SideBar setIsOpen={setIsOpen} isOpen={isOpen} />
      <MainSection />
    </div>
  );
};

export default Home;
