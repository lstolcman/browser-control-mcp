import assert from "node:assert/strict";
import test from "node:test";

import stripTracking from "../dist/strip-tracking.js";

const {
  STRIP_TRACKING_ENV_VAR,
  isTrackingStrippingEnabled,
  paramsStrippedForHost,
  stripTrackingParams,
  stripUrlForAgent,
} = stripTracking;

test("removes global tracking parameters and keeps the rest", () => {
  assert.equal(
    stripTrackingParams(
      "https://example.com/page?id=42&utm_source=newsletter&utm_medium=email&utm_campaign=spring"
    ),
    "https://example.com/page?id=42"
  );
});

test("strips the classic click identifiers that are global", () => {
  assert.equal(
    stripTrackingParams("https://example.com/p?fbclid=abc&gclid=def&mc_eid=1&id=7"),
    "https://example.com/p?id=7"
  );
});

test("keeps parameter order, unknown parameters and duplicates", () => {
  assert.equal(
    stripTrackingParams("https://example.com/p?b=2&fbclid=x&a=1&a=3"),
    "https://example.com/p?b=2&a=1&a=3"
  );
});

test("keeps the fragment untouched", () => {
  assert.equal(
    stripTrackingParams("https://example.com/p?utm_source=x&q=rust#section-2"),
    "https://example.com/p?q=rust#section-2"
  );
});

test("drops the question mark when every parameter is stripped", () => {
  assert.equal(
    stripTrackingParams("https://example.com/p?utm_source=x&fbclid=y"),
    "https://example.com/p"
  );
});

test("returns URLs without a query unchanged", () => {
  for (const url of [
    "https://example.com/p",
    "https://example.com/p#fragment",
    "https://example.com/p?",
  ]) {
    assert.equal(stripTrackingParams(url), url);
  }
});

test("leaves non-http URLs and unparseable input unchanged", () => {
  for (const url of [
    "about:preferences#privacy",
    "file:///C:/page.html?utm_source=x",
    "moz-extension://abc/options.html?utm_source=x",
    "not a url?utm_source=x",
    "",
  ]) {
    assert.equal(stripTrackingParams(url), url);
  }
});

test("applies amazon rules but keeps the search query", () => {
  assert.equal(
    stripTrackingParams(
      "https://www.amazon.com/s?k=laptop&keywords=laptop&crid=2X8&pd_rd_w=abc&ref_=xyz&th=1"
    ),
    "https://www.amazon.com/s?k=laptop&keywords=laptop"
  );
});

test("matches hosts without the www prefix", () => {
  assert.equal(
    stripTrackingParams("https://amazon.com/dp/B0?pd_rd_w=abc&keep=1"),
    "https://amazon.com/dp/B0?keep=1"
  );
});

test("applies tiktok rules but keeps the search query", () => {
  assert.equal(
    stripTrackingParams(
      "https://www.tiktok.com/search?q=python&is_from_webapp=1&lang=en"
    ),
    "https://www.tiktok.com/search?q=python&lang=en"
  );
});

test("keeps the flipkart product variant", () => {
  assert.equal(
    stripTrackingParams(
      "https://www.flipkart.com/phone/p/itm1?pid=MOB1&iid=BLUE&_refId=aff"
    ),
    "https://www.flipkart.com/phone/p/itm1?pid=MOB1&iid=BLUE"
  );
});

test("matches percent-encoded parameter names", () => {
  assert.equal(
    stripTrackingParams(
      "https://www.facebook.com/post?__cft__%5B0%5D=abc&__tn__=x&id=5"
    ),
    "https://www.facebook.com/post?id=5"
  );
  assert.equal(
    stripTrackingParams("https://www.facebook.com/post?__cft__[0]=abc&id=5"),
    "https://www.facebook.com/post?id=5"
  );
});

test("applies the global rules from the LGPL list", () => {
  assert.equal(
    stripTrackingParams(
      "https://example.com/p?at_campaign=x&at_medium=email&keep=1"
    ),
    "https://example.com/p?keep=1"
  );
});

test("only global rules apply on a site without its own rules", () => {
  assert.equal(
    stripTrackingParams("https://example.com/p?pd_rd_w=abc&utm_source=1"),
    "https://example.com/p?pd_rd_w=abc"
  );
});

test("preserves the exact bytes of parameters it keeps", () => {
  assert.equal(
    stripTrackingParams("https://example.com/p?q=a+b%20c&utm_source=x"),
    "https://example.com/p?q=a+b%20c"
  );
});

test("does not touch signed URLs", () => {
  const url =
    "https://bucket.s3.amazonaws.com/file?X-Amz-Signature=abc&utm_source=x&pd_rd_w=y";
  assert.equal(stripTrackingParams(url), url);
});

test("respects the ETP allow list", () => {
  const url = "https://www.googleadservices.com/pagead/aclk?gclid=abc&utm_source=x";
  assert.equal(stripTrackingParams(url), url);
  assert.deepEqual(paramsStrippedForHost("googleadservices.com"), []);
});

test("cleans a real-world google search URL and keeps the query", () => {
  assert.equal(
    stripTrackingParams(
      "https://www.google.com/search?q=rcn+wroclaw&num=10&client=firefox-b-d" +
        "&hs=ag39&sca_esv=75ccb22091282de8&sxsrf=ANbL-n46eME9lP9BB5sSs_c4jEYJszOe5g%3A1771665860928" +
        "&ei=xHmZabSrOIfZwPAPgLi02A8&biw=1741&bih=1045&uact=5&oq=rcn+wroclaw" +
        "&ved=0ahUKEwi0nbTSoeqSAxWHLBAIHQAcDfsQ4dUDCBM&gs_lp=Egxnd3Mtd2l6LXNlcnAiC3JjbiB3cm9jbGF3" +
        "&sclient=gws-wiz-serp&mstk=AUtExf&udm=50#aof=1"
    ),
    "https://www.google.com/search?q=rcn+wroclaw&num=10&client=firefox-b-d" +
      "&hs=ag39&uact=5&oq=rcn+wroclaw&mstk=AUtExf&udm=50#aof=1"
  );
});

test("functional parameters are not in the strip set", () => {
  const amazon = paramsStrippedForHost("www.amazon.com");
  assert.ok(amazon.includes("pd_rd_w"));
  assert.ok(amazon.includes("utm_source"));
  assert.ok(!amazon.includes("keywords"));
  assert.ok(!amazon.includes("dchild"));

  const tiktok = paramsStrippedForHost("www.tiktok.com");
  assert.ok(tiktok.includes("is_from_webapp"));
  assert.ok(!tiktok.includes("q"));
});

test("stripUrlForAgent honours the on/off switch", () => {
  const previous = process.env[STRIP_TRACKING_ENV_VAR];
  const url = "https://example.com/p?utm_source=x&id=1";

  try {
    delete process.env[STRIP_TRACKING_ENV_VAR];
    assert.equal(isTrackingStrippingEnabled(), true);
    assert.equal(stripUrlForAgent(url), "https://example.com/p?id=1");
    assert.equal(stripUrlForAgent(undefined), undefined);

    process.env[STRIP_TRACKING_ENV_VAR] = "false";
    assert.equal(isTrackingStrippingEnabled(), false);
    assert.equal(stripUrlForAgent(url), url);

    process.env[STRIP_TRACKING_ENV_VAR] = "true";
    assert.equal(stripUrlForAgent(url), "https://example.com/p?id=1");
  } finally {
    if (previous === undefined) {
      delete process.env[STRIP_TRACKING_ENV_VAR];
    } else {
      process.env[STRIP_TRACKING_ENV_VAR] = previous;
    }
  }
});
