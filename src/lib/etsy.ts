import { prisma } from './prisma';

export async function getValidEtsyToken(): Promise<string | null> {
  const tokenRecord = await prisma.etsyToken.findUnique({ where: { id: 1 } });
  
  if (!tokenRecord) {
    return null;
  }

  // Check if token is expired or expires within 5 minutes
  if (tokenRecord.expiresAt.getTime() - Date.now() < 5 * 60 * 1000) {
    // Refresh the token
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
        console.error("Failed to refresh Etsy token");
        return null; // Force re-auth
      }

      const data = await response.json();
      const expiresAt = new Date(Date.now() + data.expires_in * 1000);

      await prisma.etsyToken.update({
        where: { id: 1 },
        data: {
          accessToken: data.access_token,
          refreshToken: data.refresh_token,
          expiresAt,
        },
      });

      return data.access_token;
    } catch (err) {
      console.error("Error refreshing token:", err);
      return null;
    }
  }

  return tokenRecord.accessToken;
}
