import { prisma } from "@/lib/prisma";

export async function POST(req) {
  try {
    const { token } = await req.json();

    const subscriber = await prisma.newsletterSubscriber.findUnique({
      where: { unsubscribeToken: token },
    });

    if (!subscriber) {
      return Response.json(
        { error: "Invalid unsubscribe link" },
        { status: 400 }
      );
    }

    await prisma.newsletterSubscriber.update({
      where: { id: subscriber.id },
      data: { isSubscribed: false },
    });

    return Response.json({ success: true });

  } catch (error) {
    console.error(error);

    return Response.json(
      { error: "Failed to unsubscribe" },
      { status: 500 }
    );
  }
}