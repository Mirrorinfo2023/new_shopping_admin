import { useEffect } from "react";
import { useRouter } from "next/router";

// src/pages/index.js
import Layout from "@/components/common/Layout";
import DashboardScreen from "./dashboard/new";

export default function Home() {
  return (
    // <Layout>
      <DashboardScreen />
    // </Layout>
  );
}
