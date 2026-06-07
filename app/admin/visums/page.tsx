import { getVisaApplications } from "@/lib/actions/visums";
import VisumsClient from "./VisumsClient";

export const dynamic = "force-dynamic";

export default async function AdminVisumsPage() {
  let applications: any[] = [];

  try {
    applications = await getVisaApplications();
  } catch {
    // Supabase not configured yet or table doesn't exist — show empty state
  }

  return <VisumsClient applications={applications} />;
}
