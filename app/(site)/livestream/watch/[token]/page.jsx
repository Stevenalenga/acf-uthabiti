import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import {
  LIVESTREAM,
  getLivestreamStreamUrl,
  youtubeEmbedSrc,
} from "@/lib/livestream";

export const metadata = {
  title: "ACF Mombasa 2026 livestream",
  robots: { index: false, follow: false },
};

export default async function LivestreamWatchPage({ params }) {
  const { token } = await params;
  if (!token) notFound();

  const purchase = await prisma.livestream_purchase_tbl.findUnique({
    where: { access_token: token },
  });

  if (!purchase) notFound();

  if (purchase.status !== "SUCCESS") {
    return (
      <main className="bg-white min-h-[70vh]">
        <section className="max-w-2xl mx-auto px-6 py-28 text-center">
          <h1 className="text-3xl font-bold text-gray-900">
            Livestream access is not active yet
          </h1>
          <p className="mt-4 text-gray-600">
            We have not confirmed payment for this link. If you have just paid,
            wait a moment and refresh this page, or return to checkout.
          </p>
          <Link
            href="/livestream"
            className="inline-block mt-8 bg-[#E5553C] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#cf4b35]"
          >
            Go to livestream checkout
          </Link>
        </section>
      </main>
    );
  }

  const streamUrl = getLivestreamStreamUrl();
  const embedSrc = youtubeEmbedSrc(streamUrl);

  return (
    <main className="bg-white text-gray-900">
      <section className="bg-[#FFF4F0] pt-28 pb-10">
        <div className="max-w-5xl mx-auto px-6">
          <p className="text-[#E5553C] font-semibold tracking-wide">
            Personal livestream access
          </p>
          <h1 className="text-3xl sm:text-4xl font-bold mt-2">
            {LIVESTREAM.title}
          </h1>
          <p className="mt-3 text-gray-600">
            Welcome, {purchase.full_name}. Access is valid for{" "}
            {LIVESTREAM.datesLabel}.
            {purchase.invoice_number
              ? ` Invoice ${purchase.invoice_number}.`
              : ""}
          </p>
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-6 py-10">
        {embedSrc ? (
          <div className="aspect-video w-full overflow-hidden rounded-2xl bg-black shadow-lg">
            <iframe
              src={embedSrc}
              title="ACF Mombasa 2026 livestream"
              className="h-full w-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          </div>
        ) : streamUrl ? (
          <div className="border border-gray-200 rounded-2xl p-8 text-center">
            <p className="text-gray-700">
              Your livestream is ready. Open the conference stream in a new tab.
            </p>
            <a
              href={streamUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block mt-6 bg-[#E5553C] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#cf4b35]"
            >
              Join the livestream
            </a>
          </div>
        ) : (
          <div className="border border-orange-200 bg-orange-50 rounded-2xl p-8">
            <h2 className="text-xl font-bold text-gray-900">
              Your access is confirmed
            </h2>
            <p className="mt-3 text-gray-700">
              The live player will appear on this page when the stream starts.
              Keep this link. We have also emailed it to {purchase.email}.
            </p>
            <p className="mt-3 text-sm text-gray-600">
              Questions? Contact{" "}
              <a
                href={`mailto:${LIVESTREAM.supportEmail}`}
                className="text-[#E5553C] font-semibold"
              >
                {LIVESTREAM.supportEmail}
              </a>
              .
            </p>
          </div>
        )}
      </section>
    </main>
  );
}
