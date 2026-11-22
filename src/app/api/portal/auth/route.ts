import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const portalDataPath = path.join(process.cwd(), "src", "data", "portalData.json");

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json();

    if (!username || !password) {
      return NextResponse.json(
        { success: false, error: "Username and password are required" },
        { status: 400 }
      );
    }

    if (!fs.existsSync(portalDataPath)) {
      return NextResponse.json(
        { success: false, error: "Portal configuration missing" },
        { status: 500 }
      );
    }

    const fileContent = fs.readFileSync(portalDataPath, "utf8");
    const portalData = JSON.parse(fileContent);

    const user = portalData.users.find(
      (u: any) =>
        u.username.toLowerCase() === username.trim().toLowerCase() &&
        u.password === password.trim()
    );

    if (!user) {
      return NextResponse.json(
        { success: false, error: "Invalid username or password" },
        { status: 401 }
      );
    }

    // Return safe user payload (omit password)
    const { password: _, ...safeUser } = user;

    return NextResponse.json({
      success: true,
      message: "Authentication successful",
      user: safeUser,
    });
  } catch (error) {
    console.error("Auth error:", error);
    return NextResponse.json(
      { success: false, error: "Authentication failed" },
      { status: 500 }
    );
  }
}
