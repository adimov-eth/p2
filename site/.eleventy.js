const { runtime } = require("nunjucks");

module.exports = function(eleventyConfig) {
  eleventyConfig.addFilter("formatNumber", function(value, locale = "th-TH") {
    if (value === undefined || value === null) {
      return "";
    }
    return Number(value).toLocaleString(locale);
  });

  eleventyConfig.addFilter("formatCurrencyTHB", function(value) {
    if (value === undefined || value === null) {
      return "";
    }
    return new Intl.NumberFormat("th-TH", {
      style: "currency",
      currency: "THB",
      maximumFractionDigits: 0
    }).format(Number(value));
  });

  eleventyConfig.addFilter("formatDate", function(value, locale = "en-GB", options = {}) {
    if (!value) {
      return "";
    }
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) {
      return value;
    }
    const formatter = new Intl.DateTimeFormat(locale, {
      day: "2-digit",
      month: "long",
      year: "numeric",
      ...options
    });
    return formatter.format(date);
  });

  eleventyConfig.addFilter("formatPhone", function(value) {
    if (!value) {
      return "";
    }
    const formatted = String(value).trim().split(/\s+/).join("&nbsp;");
    return new runtime.SafeString(formatted);
  });

  eleventyConfig.addFilter("phoneHref", function(value) {
    if (!value) {
      return "";
    }
    return String(value).replace(/[^\d+]/g, "");
  });

  eleventyConfig.addPassthroughCopy("assets");
  eleventyConfig.addWatchTarget("./assets/");

  eleventyConfig.addWatchTarget("./_data/");
  eleventyConfig.addWatchTarget("./_includes/");

  return {
    dir: {
      input: ".",
      includes: "_includes",
      layouts: "_includes",
      data: "_data",
      output: "_site"
    },
    htmlTemplateEngine: "njk",
    markdownTemplateEngine: "njk",
    templateFormats: ["njk", "md", "html", "11ty.js"]
  };
};
