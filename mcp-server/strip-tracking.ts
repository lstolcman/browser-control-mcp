import {
  KEPT_FUNCTIONAL_PARAMS,
  LGPL_SNAPSHOT,
  MPL2_SNAPSHOT,
  QUERY_STRIPPING,
  type StripOnShareSnapshot,
} from "./strip-tracking-data";

/**
 * Removes tracking query parameters from URLs before they are shown to the
 * assistant, reimplementing Firefox's "Copy Link Without Site Tracking" rules
 * (see strip-tracking-data.ts for the list snapshot and its provenance).
 *
 * Kept as a pure module on purpose: no dependency on `browser.*`, no network,
 * no I/O. That makes the behaviour unit-testable and keeps the extension free
 * of duplicate logic.
 */

/** Environment variable that turns stripping off; anything else means "on". */
export const STRIP_TRACKING_ENV_VAR = "BROWSER_CONTROL_MCP_STRIP_TRACKING";

/**
 * Parameters that mark a URL as signed. Removing anything from such a URL
 * invalidates the signature, so it is passed through untouched.
 * Compared case-insensitively.
 */
const SIGNATURE_PARAMS = new Set([
  "x-amz-signature",
  "x-amz-credential",
  "x-amz-security-token",
  "x-goog-signature",
  "x-goog-credential",
  "signature",
  "sig",
  "hmac",
]);

const KEPT_PARAMS = new Set(KEPT_FUNCTIONAL_PARAMS);

/**
 * Sites where Firefox skips stripping entirely (the `allowList` of the ETP
 * query-stripping records). A host matches when it is the entry itself or a
 * subdomain of it.
 */
const STRIP_ALLOWED_HOSTS = new Set(
  QUERY_STRIPPING.allowList.map((host) => normalizeHost(host))
);

interface StripIndex {
  /** Parameters stripped on every site. */
  globalParams: Set<string>;
  /** Parameters stripped on a specific host. */
  siteParams: Map<string, Set<string>>;
}

const STRIP_INDEX: StripIndex = buildIndex([MPL2_SNAPSHOT, LGPL_SNAPSHOT]);

function buildIndex(snapshots: readonly StripOnShareSnapshot[]): StripIndex {
  const globalParams = new Set<string>();
  const siteParams = new Map<string, Set<string>>();

  // The ETP list applies everywhere; that is where the click identifiers
  // (fbclid, gclid, mc_eid, ...) come from.
  for (const param of QUERY_STRIPPING.stripList) {
    addParam(globalParams, param);
  }

  for (const snapshot of snapshots) {
    for (const param of snapshot.global.queryParams) {
      addParam(globalParams, param);
    }

    for (const rule of Object.values(snapshot.sites)) {
      // A rule can be marked global ("*"), in which case it applies everywhere.
      if (rule.topLevelSites.includes("*")) {
        for (const param of rule.queryParams) {
          addParam(globalParams, param);
        }
        continue;
      }

      for (const site of rule.topLevelSites) {
        for (const host of hostVariants(site)) {
          let params = siteParams.get(host);
          if (!params) {
            params = new Set<string>();
            siteParams.set(host, params);
          }
          for (const param of rule.queryParams) {
            addParam(params, param);
          }
        }
      }
    }
  }

  return { globalParams, siteParams };
}

function addParam(target: Set<string>, param: string): void {
  // Functional parameters are declared once in strip-tracking-data.ts.
  if (KEPT_PARAMS.has(param)) {
    return;
  }
  target.add(param);
}

/**
 * Upstream lists spell out hosts one by one (`www.google.de`, `m.imdb.com`).
 * Links omit the `www.` prefix often enough that registering both spellings is
 * worth it; they are the same site for our purposes.
 */
function hostVariants(site: string): string[] {
  const host = normalizeHost(site);
  if (!host) {
    return [];
  }
  if (host.startsWith("www.")) {
    return [host, host.slice(4)];
  }
  return [host, `www.${host}`];
}

function normalizeHost(host: string): string {
  return host.trim().toLowerCase().replace(/\.$/, "");
}

function isStripAllowed(hostname: string): boolean {
  const host = normalizeHost(hostname);
  for (const allowed of STRIP_ALLOWED_HOSTS) {
    if (host === allowed || host.endsWith(`.${allowed}`)) {
      return true;
    }
  }
  return false;
}

/**
 * Parameter names that are stripped from URLs on `host`, including the global
 * ones. Exposed for tests and debugging.
 */
export function paramsStrippedForHost(host: string): string[] {
  if (isStripAllowed(host)) {
    return [];
  }
  const params = new Set(STRIP_INDEX.globalParams);
  const siteParams = STRIP_INDEX.siteParams.get(normalizeHost(host));
  if (siteParams) {
    for (const param of siteParams) {
      params.add(param);
    }
  }
  return [...params];
}

/**
 * Returns `rawUrl` without its tracking query parameters.
 *
 * - Only `http:` and `https:` URLs are touched; anything else is returned as-is.
 * - The query is rebuilt from its original segments, so untouched parameters
 *   keep their exact bytes (no `+` -> `%20` re-encoding), order and duplicates.
 * - The fragment is preserved; a query left empty is dropped along with its `?`.
 * - Signed URLs and unparseable URLs are returned unchanged.
 */
export function stripTrackingParams(rawUrl: string): string {
  if (!rawUrl) {
    return rawUrl;
  }

  const hashIndex = rawUrl.indexOf("#");
  const fragment = hashIndex === -1 ? "" : rawUrl.slice(hashIndex);
  const beforeFragment =
    hashIndex === -1 ? rawUrl : rawUrl.slice(0, hashIndex);

  const queryIndex = beforeFragment.indexOf("?");
  if (queryIndex === -1) {
    return rawUrl;
  }

  const base = beforeFragment.slice(0, queryIndex);
  const query = beforeFragment.slice(queryIndex + 1);
  if (query === "") {
    return rawUrl;
  }

  let parsed: URL;
  try {
    parsed = new URL(rawUrl);
  } catch {
    return rawUrl;
  }
  if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
    return rawUrl;
  }

  if (isStripAllowed(parsed.hostname)) {
    return rawUrl;
  }

  // Drop empty segments produced by `?&&` or a trailing `&`, so the rebuilt
  // query does not end up with dangling separators.
  const segments = query.split("&").filter((segment) => segment !== "");
  if (segments.some((segment) => isSignatureSegment(segment))) {
    return rawUrl;
  }

  const kept = segments.filter((segment) => !shouldStrip(parsed.hostname, segment));
  if (kept.length === segments.length) {
    return rawUrl;
  }

  const rebuiltQuery = kept.length > 0 ? `?${kept.join("&")}` : "";
  return `${base}${rebuiltQuery}${fragment}`;
}

function shouldStrip(hostname: string, segment: string): boolean {
  const name = paramName(segment);
  if (isStrippedName(STRIP_INDEX.globalParams, name)) {
    return true;
  }
  const siteParams = STRIP_INDEX.siteParams.get(normalizeHost(hostname));
  return siteParams ? isStrippedName(siteParams, name) : false;
}

/**
 * Matches the parameter name as written and its percent-decoded form, so
 * `__cft__%5B0%5D` is caught by the `__cft__[0]` rule.
 */
function isStrippedName(params: Set<string>, name: string): boolean {
  if (params.has(name)) {
    return true;
  }
  const decoded = safeDecode(name);
  return decoded !== name && params.has(decoded);
}

function paramName(segment: string): string {
  const equalsIndex = segment.indexOf("=");
  return equalsIndex === -1 ? segment : segment.slice(0, equalsIndex);
}

function safeDecode(value: string): string {
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}

function isSignatureSegment(segment: string): boolean {
  return SIGNATURE_PARAMS.has(paramName(segment).toLowerCase());
}

/**
 * Stripping is on unless BROWSER_CONTROL_MCP_STRIP_TRACKING is set to a falsey
 * value (`0`, `false`, `no`, `off`, `disabled`). Read per call so tests and
 * long-running processes can toggle it.
 */
export function isTrackingStrippingEnabled(): boolean {
  const raw = process.env[STRIP_TRACKING_ENV_VAR];
  if (raw === undefined || raw.trim() === "") {
    return true;
  }
  return !/^(0|false|no|off|disabled)$/i.test(raw.trim());
}

/**
 * Convenience wrapper for values coming out of the browser extension: leaves
 * `undefined` alone and honours the on/off switch.
 */
export function stripUrlForAgent(url: string | undefined): string | undefined {
  if (!url || !isTrackingStrippingEnabled()) {
    return url;
  }
  return stripTrackingParams(url);
}
