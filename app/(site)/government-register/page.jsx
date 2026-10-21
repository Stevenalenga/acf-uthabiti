import GovernmentForm from "./GovernmentForm";

export const metadata = {
  title: "Kenyan Government Officials Registration | ACFMombasa2026",
  description:
    "This registration link is only for Kenyan government officials. The special fee is KES 15,000.",
  robots: { index: false, follow: false },
};

export default function GovernmentRegisterPage() {
  return <GovernmentForm />;
}
