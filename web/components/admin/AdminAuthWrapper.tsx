"use client";

import { useState } from "react";
import PasswordPrompt from "./PasswordPrompt";

export default function AdminAuthWrapper({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  if (!isAuthenticated) {
    return <PasswordPrompt onAuthenticated={() => setIsAuthenticated(true)} />;
  }

  return <>{children}</>;
}
