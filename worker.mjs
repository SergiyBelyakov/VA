const canonicalHost = "valentyna-rokun.com";

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.hostname === "www." + canonicalHost ||
        (url.hostname === canonicalHost && url.protocol === "http:")) {
      url.protocol = "https:";
      url.host = canonicalHost;
      url.port = "";
      return Response.redirect(url.href, 301);
    }

    const asset = await env.ASSETS.fetch(request);
    if (url.hostname.endsWith(".workers.dev")) {
      const preview = new Response(asset.body, asset);
      preview.headers.set("X-Robots-Tag", "noindex");
      return preview;
    }
    return asset;
  }
};
