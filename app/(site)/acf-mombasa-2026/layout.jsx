export const metadata = {
  title: "ACF Mombasa 2026 Archive | Africa Childcare Forum",
  description:
    "Explore the ACF Mombasa 2026 event archive, including programme, speakers, venue information, photos and videos.",
};

export default function ACFMombasaArchiveLayout({ children }) {
  return (
    <>
      <div className="border-b border-orange-100 bg-[#fffaf8]">
        <div className="mx-auto flex max-w-7xl items-center justify-center gap-5 px-4 py-3 sm:gap-8">
          <img
            src="/uganda2027/uganda.png"
            alt="Uganda government coat of arms"
            className="h-12 w-12 object-contain sm:h-14 sm:w-14"
          />
          <div className="rounded-lg bg-[#124126] px-3 py-1.5">
            <img
              src="/uganda2027/acf-uganda-logo-white.png"
              alt="Africa Childcare Forum Uganda 2027"
              className="h-10 w-auto max-w-[180px] object-contain sm:h-12 sm:max-w-[220px]"
            />
          </div>
          <p className="hidden text-sm font-medium text-gray-700 sm:block">
            Government-led · Kampala, Uganda · May 17–21, 2027
          </p>
        </div>
      </div>
      {children}
    </>
  );
}
