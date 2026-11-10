import Navbar from "@/components/layouts/Header";
import Footer from "@/components/layouts/Footer";

export const metadata = {
  title: "Africa Childcare Forum Uganda 2027",
  description:
    "The Africa Promise: Financing Africa’s Childcare Future. Join the Africa Childcare Forum in Kampala, Uganda, May 17–21, 2027.",
};

export default function SiteLayout({ children }) {
  return (
    <>
      <Navbar />
      {children}
      <Footer />
    </>
  );
}
