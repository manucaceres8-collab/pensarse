import { getPatients } from "@/lib/demo-store";

export async function resolveDemoPatientId(idParam: string) {
  if (idParam !== "me") {
    return idParam;
  }

  const patients = await getPatients();
  if (!patients.length) {
    return "";
  }

  return patients.find((item) => item.id === "maria")?.id ?? patients[0].id;
}
