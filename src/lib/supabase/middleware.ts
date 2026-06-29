import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

const ROLE_PREFIX: Record<string, string> = {
  admin: "/admin",
  kajur: "/kajur",
  guru: "/guru",
  siswa: "/siswa",
  bkk: "/bkk",
};

const PUBLIC_PATHS = ["/login", "/aktivasi", "/auth", "/verifikasi"];

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  const { data: { user } } = await supabase.auth.getUser();
  const path = request.nextUrl.pathname;
  const isPublic = PUBLIC_PATHS.some((p) => path.startsWith(p)) || path === "/";

  if (!user) {
    if (!isPublic) {
      const url = request.nextUrl.clone();
      url.pathname = "/login";
      return NextResponse.redirect(url);
    }
    return supabaseResponse;
  }

  // Ambil role user yang sedang login
  const { data: profile } = await supabase
    .from("profiles")
    .select("aktif, roles(nama_role)")
    .eq("id_profile", user.id)
    .single();

  const role = (profile?.roles as unknown as { nama_role: string } | null)?.nama_role;

  if (!role || profile?.aktif === false) {
    if (!isPublic) {
      const url = request.nextUrl.clone();
      url.pathname = "/login";
      url.searchParams.set("error", "akun_tidak_aktif");
      return NextResponse.redirect(url);
    }
    return supabaseResponse;
  }

  // User sudah login tapi mengakses /login atau / -> arahkan ke dashboard role-nya
  if (path === "/login" || path === "/") {
    const url = request.nextUrl.clone();
    url.pathname = `${ROLE_PREFIX[role]}/dashboard`;
    return NextResponse.redirect(url);
  }

  // Cegah akses ke prefix role lain (mis. siswa mencoba buka /admin/...)
  const matchedPrefix = Object.entries(ROLE_PREFIX).find(([, prefix]) =>
    path.startsWith(prefix),
  );
  if (matchedPrefix && matchedPrefix[0] !== role) {
    const url = request.nextUrl.clone();
    url.pathname = `${ROLE_PREFIX[role]}/dashboard`;
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}
