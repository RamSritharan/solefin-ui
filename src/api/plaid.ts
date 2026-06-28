import apiClient from "./client";

// Minimal typing for the Plaid Link global loaded via the script tag in index.html.
declare global {
  interface Window {
    Plaid: {
      create: (config: {
        token: string;
        onSuccess: (publicToken: string, metadata: unknown) => void;
        onExit?: (err: unknown, metadata: unknown) => void;
      }) => { open: () => void; exit: () => void };
    };
  }
}

/**
 * Sends the Link public_token to the backend, which exchanges it for a
 * permanent access_token and stores it against the user.
 */
export async function itemPublicTokenExchange(
  publicToken: string,
): Promise<void> {
  await apiClient.post("/accounts/plaid/exchange", { publicToken });
}

/**
 * Launches the Plaid Link flow: fetches a link_token from the backend, opens
 * the Link modal, and on success exchanges the public_token for an access_token.
 *
 * @param onLinked Optional callback fired after a bank is successfully linked
 *   (e.g. to refresh the accounts list).
 */
export async function connectBank(onLinked?: () => void): Promise<void> {
  try {
    const { data } = await apiClient.post<{ linkToken: string }>(
      "/accounts/plaid",
    );
    const handler = window.Plaid.create({
      token: data.linkToken,
      onSuccess: async (publicToken) => {
        try {
          await itemPublicTokenExchange(publicToken);
          if (onLinked) onLinked();
        } catch (err) {
          console.error("Failed to exchange public token:", err);
        }
      },
      onExit: (err) => {
        if (err) console.error("Plaid Link exited with error:", err);
      },
    });
    handler.open();
  } catch (err) {
    console.error("Failed to start Plaid Link:", err);
  }
}
