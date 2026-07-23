import { prisma } from "@/lib/prisma";
import { safeJson } from "@/lib/json";

export async function GET(_req, { params }) {
  try {
    const { token } = await params;

    if (!token) {
      return Response.json({ error: "Invite token is required" }, { status: 400 });
    }

    const invite = await prisma.special_invite_tbl.findUnique({
      where: { token: String(token) },
    });

    if (!invite) {
      return Response.json(
        { error: "This invitation link is not valid." },
        { status: 404 }
      );
    }

    if (invite.status === "USED") {
      return Response.json(
        { error: "This invitation link has already been used." },
        { status: 410 }
      );
    }

    return Response.json(
      safeJson({
        data: {
          token: invite.token,
          email: invite.email,
          name: invite.invited_name,
          amount: invite.amount,
          currency: invite.currency,
        },
      })
    );
  } catch (error) {
    console.error("Invite lookup failed:", error);
    return Response.json(
      { error: "Could not verify the invitation. Please try again." },
      { status: 500 }
    );
  }
}
