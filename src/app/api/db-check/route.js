import { db } from "@/lib/mongodb";

export async function GET() {
  try {
    await db.command({ ping: 1 });

    return Response.json({
      success: true,
      message: "MongoDB Connected",
    });
  } catch (error) {
    console.error("DB_PING_FAILED:", error);

    return Response.json(
      { success: false, message: "MongoDB Connection Failed" },
      { status: 500 }
    );
  }
}