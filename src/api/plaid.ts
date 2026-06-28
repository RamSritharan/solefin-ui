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
 * Launches the Plaid Link flow: fetches a short-lived link_token from the
 * backend (which talks to Plaid with our secret keys), then opens the Link modal.
 *
 * @param onSuccess Called with the public_token once the user links an account.
 *   Pass it to a backend exchange endpoint to obtain a permanent access_token.
 */
export async function connectBank(
  onSuccess?: (publicToken: string) => void,
): Promise<void> {
  try {
    const { data } = await apiClient.post<{ linkToken: string }>(
      "/accounts/plaid",
    );
    const handler = window.Plaid.create({
      token: data.linkToken,
      onSuccess: (publicToken) => {
        if (onSuccess) onSuccess(publicToken);
        else console.log("Plaid public_token:", publicToken);
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
