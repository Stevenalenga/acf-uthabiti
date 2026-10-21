import { notFound } from "next/navigation";
import { isValidLogbookToken } from "@/lib/logbook";
import LogbookClient from "./LogbookClient";

export default async function LogbookPage({ params }) {
  const { token } = await params;
  if (!isValidLogbookToken(token)) notFound();
  return <LogbookClient token={token} />;
}
