/**
 * CAPTCHA Integration Helper
 *
 * Supports hCaptcha and reCAPTCHA verification.
 */

export type CaptchaProvider = "hcaptcha" | "recaptcha";

export interface CaptchaVerificationResult {
  success: boolean;
  challengeTimestamp?: string;
  hostname?: string;
  errorCodes?: string[];
}

export interface CaptchaConfig {
  provider: CaptchaProvider;
  secretKey: string;
  siteKey: string;
}

const VERIFY_URLS: Record<CaptchaProvider, string> = {
  hcaptcha: "https://hcaptcha.com/siteverify",
  recaptcha: "https://www.google.com/recaptcha/api/siteverify",
};

/**
 * Verify a CAPTCHA response token.
 */
export async function verifyCaptcha(
  token: string,
  config: CaptchaConfig
): Promise<CaptchaVerificationResult> {
  if (!token) {
    return {
      success: false,
      errorCodes: ["missing-input-response"],
    };
  }

  if (!config.secretKey) {
    return {
      success: false,
      errorCodes: ["missing-secret-key"],
    };
  }

  const verifyUrl = VERIFY_URLS[config.provider];

  try {
    const formData = new URLSearchParams();
    formData.append("secret", config.secretKey);
    formData.append("response", token);

    const response = await fetch(verifyUrl, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: formData.toString(),
    });

    if (!response.ok) {
      return {
        success: false,
        errorCodes: ["verification-request-failed"],
      };
    }

    const data = await response.json();

    return {
      success: data.success === true,
      challengeTimestamp: data.challenge_ts,
      hostname: data.hostname,
      errorCodes: data["error-codes"] || [],
    };
  } catch {
    return {
      success: false,
      errorCodes: ["verification-network-error"],
    };
  }
}

/**
 * Get the CAPTCHA configuration from environment variables.
 */
export function getCaptchaConfig(): CaptchaConfig {
  return {
    provider: "hcaptcha",
    secretKey: process.env.HCAPTCHA_SECRET || "",
    siteKey: process.env.NEXT_PUBLIC_HCAPTCHA_SITE_KEY || "",
  };
}
