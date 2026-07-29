import { prisma } from './prisma';

/**
 * Returns a valid Etsy access token for the given user.
 * Automatically refreshes the token if it's about to expire.
 */
export async function getValidEtsyToken(userId: string): Promise<string | null> {
  if (!userId) return null;

  const tokenRecord = await prisma.etsyToken.findUnique({ where: { userId } });

  if (!tokenRecord) {
    return null;
  }

  // Check if token is expired or expires within 5 minutes
  if (tokenRecord.expiresAt.getTime() - Date.now() < 5 * 60 * 1000) {
    const clientId = process.env.ETSY_API_KEY;
    if (!clientId) return null;

    try {
      const response = await fetch('https://api.etsy.com/v3/public/oauth/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          grant_type: 'refresh_token',
          client_id: clientId,
          refresh_token: tokenRecord.refreshToken,
        }),
      });

      if (!response.ok) {
        console.error("Failed to refresh Etsy token for user:", userId);
        return null;
      }

      const data = await response.json();
      const expiresAt = new Date(Date.now() + data.expires_in * 1000);

      await prisma.etsyToken.update({
        where: { userId },
        data: {
          accessToken: data.access_token,
          refreshToken: data.refresh_token,
          expiresAt,
        },
      });

      return data.access_token;
    } catch (err) {
      console.error("Error refreshing Etsy token:", err);
      return null;
    }
  }

  return tokenRecord.accessToken;
}

/**
 * Extracts userId from the x-user-id header of a request.
 */
export function getUserIdFromRequest(request: Request): string | null {
  return request.headers.get('x-user-id') || null;
}
