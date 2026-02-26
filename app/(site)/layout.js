import Navbar from "@/components/layouts/Header";

export const metadata = {
  title: "Africa Childcare Forum",
  description: "Care for All: Building a Global Future for Africa",
};

export default function SiteLayout({ children }) {
  return (
    <>
      <Navbar />
        {children}
    </>
  );
}
