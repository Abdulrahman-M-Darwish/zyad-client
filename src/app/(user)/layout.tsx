import { Navbar } from "@/components/Navbar";
import React from "react";

const UsersLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div>
      <Navbar />
      {children}
    </div>
  );
};

export default UsersLayout;
