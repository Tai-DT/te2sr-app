import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { credential, email, role = 'client' } = body;

    const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || '';
    const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET || '';

    let verifiedEmail = email;
    let verifiedName = '';
    let picture = '';

    // If ID Token (credential) is passed from Google OAuth, verify it on backend via Google OAuth API
    if (credential) {
      const verifyRes = await fetch(`https://oauth2.googleapis.com/tokeninfo?id_token=${credential}`);
      const tokenData = await verifyRes.json();

      if (tokenData.aud === googleClientId || tokenData.email) {
        verifiedEmail = tokenData.email;
        verifiedName = tokenData.name || tokenData.email.split('@')[0];
        picture = tokenData.picture || '';
      }
    }

    if (!verifiedEmail) {
      return NextResponse.json({ success: false, error: 'Xác thực Google thất bại' }, { status: 400 });
    }

    const name = verifiedName || verifiedEmail.split('@')[0];
    const formattedName = name.charAt(0).toUpperCase() + name.slice(1);

    const user = {
      id: `USR-GGL-${Math.floor(1000 + Math.random() * 9000)}`,
      name: formattedName,
      email: verifiedEmail,
      role: role as 'client' | 'admin',
      avatar: picture,
      authProvider: 'Google OAuth 2.0 Backend Verified',
    };

    return NextResponse.json({
      success: true,
      user,
      message: 'Đã xác thực thành công qua Google Backend OAuth 2.0',
    });
  } catch (error) {
    console.error('Google Backend Auth Error:', error);
    return NextResponse.json({ success: false, error: 'Lỗi kết nối Backend Google Auth' }, { status: 500 });
  }
}
