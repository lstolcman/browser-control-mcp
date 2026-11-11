/**
 * Snapshot of Mozilla's "strip on share" query-parameter lists, the data behind
 * Firefox's "Copy Link Without Site Tracking" context-menu action.
 *
 * Fetched 2026-11-11 from
 * https://github.com/mozilla-firefox/firefox (mozilla/gecko-dev/master):
 *   toolkit/components/antitracking/StripOnShareLists/MPL2/StripOnShare.json  (MPL-2.0)
 *   toolkit/components/antitracking/StripOnShareLists/LGPL/StripOnShareLGPL.json  (LGPL-3.0)
 *
 * 43 site rules, 297 listed hosts, 334 parameter names.
 *
 * Firefox's feature consults one more list: the ETP "query parameter
 * stripping" records (Remote Settings, collection `query-stripping`, bucket
 * main), merged into QUERY_STRIPPING below. That is where fbclid, gclid,
 * mc_eid and friends live; they are no longer part of the strip-on-share files.
 * The records' filter expressions are ignored and every stripList is merged,
 * which matches how Firefox behaves for strip-on-share.
 *
 * The rules are copied verbatim so that refreshing the snapshot is a plain
 * re-run of the generator. Deviations from upstream (parameters that are kept
 * because they are functional rather than tracking) are declared separately in
 * KEPT_FUNCTIONAL_PARAMS and applied by strip-tracking.ts at runtime, so they
 * survive a refresh.
 *
 * Upstream model: each rule applies when the *top-level page*'s site is listed
 * in topLevelSites ("*" means every site). This server has no page context for
 * tab and history URLs, so strip-tracking.ts matches the URL's own host instead.
 */

export interface StripRuleGroup {
  /** Query parameter names to remove. */
  queryParams: string[];
  /** Sites (host names) the rule applies to; "*" applies everywhere. */
  topLevelSites: string[];
}

export interface StripOnShareSnapshot {
  global: StripRuleGroup;
  sites: Record<string, StripRuleGroup>;
}

export const MPL2_SNAPSHOT: StripOnShareSnapshot = {
  "global": {
    "queryParams": [
      "li_fat_id",
      "utm_ad",
      "utm_affiliate",
      "utm_brand",
      "utm_campaign",
      "utm_campaignid",
      "utm_channel",
      "utm_cid",
      "utm_content",
      "utm_creative",
      "utm_emcid",
      "utm_emmid",
      "utm_id",
      "utm_id_",
      "utm_keyword",
      "utm_medium",
      "utm_name",
      "utm_place",
      "utm_product",
      "utm_pubreferrer",
      "utm_reader",
      "utm_referrer",
      "utm_serial",
      "utm_session",
      "utm_siteid",
      "utm_social",
      "utm_social-type",
      "utm_source",
      "utm_supplier",
      "utm_swu",
      "utm_term",
      "utm_umguk",
      "utm_userid",
      "utm_viz_id",
      "vero_conv",
      "ymid",
      "var",
      "s_cid",
      "hsa_grp",
      "hsa_cam",
      "hsa_src",
      "hsa_ad",
      "hsa_acc",
      "hsa_kw",
      "hsa_tgt",
      "hsa_ver",
      "hsa_la",
      "hsa_ol",
      "hsa_net",
      "hsa_mt"
    ],
    "topLevelSites": [
      "*"
    ]
  },
  "sites": {
    "twitter": {
      "queryParams": [
        "ref_src",
        "ref_url"
      ],
      "topLevelSites": [
        "www.twitter.com",
        "twitter.com",
        "x.com"
      ]
    },
    "instagram": {
      "queryParams": [
        "igshid",
        "ig_rid"
      ],
      "topLevelSites": [
        "www.instagram.com"
      ]
    },
    "amazon": {
      "queryParams": [
        "__mk_de_DE",
        "aaxitk",
        "content-id",
        "crid",
        "dib",
        "dib_tag",
        "hsa_cr_id",
        "keywords",
        "lp_asins",
        "lp_query",
        "lp_slot",
        "pd_rd_plhdr",
        "pd_rd_r",
        "pd_rd_w",
        "pd_rd_wg",
        "pf_rd_r",
        "pf_rd_p",
        "psc",
        "ref_",
        "sbo",
        "sprefix",
        "s_prefix",
        "sp_csd",
        "sr",
        "store_ref"
      ],
      "topLevelSites": [
        "www.amazon.com",
        "www.amazon.de",
        "www.amazon.nl",
        "www.amazon.fr",
        "www.amazon.co.jp",
        "www.amazon.in",
        "www.amazon.es",
        "www.amazon.ac",
        "www.amazon.cn",
        "www.amazon.eg",
        "www.amazon.in",
        "www.amazon.co.uk",
        "www.amazon.it",
        "www.amazon.pl",
        "www.amazon.sg",
        "www.amazon.ca"
      ]
    },
    "handelsblatt": {
      "queryParams": [
        "share"
      ],
      "topLevelSites": [
        "www.handelsblatt.com"
      ]
    },
    "shopee": {
      "queryParams": [
        "sp_atk",
        "xptdk"
      ],
      "topLevelSites": [
        "shopee.co.id",
        "shopee.tw",
        "shopee.vn",
        "shopee.co.vn",
        "shopee.ph",
        "shopee.com.my",
        "shopee.sg",
        "shopee.com.br",
        "shopee.com.mx",
        "shopee.com.co",
        "shopee.cl"
      ]
    },
    "tokopedia": {
      "queryParams": [
        "extParam"
      ],
      "topLevelSites": [
        "www.tokopedia.com"
      ]
    },
    "spotify": {
      "queryParams": [
        "si"
      ],
      "topLevelSites": [
        "open.spotify.com"
      ]
    },
    "meetup": {
      "queryParams": [
        "eventOrigin",
        "recId",
        "recSource",
        "searchId"
      ],
      "topLevelSites": [
        "www.meetup.com"
      ]
    },
    "facebook": {
      "queryParams": [
        "__cft__[0]",
        "__cft__%5B0%5D",
        "__tn__"
      ],
      "topLevelSites": [
        "www.facebook.com"
      ]
    }
  }
};

export const LGPL_SNAPSHOT: StripOnShareSnapshot = {
  "global": {
    "queryParams": [
      "at_campaign",
      "at_send_date",
      "at_campaign_type",
      "at_recipient_list",
      "at_creation",
      "at_recipient_id",
      "at_emailtype",
      "at_ptr_name",
      "at_link",
      "at_link_id",
      "at_medium",
      "at_link_type",
      "at_link_origin",
      "utm_email",
      "utm_email_id",
      "utm_campaign_id",
      "utm_newsletter_id"
    ],
    "topLevelSites": [
      "*"
    ]
  },
  "sites": {
    "twitter": {
      "queryParams": [
        "refsrc",
        "cxt",
        "s"
      ],
      "topLevelSites": [
        "www.twitter.com",
        "twitter.com",
        "x.com"
      ]
    },
    "amazon": {
      "queryParams": [
        "pd_rd_i",
        "pf_rd_i",
        "pf_rd_m",
        "pf_rd_s",
        "pf_rd_t",
        "pf_rd_w",
        "adgrpid",
        "ascsubtag",
        "creative",
        "creativeASIN",
        "dchild",
        "field-lbr_brands_browse-bin",
        "hvadid",
        "hvbmt",
        "hvdev",
        "hvlocphy",
        "hvnetw",
        "hvrand",
        "hvtargid",
        "hydadcr",
        "initialIssue",
        "ingress",
        "linkCode",
        "linkId",
        "plattr",
        "qid",
        "rdc",
        "refRID",
        "th",
        "ts_id",
        "visitId",
        "vtr",
        "spIA",
        "_encoding",
        "qualifier"
      ],
      "topLevelSites": [
        "www.amazon.com",
        "www.amazon.de",
        "www.amazon.nl",
        "www.amazon.fr",
        "www.amazon.co.jp",
        "www.amazon.in",
        "www.amazon.es",
        "www.amazon.ac",
        "www.amazon.cn",
        "www.amazon.eg",
        "www.amazon.in",
        "www.amazon.co.uk",
        "www.amazon.it",
        "www.amazon.pl",
        "www.amazon.sg",
        "www.amazon.ca"
      ]
    },
    "youtube": {
      "queryParams": [
        "si",
        "feature",
        "kw",
        "pp"
      ],
      "topLevelSites": [
        "www.youtube.com",
        "youtube.com",
        "m.youtube.com",
        "youtu.be"
      ]
    },
    "carousell": {
      "queryParams": [
        "referrer_search_query",
        "referrer_search_query_source",
        "referrer_request_id",
        "referrer_sort_by",
        "referrer_source",
        "referrer_page_type",
        "referrer_category_id",
        "t-source",
        "tap_index",
        "t-referrer_browse_type",
        "t-id"
      ],
      "topLevelSites": [
        "ca.carousell.com",
        "www.carousell.sg",
        "www.carousell.com.hk",
        "us.carousell.com",
        "au.carousell.com"
      ]
    },
    "etsy": {
      "queryParams": [
        "click_sum",
        "ref",
        "click_key",
        "organic_search_click"
      ],
      "topLevelSites": [
        "www.etsy.com"
      ]
    },
    "wikipedia": {
      "queryParams": [
        "wprov"
      ],
      "topLevelSites": [
        "www.wikipedia.org",
        "en.wikipedia.org"
      ]
    },
    "wallstreetjournal": {
      "queryParams": [
        "reflink"
      ],
      "topLevelSites": [
        "www.wsj.com"
      ]
    },
    "theathletic": {
      "queryParams": [
        "source"
      ],
      "topLevelSites": [
        "theathletic.com"
      ]
    },
    "forbes": {
      "queryParams": [
        "sh"
      ],
      "topLevelSites": [
        "www.forbes.com"
      ]
    },
    "bloomberg": {
      "queryParams": [
        "leadSource",
        "sref",
        "srnd"
      ],
      "topLevelSites": [
        "www.bloomberg.com"
      ]
    },
    "tiktok": {
      "queryParams": [
        "share_app_id",
        "share_author_id",
        "tt_from",
        "embed_source",
        "referer_url",
        "refer",
        "is_from_webapp",
        "sender_device",
        "sec_uid",
        "web_id",
        "enter_method",
        "t",
        "q"
      ],
      "topLevelSites": [
        "www.tiktok.com"
      ]
    },
    "bbc": {
      "queryParams": [
        "facebook_page",
        "at_bbc_team",
        "ocid",
        "ns_mchannel",
        "ns_source",
        "ns_campaign",
        "ns_linkname",
        "ns_fee",
        "xtor"
      ],
      "topLevelSites": [
        "www.bbc.com"
      ]
    },
    "cnn": {
      "queryParams": [
        "ref"
      ],
      "topLevelSites": [
        "www.cnn.co.jp",
        "www.cnn.com",
        "edition.cnn.com"
      ]
    },
    "imdb": {
      "queryParams": [
        "pf_rd_p",
        "pf_rd_i",
        "pf_rd_m",
        "pf_rd_s",
        "pf_rd_t",
        "pf_rd_r"
      ],
      "topLevelSites": [
        "www.imdb.com",
        "m.imdb.com"
      ]
    },
    "mirror": {
      "queryParams": [
        "int_source"
      ],
      "topLevelSites": [
        "www.mirror.co.uk"
      ]
    },
    "wise": {
      "queryParams": [
        "partnerizecampaignID",
        "clickref",
        "adref",
        "partnerID"
      ],
      "topLevelSites": [
        "wise.com"
      ]
    },
    "facebook": {
      "queryParams": [
        "tracking",
        "extid",
        "mibextid"
      ],
      "topLevelSites": [
        "www.facebook.com"
      ]
    },
    "lazada": {
      "queryParams": [
        "mkttid",
        "laz_trackid",
        "spm",
        "clickTrackInfo",
        "trafficFrom",
        "scm",
        "acm",
        "ad_src",
        "did",
        "mp",
        "cid",
        "pos"
      ],
      "topLevelSites": [
        "www.lazada.com.ph",
        "www.lazada.vn",
        "www.lazada.sg",
        "www.lazada.com.my",
        "pages.lazada.co.id",
        "www.lazada.co.id"
      ]
    },
    "msn": {
      "queryParams": [
        "cvid",
        "pc",
        "ei"
      ],
      "topLevelSites": [
        "www.msn.com"
      ]
    },
    "aliexpress": {
      "queryParams": [
        "sk",
        "dp",
        "spm",
        "scm",
        "pvid",
        "scm_id",
        "scm-url",
        "utparam",
        "aff_fsk",
        "aff_fcid",
        "terminal_id",
        "aff_trace_key",
        "pdp_npi",
        "aff_short_key",
        "aff_platform",
        "algo_pvid",
        "curPageLogUid",
        "mall_affr",
        "algo_expid",
        "gps-id"
      ],
      "topLevelSites": [
        "www.aliexpress.com",
        "robotime.aliexpress.com",
        "ar.aliexpress.com"
      ]
    },
    "reddit": {
      "queryParams": [
        "ref",
        "ref_source",
        "ref_campaign",
        "correlation_id",
        "share_id"
      ],
      "topLevelSites": [
        "www.reddit.com"
      ]
    },
    "wired": {
      "queryParams": [
        "mbid"
      ],
      "topLevelSites": [
        "www.wired.co.uk",
        "www.wired.com"
      ]
    },
    "yandex": {
      "queryParams": [
        "utm-term",
        "did",
        "from",
        "msid",
        "stid",
        "mlid",
        "persistent_id",
        "source-serpid",
        "suggest_reqid",
        "clid"
      ],
      "topLevelSites": [
        "yandex.com"
      ]
    },
    "ebay": {
      "queryParams": [
        "_trkparms",
        "mkcid",
        "_trksid",
        "mkevt",
        "amdata",
        "ssuid",
        "mkrid",
        "campid",
        "sssrc",
        "ssspo",
        "_from",
        "hash"
      ],
      "topLevelSites": [
        "www.ebay.com",
        "www.ebay.co.uk"
      ]
    },
    "flipkart": {
      "queryParams": [
        "_refId",
        "store",
        "ssid",
        "affid",
        "cid",
        "iid",
        "pwsvid",
        "pageUID",
        "lid"
      ],
      "topLevelSites": [
        "www.flipkart.com"
      ]
    },
    "google": {
      "queryParams": [
        "sca_esv",
        "ved",
        "pcampaignid",
        "rlz",
        "ei",
        "sxsrf",
        "sourceid",
        "aqs",
        "cad",
        "usg",
        "dpr",
        "dcr",
        "sei",
        "cd",
        "vet",
        "esrc",
        "site",
        "gs_l",
        "gs_lp",
        "sclient",
        "oe",
        "visit_id",
        "biw",
        "bih",
        "gs_lcp",
        "gs_lcrp"
      ],
      "topLevelSites": [
        "www.google.com",
        "www.google.ad",
        "www.google.ae",
        "www.google.com.af",
        "www.google.com.ag",
        "www.google.al",
        "www.google.am",
        "www.google.co.ao",
        "www.google.com.ar",
        "www.google.as",
        "www.google.at",
        "www.google.com.au",
        "www.google.az",
        "www.google.ba",
        "www.google.com.bd",
        "www.google.be",
        "www.google.bf",
        "www.google.bg",
        "www.google.com.bh",
        "www.google.bi",
        "www.google.bj",
        "www.google.com.bn",
        "www.google.com.bo",
        "www.google.com.br",
        "www.google.bs",
        "www.google.bt",
        "www.google.co.bw",
        "www.google.by",
        "www.google.com.bz",
        "www.google.ca",
        "www.google.cd",
        "www.google.cf",
        "www.google.cg",
        "www.google.ch",
        "www.google.ci",
        "www.google.co.ck",
        "www.google.cl",
        "www.google.cm",
        "www.google.cn",
        "www.google.com.co",
        "www.google.co.cr",
        "www.google.com.cu",
        "www.google.cv",
        "www.google.com.cy",
        "www.google.cz",
        "www.google.de",
        "www.google.dj",
        "www.google.dk",
        "www.google.dm",
        "www.google.com.do",
        "www.google.dz",
        "www.google.com.ec",
        "www.google.ee",
        "www.google.com.eg",
        "www.google.es",
        "www.google.com.et",
        "www.google.fi",
        "www.google.com.fj",
        "www.google.fm",
        "www.google.fr",
        "www.google.ga",
        "www.google.ge",
        "www.google.gg",
        "www.google.com.gh",
        "www.google.com.gi",
        "www.google.gl",
        "www.google.gm",
        "www.google.gr",
        "www.google.com.gt",
        "www.google.gy",
        "www.google.com.hk",
        "www.google.hn",
        "www.google.hr",
        "www.google.ht",
        "www.google.hu",
        "www.google.co.id",
        "www.google.ie",
        "www.google.co.il",
        "www.google.im",
        "www.google.co.in",
        "www.google.iq",
        "www.google.is",
        "www.google.it",
        "www.google.je",
        "www.google.com.jm",
        "www.google.jo",
        "www.google.co.jp",
        "www.google.co.ke",
        "www.google.com.kh",
        "www.google.ki",
        "www.google.kg",
        "www.google.co.kr",
        "www.google.com.kw",
        "www.google.kz",
        "www.google.la",
        "www.google.com.lb",
        "www.google.li",
        "www.google.lk",
        "www.google.co.ls",
        "www.google.lt",
        "www.google.lu",
        "www.google.lv",
        "www.google.com.ly",
        "www.google.co.ma",
        "www.google.md",
        "www.google.me",
        "www.google.mg",
        "www.google.mk",
        "www.google.ml",
        "www.google.com.mm",
        "www.google.mn",
        "www.google.com.mt",
        "www.google.mu",
        "www.google.mv",
        "www.google.mw",
        "www.google.com.mx",
        "www.google.com.my",
        "www.google.co.mz",
        "www.google.com.na",
        "www.google.com.ng",
        "www.google.com.ni",
        "www.google.ne",
        "www.google.nl",
        "www.google.no",
        "www.google.com.np",
        "www.google.nr",
        "www.google.nu",
        "www.google.co.nz",
        "www.google.com.om",
        "www.google.com.pa",
        "www.google.com.pe",
        "www.google.com.pg",
        "www.google.com.ph",
        "www.google.com.pk",
        "www.google.pl",
        "www.google.pn",
        "www.google.com.pr",
        "www.google.ps",
        "www.google.pt",
        "www.google.com.py",
        "www.google.com.qa",
        "www.google.ro",
        "www.google.ru",
        "www.google.rw",
        "www.google.com.sa",
        "www.google.com.sb",
        "www.google.sc",
        "www.google.se",
        "www.google.com.sg",
        "www.google.sh",
        "www.google.si",
        "www.google.sk",
        "www.google.com.sl",
        "www.google.sn",
        "www.google.so",
        "www.google.sm",
        "www.google.sr",
        "www.google.st",
        "www.google.com.sv",
        "www.google.td",
        "www.google.tg",
        "www.google.co.th",
        "www.google.com.tj",
        "www.google.tl",
        "www.google.tm",
        "www.google.tn",
        "www.google.to",
        "www.google.com.tr",
        "www.google.tt",
        "www.google.com.tw",
        "www.google.co.tz",
        "www.google.com.ua",
        "www.google.co.ug",
        "www.google.co.uk",
        "www.google.com.uy",
        "www.google.co.uz",
        "www.google.com.vc",
        "www.google.co.ve",
        "www.google.co.vi",
        "www.google.com.vn",
        "www.google.vu",
        "www.google.ws",
        "www.google.rs",
        "www.google.co.za",
        "www.google.co.zm",
        "www.google.co.zw",
        "www.google.cat",
        "consent.google.de",
        "support.google.com"
      ]
    },
    "bing": {
      "queryParams": [
        "qp",
        "cvid",
        "qs",
        "form",
        "sk",
        "sc",
        "sp"
      ],
      "topLevelSites": [
        "www.bing.com"
      ]
    },
    "twitch": {
      "queryParams": [
        "tt_content",
        "tt_medium"
      ],
      "topLevelSites": [
        "www.twitch.tv",
        "dev.twitch.tv"
      ]
    },
    "cnet": {
      "queryParams": [
        "ftag"
      ],
      "topLevelSites": [
        "www.cnet.com"
      ]
    },
    "nytimes": {
      "queryParams": [
        "smid"
      ],
      "topLevelSites": [
        "www.nytimes.com"
      ]
    },
    "github": {
      "queryParams": [
        "email_token",
        "email_source"
      ],
      "topLevelSites": [
        "github.com"
      ]
    },
    "linkedin": {
      "queryParams": [
        "refId",
        "trk",
        "trackingId"
      ],
      "topLevelSites": [
        "ca.linkedin.com",
        "ro.linkedin.com"
      ]
    },
    "newyorker": {
      "queryParams": [
        "esrc",
        "bxid",
        "cndid",
        "source",
        "mbid"
      ],
      "topLevelSites": [
        "www.newyorker.com"
      ]
    },
    "bestbuy": {
      "queryParams": [
        "acampID",
        "irclickid",
        "irgwc",
        "loc",
        "mpid",
        "intl"
      ],
      "topLevelSites": [
        "www.bestbuy.com"
      ]
    }
  }
};

/**
 * Parameters that appear in Mozilla's lists but are *functional*, not tracking:
 * removing them changes what the page shows or breaks it outright.
 *
 * Firefox can strip them because "Copy Link Without Site Tracking" produces a
 * link for a human to paste somewhere. This server hands the same link back to
 * the assistant, which may pass it to `open-browser-tab`, so a stripped search
 * query means an empty page.
 *
 * Kept here, in one place, so the deviation from upstream is explicit and
 * survives a snapshot refresh.
 */
export const KEPT_FUNCTIONAL_PARAMS: readonly string[] = [
  // Amazon search results: `keywords` is the query, `field-lbr_brands_browse-bin`
  // is the active brand filter, `dchild` switches the page layout variant.
  "keywords",
  "field-lbr_brands_browse-bin",
  "dchild",
  // TikTok search: `q` is the query.
  "q",
  // Flipkart: `iid` selects the product variant (colour/storage), `store` the shop.
  "iid",
  "store",
  // Best Buy: `loc` is the store used for pickup.
  "loc",
  // Lazada: `pos` is the position in a result list and is read back by the page.
  "pos",
];

/**
 * ETP query-parameter stripping list, fetched 2026-11-11 from
 * https://firefox.settings.services.mozilla.com/v1/buckets/main/collections/query-stripping/records
 *
 * The collection holds several records; their stripLists are merged here and
 * applied to every site. `allowList` holds sites where stripping is skipped.
 */
export const QUERY_STRIPPING: {
  stripList: readonly string[];
  allowList: readonly string[];
} = {
  stripList: [
    "gclid",
    "dclid",
    "msclkid",
    "_openstat",
    "yclid",
    "wickedid",
    "twclid",
    "_hsenc",
    "__hssc",
    "__hstc",
    "__hsfp",
    "hsctatracking",
    "wbraid",
    "gbraid",
    "ysclid",
    "mc_eid",
    "oly_anon_id",
    "oly_enc_id",
    "__s",
    "vero_id",
    "mkt_tok",
    "fbclid",
  ],
  allowList: ["googleadservices.com"],
};
