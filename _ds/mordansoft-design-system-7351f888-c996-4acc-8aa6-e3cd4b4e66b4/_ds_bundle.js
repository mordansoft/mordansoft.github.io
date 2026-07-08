/* @ds-bundle: {"format":3,"namespace":"MordanSoftDesignSystem_7351f8","components":[{"name":"Badge","sourcePath":"components/core/Badge.jsx"},{"name":"Button","sourcePath":"components/core/Button.jsx"},{"name":"Card","sourcePath":"components/core/Card.jsx"},{"name":"Eyebrow","sourcePath":"components/core/Eyebrow.jsx"},{"name":"IconButton","sourcePath":"components/core/IconButton.jsx"},{"name":"Input","sourcePath":"components/core/Input.jsx"},{"name":"StatusDot","sourcePath":"components/core/StatusDot.jsx"},{"name":"Switch","sourcePath":"components/core/Switch.jsx"},{"name":"Tabs","sourcePath":"components/core/Tabs.jsx"},{"name":"Tag","sourcePath":"components/core/Tag.jsx"}],"sourceHashes":{"components/core/Badge.jsx":"cc8320ae1a28","components/core/Button.jsx":"3b32307df404","components/core/Card.jsx":"8ef7eeb81728","components/core/Eyebrow.jsx":"9d2c5ca784e9","components/core/IconButton.jsx":"3fb4402fa983","components/core/Input.jsx":"ee70f8b2d1c8","components/core/StatusDot.jsx":"f8209d6a4f7c","components/core/Switch.jsx":"812b127ee016","components/core/Tabs.jsx":"f778f996e4f4","components/core/Tag.jsx":"a87be5152e1f","ui_kits/site/AppDetail.jsx":"c68de7fdad13","ui_kits/site/LegalDoc.jsx":"d8d0aafd1813","ui_kits/site/app.jsx":"50aa42b6a72b","ui_kits/site/assets.jsx":"2c89f9fd2d05","ui_kits/site/sections.jsx":"32ff9c92aac7"},"inlinedExternals":[],"unexposedExports":[]} */

(() => {

const __ds_ns = (window.MordanSoftDesignSystem_7351f8 = window.MordanSoftDesignSystem_7351f8 || {});

const __ds_scope = {};

(__ds_ns.__errors = __ds_ns.__errors || []);

// components/core/Badge.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/** Badge — small status label. Quiet semantic colors against the grey base. */
function Badge({
  tone = "neutral",
  dot = false,
  className = "",
  children,
  ...rest
}) {
  const cls = ["ms-badge", `ms-badge--${tone}`, className].filter(Boolean).join(" ");
  return /*#__PURE__*/React.createElement("span", _extends({
    className: cls
  }, rest), dot ? /*#__PURE__*/React.createElement("span", {
    className: "ms-badge__dot"
  }) : null, children);
}
Object.assign(__ds_scope, { Badge });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Badge.jsx", error: String((e && e.message) || e) }); }

// components/core/Button.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Button — solid filled primary actions; secondary/ghost/link for the rest.
 * Renders as <button> or, when `href` is set, as <a>.
 */
function Button({
  variant = "primary",
  size = "md",
  href,
  iconLeft,
  iconRight,
  block = false,
  disabled = false,
  type = "button",
  className = "",
  children,
  ...rest
}) {
  const cls = ["ms-btn", `ms-btn--${variant}`, size === "sm" ? "ms-btn--sm" : size === "lg" ? "ms-btn--lg" : "", block ? "ms-btn--block" : "", className].filter(Boolean).join(" ");
  const inner = /*#__PURE__*/React.createElement(React.Fragment, null, iconLeft ? /*#__PURE__*/React.createElement("span", {
    className: "ms-btn__icon"
  }, iconLeft) : null, children ? /*#__PURE__*/React.createElement("span", null, children) : null, iconRight ? /*#__PURE__*/React.createElement("span", {
    className: "ms-btn__icon"
  }, iconRight) : null);
  if (href && !disabled) {
    return /*#__PURE__*/React.createElement("a", _extends({
      className: cls,
      href: href
    }, rest), inner);
  }
  return /*#__PURE__*/React.createElement("button", _extends({
    className: cls,
    type: type,
    disabled: disabled
  }, rest), inner);
}
Object.assign(__ds_scope, { Button });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Button.jsx", error: String((e && e.message) || e) }); }

// components/core/Card.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Card — the primary grouping container. Use over flat lists when grouping
 * is meaningful. Convenience props cover the common case; pass `children`
 * for full control of the body.
 */
function Card({
  variant = "default",
  interactive = false,
  eyebrow,
  title,
  text,
  media,
  footer,
  href,
  className = "",
  children,
  ...rest
}) {
  const cls = ["ms-card", variant === "flat" ? "ms-card--flat" : variant === "raised" ? "ms-card--raised" : "", interactive || href ? "ms-card--interactive" : "", className].filter(Boolean).join(" ");
  const body = title || text || eyebrow ? /*#__PURE__*/React.createElement("div", {
    className: "ms-card__body"
  }, eyebrow ? /*#__PURE__*/React.createElement("span", {
    className: "ms-eyebrow"
  }, eyebrow) : null, title ? /*#__PURE__*/React.createElement("h3", {
    className: "ms-card__title"
  }, title) : null, text ? /*#__PURE__*/React.createElement("p", {
    className: "ms-card__text"
  }, text) : null, children) : children;
  const content = /*#__PURE__*/React.createElement(React.Fragment, null, media ? /*#__PURE__*/React.createElement("div", {
    className: "ms-card__media"
  }, media) : null, body, footer ? /*#__PURE__*/React.createElement("div", {
    className: "ms-card__footer"
  }, footer) : null);
  if (href) {
    return /*#__PURE__*/React.createElement("a", _extends({
      className: cls,
      href: href
    }, rest), content);
  }
  return /*#__PURE__*/React.createElement("div", _extends({
    className: cls
  }, rest), content);
}
Object.assign(__ds_scope, { Card });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Card.jsx", error: String((e && e.message) || e) }); }

// components/core/Eyebrow.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/** Eyebrow — mono overline / kicker above headings. Accent or muted. */
function Eyebrow({
  tone = "muted",
  as = "span",
  className = "",
  children,
  ...rest
}) {
  const Comp = as;
  const cls = ["ms-eyebrow", className].filter(Boolean).join(" ");
  const style = tone === "accent" ? {
    color: "var(--accent-text)"
  } : undefined;
  return /*#__PURE__*/React.createElement(Comp, _extends({
    className: cls,
    style: style
  }, rest), children);
}
Object.assign(__ds_scope, { Eyebrow });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Eyebrow.jsx", error: String((e && e.message) || e) }); }

// components/core/IconButton.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/** IconButton — a square, label-less control wrapping a single icon. */
function IconButton({
  size = "md",
  bordered = false,
  label,
  className = "",
  children,
  ...rest
}) {
  const cls = ["ms-iconbtn", size === "sm" ? "ms-iconbtn--sm" : "", bordered ? "ms-iconbtn--bordered" : "", className].filter(Boolean).join(" ");
  return /*#__PURE__*/React.createElement("button", _extends({
    className: cls,
    type: "button",
    "aria-label": label
  }, rest), children);
}
Object.assign(__ds_scope, { IconButton });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/IconButton.jsx", error: String((e && e.message) || e) }); }

// components/core/Input.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Input — text field with optional label, hint, and error. Set `multiline`
 * for a textarea. Wraps itself in a labelled field when `label` is present.
 */
function Input({
  label,
  hint,
  error,
  multiline = false,
  mono = false,
  id,
  className = "",
  ...rest
}) {
  const inputId = id || (label ? `ms-input-${Math.random().toString(36).slice(2, 8)}` : undefined);
  const inputCls = ["ms-input", mono ? "ms-input--mono" : "", className].filter(Boolean).join(" ");
  const invalid = Boolean(error);
  const control = multiline ? /*#__PURE__*/React.createElement("textarea", _extends({
    id: inputId,
    className: inputCls,
    "aria-invalid": invalid
  }, rest)) : /*#__PURE__*/React.createElement("input", _extends({
    id: inputId,
    className: inputCls,
    "aria-invalid": invalid
  }, rest));
  if (!label && !hint && !error) return control;
  return /*#__PURE__*/React.createElement("div", {
    className: "ms-field"
  }, label ? /*#__PURE__*/React.createElement("label", {
    className: "ms-field__label",
    htmlFor: inputId
  }, label) : null, control, error ? /*#__PURE__*/React.createElement("span", {
    className: "ms-field__error"
  }, error) : hint ? /*#__PURE__*/React.createElement("span", {
    className: "ms-field__hint"
  }, hint) : null);
}
Object.assign(__ds_scope, { Input });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Input.jsx", error: String((e && e.message) || e) }); }

// components/core/StatusDot.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/** StatusDot — a colored dot with optional label; `live` adds a soft pulse. */
function StatusDot({
  status = "neutral",
  live = false,
  className = "",
  children,
  ...rest
}) {
  const cls = ["ms-statusdot", `ms-statusdot--${status}`, live ? "ms-statusdot--live" : "", className].filter(Boolean).join(" ");
  return /*#__PURE__*/React.createElement("span", _extends({
    className: cls
  }, rest), /*#__PURE__*/React.createElement("span", {
    className: "ms-statusdot__dot"
  }), children ? /*#__PURE__*/React.createElement("span", null, children) : null);
}
Object.assign(__ds_scope, { StatusDot });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/StatusDot.jsx", error: String((e && e.message) || e) }); }

// components/core/Switch.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/** Switch — a controlled on/off toggle. Pass `checked` and `onChange`. */
function Switch({
  checked = false,
  onChange,
  disabled = false,
  label,
  className = "",
  ...rest
}) {
  const cls = ["ms-switch", className].filter(Boolean).join(" ");
  const toggle = () => {
    if (!disabled && onChange) onChange(!checked);
  };
  return /*#__PURE__*/React.createElement("span", _extends({
    className: cls,
    role: "switch",
    "aria-checked": checked,
    "aria-disabled": disabled || undefined,
    tabIndex: disabled ? -1 : 0,
    onClick: toggle,
    onKeyDown: e => {
      if (e.key === " " || e.key === "Enter") {
        e.preventDefault();
        toggle();
      }
    }
  }, rest), /*#__PURE__*/React.createElement("span", {
    className: "ms-switch__track"
  }, /*#__PURE__*/React.createElement("span", {
    className: "ms-switch__thumb"
  })), label ? /*#__PURE__*/React.createElement("span", {
    className: "ms-switch__label"
  }, label) : null);
}
Object.assign(__ds_scope, { Switch });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Switch.jsx", error: String((e && e.message) || e) }); }

// components/core/Tabs.jsx
try { (() => {
/** Tabs — controlled. `items` is [{ id, label }]; `value` is the active id. */
function Tabs({
  items = [],
  value,
  onChange,
  variant = "underline",
  className = ""
}) {
  const cls = ["ms-tabs", variant === "pill" ? "ms-tabs--pill" : "", className].filter(Boolean).join(" ");
  return /*#__PURE__*/React.createElement("div", {
    className: cls,
    role: "tablist"
  }, items.map(it => /*#__PURE__*/React.createElement("button", {
    key: it.id,
    className: "ms-tab",
    role: "tab",
    type: "button",
    "aria-selected": value === it.id,
    onClick: () => onChange && onChange(it.id)
  }, it.label)));
}
Object.assign(__ds_scope, { Tabs });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Tabs.jsx", error: String((e && e.message) || e) }); }

// components/core/Tag.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/** Tag — pill-shaped chip for taxonomies: tech stack, categories, platforms. */
function Tag({
  variant = "default",
  dot = false,
  onRemove,
  className = "",
  children,
  ...rest
}) {
  const cls = ["ms-tag", variant === "accent" ? "ms-tag--accent" : variant === "solid" ? "ms-tag--solid" : "", onRemove ? "ms-tag--removable" : "", className].filter(Boolean).join(" ");
  return /*#__PURE__*/React.createElement("span", _extends({
    className: cls
  }, rest), dot ? /*#__PURE__*/React.createElement("span", {
    className: "ms-tag__dot"
  }) : null, children, onRemove ? /*#__PURE__*/React.createElement("span", {
    className: "ms-tag__x",
    role: "button",
    "aria-label": "Remove",
    tabIndex: 0,
    onClick: onRemove
  }, /*#__PURE__*/React.createElement("svg", {
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2.2",
    strokeLinecap: "round"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M6 6l12 12M18 6L6 18"
  }))) : null);
}
Object.assign(__ds_scope, { Tag });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Tag.jsx", error: String((e && e.message) || e) }); }

// ui_kits/site/AppDetail.jsx
try { (() => {
/* global React, Icon */
// Product landing page — a focused page for a single app.

function PhoneMock({
  app
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: "phone",
    "aria-hidden": "true"
  }, /*#__PURE__*/React.createElement("div", {
    className: "phone__notch"
  }), /*#__PURE__*/React.createElement("div", {
    className: "phone__screen"
  }, /*#__PURE__*/React.createElement("div", {
    className: "tally"
  }, /*#__PURE__*/React.createElement("div", {
    className: "tally__bar"
  }, /*#__PURE__*/React.createElement("span", {
    className: "ms-eyebrow",
    style: {
      fontSize: 10
    }
  }, app.name), /*#__PURE__*/React.createElement(Icon, {
    name: "more-horizontal",
    size: 16
  })), /*#__PURE__*/React.createElement("div", {
    className: "tally__count"
  }, /*#__PURE__*/React.createElement("span", {
    className: "tally__label"
  }, "Laps"), /*#__PURE__*/React.createElement("span", {
    className: "tally__n"
  }, "128"), /*#__PURE__*/React.createElement("span", {
    className: "tally__sub"
  }, "+3 today")), /*#__PURE__*/React.createElement("div", {
    className: "tally__pad"
  }, /*#__PURE__*/React.createElement("button", {
    className: "tally__btn tally__btn--minus"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "minus",
    size: 22
  })), /*#__PURE__*/React.createElement("button", {
    className: "tally__btn tally__btn--plus"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "plus",
    size: 26
  }))))));
}
function AppDetail({
  app,
  onBack
}) {
  const features = [{
    icon: "wifi-off",
    t: "Works fully offline",
    d: "Tap, count, and review with the network off. Nothing is uploaded."
  }, {
    icon: "database",
    t: "Real storage underneath",
    d: "Counts persist in a local database — survive restarts, exports to CSV."
  }, {
    icon: "vibrate",
    t: "Pocket-readable haptics",
    d: "Distinct taps for increment, reset, and milestone — felt, not seen."
  }, {
    icon: "lock",
    t: "No account required",
    d: "Open it and start. No sign-up, no email, no recovery flow to forget."
  }];
  return /*#__PURE__*/React.createElement("div", {
    className: "detail"
  }, /*#__PURE__*/React.createElement("section", {
    className: "detail-hero ms-geo"
  }, /*#__PURE__*/React.createElement("div", {
    className: "hero__field",
    "aria-hidden": "true"
  }, /*#__PURE__*/React.createElement("div", {
    className: "hero__wash hero__wash--a",
    "data-parallax": "0.12"
  })), /*#__PURE__*/React.createElement("div", {
    className: "ms-container detail-hero__inner"
  }, /*#__PURE__*/React.createElement("button", {
    className: "ms-btn ms-btn--link detail__back",
    onClick: onBack
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "arrow-left",
    size: 15
  }), " All apps"), /*#__PURE__*/React.createElement("div", {
    className: "detail-hero__grid"
  }, /*#__PURE__*/React.createElement("div", {
    className: "detail-hero__copy",
    "data-reveal": true
  }, /*#__PURE__*/React.createElement("span", {
    className: "detail__tile",
    dangerouslySetInnerHTML: {
      __html: TILE_SVG
    }
  }), /*#__PURE__*/React.createElement("h1", {
    className: "detail__title"
  }, app.name), /*#__PURE__*/React.createElement("p", {
    className: "detail__tagline"
  }, app.tagline), /*#__PURE__*/React.createElement("p", {
    className: "detail__blurb"
  }, app.blurb), /*#__PURE__*/React.createElement("div", {
    className: "detail__tags"
  }, app.platforms.map(p => /*#__PURE__*/React.createElement("span", {
    className: "ms-tag ms-tag--accent",
    key: p
  }, p)), app.stack.map(s => /*#__PURE__*/React.createElement("span", {
    className: "ms-tag",
    key: s
  }, s))), /*#__PURE__*/React.createElement("div", {
    className: "detail__cta"
  }, /*#__PURE__*/React.createElement("a", {
    className: "ms-btn ms-btn--primary ms-btn--lg",
    href: "#"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "apple",
    size: 18
  }), " App Store"), app.platforms.includes("Android") && /*#__PURE__*/React.createElement("a", {
    className: "ms-btn ms-btn--secondary ms-btn--lg",
    href: "#"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "play",
    size: 18
  }), " Google Play")), /*#__PURE__*/React.createElement("div", {
    className: "detail__specs"
  }, /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement("b", null, app.size), " download"), /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement("b", null, "v", app.version)), /*#__PURE__*/React.createElement("span", null, "requires ", /*#__PURE__*/React.createElement("b", null, app.since)))), /*#__PURE__*/React.createElement("div", {
    className: "detail-hero__mock",
    "data-reveal": true,
    "data-reveal-delay": "2"
  }, /*#__PURE__*/React.createElement(PhoneMock, {
    app: app
  }))))), /*#__PURE__*/React.createElement("section", {
    className: "section"
  }, /*#__PURE__*/React.createElement("div", {
    className: "ms-container"
  }, /*#__PURE__*/React.createElement("div", {
    className: "section__head",
    "data-reveal": true
  }, /*#__PURE__*/React.createElement("span", {
    className: "ms-eyebrow"
  }, "// What it does"), /*#__PURE__*/React.createElement("h2", {
    className: "section__title"
  }, "Built to stay small")), /*#__PURE__*/React.createElement("div", {
    className: "detail-features"
  }, features.map((f, i) => /*#__PURE__*/React.createElement("div", {
    className: "ms-card ms-card--pad feature",
    "data-reveal": true,
    "data-reveal-delay": i % 2 + 1,
    key: f.t
  }, /*#__PURE__*/React.createElement("span", {
    className: "feature__icon"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: f.icon,
    size: 20
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h3", {
    className: "feature__title"
  }, f.t), /*#__PURE__*/React.createElement("p", {
    className: "feature__text"
  }, f.d))))))), /*#__PURE__*/React.createElement("section", {
    className: "section section--inverse detail-close"
  }, /*#__PURE__*/React.createElement("div", {
    className: "ms-container ms-container--narrow",
    "data-reveal": true
  }, /*#__PURE__*/React.createElement("h2", {
    className: "detail-close__title"
  }, "No catch. No subscription."), /*#__PURE__*/React.createElement("p", {
    className: "detail-close__text"
  }, app.name, " is a one-time purchase. Updates are free, the data is yours, and there is nothing to cancel."), /*#__PURE__*/React.createElement("a", {
    className: "ms-btn ms-btn--primary ms-btn--lg",
    href: "#"
  }, "Get ", app.name, " ", /*#__PURE__*/React.createElement(Icon, {
    name: "arrow-right",
    size: 16
  })))));
}
Object.assign(window, {
  AppDetail,
  PhoneMock
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/site/AppDetail.jsx", error: String((e && e.message) || e) }); }

// ui_kits/site/LegalDoc.jsx
try { (() => {
/* global React */
// Legal document — Privacy policy rendered natively in the system.
// Strong type hierarchy, reading measure, mono section markers, sticky TOC.

const LEGAL_SECTIONS = [{
  id: "summary",
  n: "00",
  t: "The short version",
  body: ["MordanSoft apps do not collect personal data. There is no account to create, no analytics SDK, and no third-party tracker in any app we ship. What happens on your device stays on your device.", "This page explains that in full, in plain language. If a future app needs to handle data differently, we will say so on that app's page before you install it."],
  callout: "No accounts · No analytics · No ad identifiers · No data sale."
}, {
  id: "collect",
  n: "01",
  t: "What we collect",
  body: ["Nothing, by default. Our apps run entirely on your device and do not transmit usage data, identifiers, or content to us or to anyone else.", "If you choose to email us for support, we receive the contents of that email and your address — used only to reply. We do not add you to any list."]
}, {
  id: "device",
  n: "02",
  t: "Data on your device",
  body: ["Apps store their own data locally — counts, settings, logs — in the app's private storage. This data is yours. You can export or delete it from within each app, and removing the app removes it.", "We never receive a copy of this data and cannot recover it for you. Offline-first means the device is the source of truth."]
}, {
  id: "stores",
  n: "03",
  t: "App stores",
  body: ["When you download an app, Apple or Google processes the transaction and may share aggregate, anonymised metrics with us — download counts and crash reports, for example. That data is governed by their privacy policies, not ours, and never identifies you to us."]
}, {
  id: "children",
  n: "04",
  t: "Children",
  body: ["Our apps are suitable for general audiences and collect no data, so they impose no age-gated data handling. We do not knowingly collect information from anyone, of any age."]
}, {
  id: "changes",
  n: "05",
  t: "Changes",
  body: ["If this policy changes, the date below updates and the previous version remains available in our public repository. Material changes affecting a specific app will be noted on that app's page."]
}];
function LegalDoc({
  onBack
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: "legal"
  }, /*#__PURE__*/React.createElement("div", {
    className: "ms-container legal__wrap"
  }, /*#__PURE__*/React.createElement("aside", {
    className: "legal__toc"
  }, /*#__PURE__*/React.createElement("button", {
    className: "ms-btn ms-btn--link legal__back",
    onClick: onBack
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "arrow-left",
    size: 15
  }), " Back"), /*#__PURE__*/React.createElement("span", {
    className: "ms-eyebrow"
  }, "// Contents"), /*#__PURE__*/React.createElement("nav", {
    className: "legal__tocnav"
  }, LEGAL_SECTIONS.map(s => /*#__PURE__*/React.createElement("a", {
    href: "#" + s.id,
    key: s.id
  }, /*#__PURE__*/React.createElement("span", {
    className: "legal__tocn"
  }, s.n), s.t))), /*#__PURE__*/React.createElement("div", {
    className: "legal__updated"
  }, /*#__PURE__*/React.createElement("span", {
    className: "ms-badge ms-badge--neutral"
  }, "Updated 12 Jun 2026"))), /*#__PURE__*/React.createElement("article", {
    className: "legal__body"
  }, /*#__PURE__*/React.createElement("header", {
    className: "legal__header"
  }, /*#__PURE__*/React.createElement("span", {
    className: "ms-eyebrow",
    style: {
      color: "var(--accent-text)"
    }
  }, "// Legal"), /*#__PURE__*/React.createElement("h1", {
    className: "legal__title"
  }, "Privacy Policy"), /*#__PURE__*/React.createElement("p", {
    className: "legal__standfirst"
  }, "How MordanSoft handles your data across every app and surface. The honest answer is: we don't handle it, because we don't collect it."), /*#__PURE__*/React.createElement("div", {
    className: "legal__metarow"
  }, /*#__PURE__*/React.createElement("span", {
    className: "ms-tag"
  }, "Effective 12 Jun 2026"), /*#__PURE__*/React.createElement("span", {
    className: "ms-tag"
  }, "Applies to all apps"))), LEGAL_SECTIONS.map(s => /*#__PURE__*/React.createElement("section", {
    className: "legal__section",
    id: s.id,
    key: s.id
  }, /*#__PURE__*/React.createElement("h2", {
    className: "legal__h2"
  }, /*#__PURE__*/React.createElement("span", {
    className: "legal__h2n"
  }, s.n), s.t), s.body.map((p, i) => /*#__PURE__*/React.createElement("p", {
    className: "legal__p",
    key: i
  }, p)), s.callout ? /*#__PURE__*/React.createElement("p", {
    className: "legal__callout"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "shield-check",
    size: 16
  }), s.callout) : null)), /*#__PURE__*/React.createElement("footer", {
    className: "legal__foot"
  }, /*#__PURE__*/React.createElement("p", null, "Questions about this policy? Email ", /*#__PURE__*/React.createElement("a", {
    href: "#"
  }, "privacy@mordansoft.dev"), ".")))));
}
Object.assign(window, {
  LegalDoc,
  LEGAL_SECTIONS
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/site/LegalDoc.jsx", error: String((e && e.message) || e) }); }

// ui_kits/site/app.jsx
try { (() => {
/* global React, ReactDOM, Header, Hero, Apps, Principles, Studio, Footer, AppDetail, LegalDoc, APPS */
const {
  useState,
  useEffect,
  useRef,
  useCallback
} = React;
function refreshIcons() {
  if (window.lucide && window.lucide.createIcons) {
    window.lucide.createIcons({
      attrs: {
        "stroke-width": 2,
        width: "1em",
        height: "1em"
      }
    });
  }
}

// Parallax wiring + icon refresh, re-run whenever the route changes.
// Reveal is handled entirely in CSS (one-shot entrance animation), so this
// never needs to touch element visibility.
function useStageEffects(route) {
  useEffect(() => {
    refreshIcons();
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let raf = 0;
    const parallax = Array.from(document.querySelectorAll("[data-parallax]"));
    const onScroll = () => {
      if (reduce || !parallax.length) return;
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const y = window.scrollY || 0;
        parallax.forEach(el => {
          const f = parseFloat(el.getAttribute("data-parallax")) || 0;
          el.style.transform = `translate3d(0, ${(-y * f).toFixed(1)}px, 0)`;
        });
      });
    };
    window.addEventListener("scroll", onScroll, {
      passive: true
    });
    onScroll();
    // icons can mount a frame late (lucide UMD); refresh once more
    const t = setTimeout(refreshIcons, 60);
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
      clearTimeout(t);
    };
  }, [route.name, route.app && route.app.id]);
}
function App() {
  const [theme, setTheme] = useState(() => {
    const m = window.matchMedia("(prefers-color-scheme: dark)").matches;
    return m ? "dark" : "light";
  });
  const [route, setRoute] = useState({
    name: "home"
  });
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [route.name, route.app && route.app.id]);
  useStageEffects(route);
  const nav = useCallback(r => setRoute(r), []);
  const toggleTheme = () => setTheme(t => t === "dark" ? "light" : "dark");
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Header, {
    theme: theme,
    onToggleTheme: toggleTheme,
    onNav: nav,
    route: route
  }), /*#__PURE__*/React.createElement("main", null, route.name === "home" && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Hero, {
    onNav: nav
  }), /*#__PURE__*/React.createElement(Apps, {
    onOpen: app => nav({
      name: "detail",
      app
    })
  }), /*#__PURE__*/React.createElement(Principles, null), /*#__PURE__*/React.createElement(Studio, null)), route.name === "detail" && /*#__PURE__*/React.createElement(AppDetail, {
    app: route.app,
    onBack: () => nav({
      name: "home"
    })
  }), route.name === "legal" && /*#__PURE__*/React.createElement(LegalDoc, {
    onBack: () => nav({
      name: "home"
    })
  })), /*#__PURE__*/React.createElement(Footer, {
    onNav: nav
  }));
}
ReactDOM.createRoot(document.getElementById("root")).render(/*#__PURE__*/React.createElement(App, null));
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/site/app.jsx", error: String((e && e.message) || e) }); }

// ui_kits/site/assets.jsx
try { (() => {
/* Inline SVG strings so the mark inherits currentColor (themeable),
   and the app tile stays self-contained. Shared across screens. */

window.MARK_SVG = `
<svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
  <rect x="6" y="10" width="26" height="26" rx="7" fill="currentColor" opacity="0.22"/>
  <rect x="12" y="14" width="26" height="26" rx="7" fill="currentColor" opacity="0.45"/>
  <rect x="18" y="18" width="24" height="24" rx="7" fill="#E0632C"/>
  <rect x="24" y="24" width="12" height="12" rx="3.5" fill="#000" opacity="0.16"/>
</svg>`;
window.TILE_SVG = `
<svg viewBox="0 0 96 96" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
  <defs>
    <linearGradient id="t-ember" x1="40" y1="34" x2="74" y2="74" gradientUnits="userSpaceOnUse">
      <stop offset="0" stop-color="#EE7A41"/><stop offset="1" stop-color="#D4561F"/>
    </linearGradient>
  </defs>
  <rect x="22" y="24" width="34" height="34" rx="9" fill="#FFFFFF" opacity="0.22"/>
  <rect x="30" y="30" width="34" height="34" rx="9" fill="#FFFFFF" opacity="0.45"/>
  <rect x="38" y="36" width="34" height="34" rx="9" fill="url(#t-ember)"/>
  <rect x="46" y="44" width="18" height="18" rx="5" fill="#000" opacity="0.18"/>
</svg>`;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/site/assets.jsx", error: String((e && e.message) || e) }); }

// ui_kits/site/sections.jsx
try { (() => {
/* global React */
// MordanSoft marketing site — section components.
// Uses the design-system CSS classes (.ms-btn, .ms-card, .ms-tag …) so it
// composes the real primitives' styling. Exported to window for app.jsx.

function scrollToId(id) {
  const el = document.getElementById(id);
  if (!el) return;
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const top = el.getBoundingClientRect().top + window.scrollY - 72;
  window.scrollTo({
    top,
    behavior: reduce ? "auto" : "smooth"
  });
}
function Icon({
  name,
  size = 18,
  stroke = 2,
  style
}) {
  // Lucide: rendered as a placeholder <i>, swapped to SVG by lucide.createIcons()
  return /*#__PURE__*/React.createElement("i", {
    "data-lucide": name,
    style: {
      width: size,
      height: size,
      strokeWidth: stroke,
      ...style
    }
  });
}
const APPS = [{
  id: "tally",
  name: "Tally",
  tagline: "A counter that survives airplane mode.",
  platforms: ["iOS", "Android"],
  stack: ["Swift", "Kotlin"],
  status: "shipping",
  blurb: "Count anything — laps, inventory, birds. Local-only, no account, no sync server. Your taps never leave the device.",
  size: "1.8 MB",
  version: "2.4.0",
  since: "iOS 16",
  hue: 1
}, {
  id: "plumb",
  name: "Plumb",
  tagline: "Level and angle, from the phone you carry.",
  platforms: ["iOS"],
  stack: ["Swift", "CoreMotion"],
  status: "shipping",
  blurb: "A spirit level and protractor built on raw sensor data. Calibrates in two taps and reads true to a tenth of a degree.",
  size: "1.2 MB",
  version: "1.6.0",
  since: "iOS 16",
  hue: 2
}, {
  id: "ledger",
  name: "Ledger",
  tagline: "Expenses that stay on your phone.",
  platforms: ["iOS", "Android"],
  stack: ["Swift", "SQLite"],
  status: "beta",
  blurb: "A plain-text expense log with a real database underneath. Export to CSV anytime. No cloud, no subscription, no upsell.",
  size: "2.1 MB",
  version: "0.9.0",
  since: "iOS 16",
  hue: 3
}, {
  id: "cadence",
  name: "Cadence",
  tagline: "Interval timing without the noise.",
  platforms: ["iOS", "Android"],
  stack: ["Kotlin", "Swift"],
  status: "soon",
  blurb: "Build interval sets, run them offline, keep the screen honest. Haptics you can feel through a pocket.",
  size: "1.4 MB",
  version: "—",
  since: "iOS 17",
  hue: 1
}];
const PRINCIPLES = [{
  icon: "wifi-off",
  t: "Offline-first",
  d: "Every app works with the network off. Sync, when it exists, is an option — never a requirement."
}, {
  icon: "shield-check",
  t: "No surveillance",
  d: "No analytics SDKs, no ad identifiers, no third-party trackers. We can't see how you use the app, by design."
}, {
  icon: "feather",
  t: "Small and fast",
  d: "Under a couple of megabytes, cold-launch in under a second. One screen, one job, no upsell."
}, {
  icon: "git-branch",
  t: "Honest about scope",
  d: "A solo studio with modern AI tooling. We ship what one careful person can maintain — and say so."
}];

// ---------------------------------------------------------------- Header
function Header({
  theme,
  onToggleTheme,
  onNav,
  route
}) {
  const [open, setOpen] = React.useState(false);
  return /*#__PURE__*/React.createElement("header", {
    className: "site-header"
  }, /*#__PURE__*/React.createElement("div", {
    className: "ms-container site-header__inner"
  }, /*#__PURE__*/React.createElement("a", {
    className: "site-brand",
    href: "#",
    onClick: e => {
      e.preventDefault();
      onNav({
        name: "home"
      });
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "site-brand__mark",
    dangerouslySetInnerHTML: {
      __html: MARK_SVG
    }
  }), /*#__PURE__*/React.createElement("span", {
    className: "site-brand__name"
  }, "Mordan", /*#__PURE__*/React.createElement("b", null, "Soft"))), /*#__PURE__*/React.createElement("nav", {
    className: "site-nav" + (open ? " is-open" : "")
  }, /*#__PURE__*/React.createElement("a", {
    href: "#apps",
    onClick: () => setOpen(false)
  }, "Apps"), /*#__PURE__*/React.createElement("a", {
    href: "#principles",
    onClick: () => setOpen(false)
  }, "Principles"), /*#__PURE__*/React.createElement("a", {
    href: "#studio",
    onClick: () => setOpen(false)
  }, "Studio")), /*#__PURE__*/React.createElement("div", {
    className: "site-header__actions"
  }, /*#__PURE__*/React.createElement("button", {
    className: "ms-iconbtn",
    "aria-label": "Toggle theme",
    onClick: onToggleTheme
  }, /*#__PURE__*/React.createElement(Icon, {
    name: theme === "dark" ? "sun" : "moon"
  })), /*#__PURE__*/React.createElement("a", {
    className: "ms-btn ms-btn--primary ms-btn--sm",
    href: "#apps",
    onClick: e => {
      e.preventDefault();
      onNav({
        name: "home"
      });
      setTimeout(() => scrollToId("apps"), 0);
    }
  }, "Browse apps"), /*#__PURE__*/React.createElement("button", {
    className: "ms-iconbtn site-burger",
    "aria-label": "Menu",
    onClick: () => setOpen(o => !o)
  }, /*#__PURE__*/React.createElement(Icon, {
    name: open ? "x" : "menu"
  })))));
}

// ---------------------------------------------------------------- Hero
function Hero({
  onNav
}) {
  return /*#__PURE__*/React.createElement("section", {
    className: "hero ms-geo"
  }, /*#__PURE__*/React.createElement("div", {
    className: "hero__field",
    "aria-hidden": "true"
  }, /*#__PURE__*/React.createElement("div", {
    className: "hero__wash hero__wash--a",
    "data-parallax": "0.18"
  }), /*#__PURE__*/React.createElement("div", {
    className: "hero__wash hero__wash--b",
    "data-parallax": "0.10"
  }), /*#__PURE__*/React.createElement("div", {
    className: "hero__plane hero__plane--3",
    "data-parallax": "0.05"
  }), /*#__PURE__*/React.createElement("div", {
    className: "hero__plane hero__plane--2",
    "data-parallax": "0.09"
  }), /*#__PURE__*/React.createElement("div", {
    className: "hero__plane hero__plane--1",
    "data-parallax": "0.14"
  }), /*#__PURE__*/React.createElement("div", {
    className: "hero__facet",
    "data-parallax": "0.22"
  })), /*#__PURE__*/React.createElement("div", {
    className: "ms-container hero__inner"
  }, /*#__PURE__*/React.createElement("span", {
    className: "ms-eyebrow",
    "data-reveal": true,
    style: {
      color: "var(--accent-text)"
    }
  }, "// Independent mobile studio"), /*#__PURE__*/React.createElement("h1", {
    className: "hero__title",
    "data-reveal": true,
    "data-reveal-delay": "1"
  }, "Small apps that", /*#__PURE__*/React.createElement("br", null), "do one thing well."), /*#__PURE__*/React.createElement("p", {
    className: "hero__lead",
    "data-reveal": true,
    "data-reveal-delay": "2"
  }, "We build focused utilities for iOS and Android. Offline-first, no accounts, and none of the permissions, tracking, or attention most apps quietly assume."), /*#__PURE__*/React.createElement("div", {
    className: "hero__cta",
    "data-reveal": true,
    "data-reveal-delay": "3"
  }, /*#__PURE__*/React.createElement("a", {
    className: "ms-btn ms-btn--primary ms-btn--lg",
    href: "#apps",
    onClick: e => {
      e.preventDefault();
      scrollToId("apps");
    }
  }, "Browse the apps ", /*#__PURE__*/React.createElement(Icon, {
    name: "arrow-right"
  })), /*#__PURE__*/React.createElement("a", {
    className: "ms-btn ms-btn--link",
    href: "#principles",
    onClick: e => {
      e.preventDefault();
      scrollToId("principles");
    }
  }, "Read our principles")), /*#__PURE__*/React.createElement("div", {
    className: "hero__meta",
    "data-reveal": true,
    "data-reveal-delay": "4"
  }, /*#__PURE__*/React.createElement("span", {
    className: "ms-statusdot ms-statusdot--success ms-statusdot--live"
  }, /*#__PURE__*/React.createElement("span", {
    className: "ms-statusdot__dot"
  }), "4 apps shipping"), /*#__PURE__*/React.createElement("span", {
    className: "hero__metasep"
  }), /*#__PURE__*/React.createElement("span", {
    className: "hero__metaitem"
  }, "13+ years \xB7 industrial databases \u2192 embedded \u2192 mobile"))));
}

// ---------------------------------------------------------------- Apps grid
function AppCard({
  app,
  onOpen
}) {
  return /*#__PURE__*/React.createElement("article", {
    className: "ms-card ms-card--raised ms-card--interactive appcard",
    onClick: () => onOpen(app)
  }, /*#__PURE__*/React.createElement("div", {
    className: "appcard__media appcard__media--" + app.hue
  }, /*#__PURE__*/React.createElement("span", {
    className: "appcard__tile",
    dangerouslySetInnerHTML: {
      __html: TILE_SVG
    }
  })), /*#__PURE__*/React.createElement("div", {
    className: "ms-card__body"
  }, /*#__PURE__*/React.createElement("div", {
    className: "appcard__head"
  }, /*#__PURE__*/React.createElement("h3", {
    className: "ms-card__title"
  }, app.name), /*#__PURE__*/React.createElement(StatusBadge, {
    status: app.status
  })), /*#__PURE__*/React.createElement("p", {
    className: "ms-card__text"
  }, app.tagline), /*#__PURE__*/React.createElement("div", {
    className: "appcard__tags"
  }, app.platforms.map(p => /*#__PURE__*/React.createElement("span", {
    className: "ms-tag ms-tag--accent",
    key: p
  }, p)), app.stack.map(s => /*#__PURE__*/React.createElement("span", {
    className: "ms-tag",
    key: s
  }, s)))), /*#__PURE__*/React.createElement("div", {
    className: "ms-card__footer"
  }, /*#__PURE__*/React.createElement("span", {
    className: "appcard__meta"
  }, app.size, " \xB7 v", app.version), /*#__PURE__*/React.createElement("span", {
    style: {
      flex: 1
    }
  }), /*#__PURE__*/React.createElement("span", {
    className: "ms-btn ms-btn--link"
  }, "Details ", /*#__PURE__*/React.createElement(Icon, {
    name: "arrow-up-right",
    size: 15
  }))));
}
function StatusBadge({
  status
}) {
  const map = {
    shipping: ["success", "Shipping", true],
    beta: ["warning", "Beta", false],
    soon: ["neutral", "Soon", false]
  };
  const [tone, label, dot] = map[status] || map.soon;
  return /*#__PURE__*/React.createElement("span", {
    className: "ms-badge ms-badge--" + tone
  }, dot ? /*#__PURE__*/React.createElement("span", {
    className: "ms-badge__dot"
  }) : null, label);
}
function Apps({
  onOpen
}) {
  return /*#__PURE__*/React.createElement("section", {
    className: "section",
    id: "apps"
  }, /*#__PURE__*/React.createElement("div", {
    className: "ms-container"
  }, /*#__PURE__*/React.createElement("div", {
    className: "section__head",
    "data-reveal": true
  }, /*#__PURE__*/React.createElement("span", {
    className: "ms-eyebrow"
  }, "// What we make"), /*#__PURE__*/React.createElement("h2", {
    className: "section__title"
  }, "Four utilities, no overlap"), /*#__PURE__*/React.createElement("p", {
    className: "section__intro"
  }, "Each app solves one problem and stops there. Nothing phones home.")), /*#__PURE__*/React.createElement("div", {
    className: "apps-grid"
  }, APPS.map((a, i) => /*#__PURE__*/React.createElement("div", {
    "data-reveal": true,
    "data-reveal-delay": i % 3 + 1,
    key: a.id
  }, /*#__PURE__*/React.createElement(AppCard, {
    app: a,
    onOpen: onOpen
  }))))));
}

// ---------------------------------------------------------------- Principles
function Principles() {
  return /*#__PURE__*/React.createElement("section", {
    className: "section section--inverse",
    id: "principles"
  }, /*#__PURE__*/React.createElement("div", {
    className: "ms-container"
  }, /*#__PURE__*/React.createElement("div", {
    className: "section__head",
    "data-reveal": true
  }, /*#__PURE__*/React.createElement("span", {
    className: "ms-eyebrow",
    style: {
      color: "var(--accent)"
    }
  }, "// How we work"), /*#__PURE__*/React.createElement("h2", {
    className: "section__title"
  }, "Constraints we don't negotiate")), /*#__PURE__*/React.createElement("div", {
    className: "principles-grid"
  }, PRINCIPLES.map((p, i) => /*#__PURE__*/React.createElement("div", {
    className: "principle",
    "data-reveal": true,
    "data-reveal-delay": i % 2 + 1,
    key: p.t
  }, /*#__PURE__*/React.createElement("span", {
    className: "principle__icon"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: p.icon,
    size: 20
  })), /*#__PURE__*/React.createElement("h3", {
    className: "principle__title"
  }, p.t), /*#__PURE__*/React.createElement("p", {
    className: "principle__text"
  }, p.d))))));
}

// ---------------------------------------------------------------- Studio + CTA
function Studio() {
  return /*#__PURE__*/React.createElement("section", {
    className: "section",
    id: "studio"
  }, /*#__PURE__*/React.createElement("div", {
    className: "ms-container ms-container--narrow studio"
  }, /*#__PURE__*/React.createElement("div", {
    "data-reveal": true
  }, /*#__PURE__*/React.createElement("span", {
    className: "ms-eyebrow"
  }, "// The studio"), /*#__PURE__*/React.createElement("h2", {
    className: "section__title"
  }, "One developer, modern tooling"), /*#__PURE__*/React.createElement("p", {
    className: "studio__lead"
  }, "MordanSoft is a single developer with thirteen years across industrial databases, embedded electronics, and native mobile \u2014 working alongside modern AI tooling. Not an agency. We ship what one careful person can maintain, and we're honest about that scope."), /*#__PURE__*/React.createElement("div", {
    className: "studio__facts"
  }, /*#__PURE__*/React.createElement("div", {
    className: "fact"
  }, /*#__PURE__*/React.createElement("span", {
    className: "fact__n"
  }, "13+"), /*#__PURE__*/React.createElement("span", {
    className: "fact__l"
  }, "years building")), /*#__PURE__*/React.createElement("div", {
    className: "fact"
  }, /*#__PURE__*/React.createElement("span", {
    className: "fact__n"
  }, "4"), /*#__PURE__*/React.createElement("span", {
    className: "fact__l"
  }, "apps shipping")), /*#__PURE__*/React.createElement("div", {
    className: "fact"
  }, /*#__PURE__*/React.createElement("span", {
    className: "fact__n"
  }, "0"), /*#__PURE__*/React.createElement("span", {
    className: "fact__l"
  }, "trackers, ever"))))));
}

// ---------------------------------------------------------------- Footer
function Footer({
  onNav
}) {
  return /*#__PURE__*/React.createElement("footer", {
    className: "site-footer"
  }, /*#__PURE__*/React.createElement("div", {
    className: "ms-container site-footer__inner"
  }, /*#__PURE__*/React.createElement("div", {
    className: "site-footer__brand"
  }, /*#__PURE__*/React.createElement("span", {
    className: "site-brand__mark",
    dangerouslySetInnerHTML: {
      __html: MARK_SVG
    }
  }), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "site-brand__name"
  }, "Mordan", /*#__PURE__*/React.createElement("b", null, "Soft")), /*#__PURE__*/React.createElement("p", {
    className: "site-footer__tag"
  }, "Mobile software that ships, then stays out of the way."))), /*#__PURE__*/React.createElement("nav", {
    className: "site-footer__cols"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h4", null, "Apps"), /*#__PURE__*/React.createElement("a", {
    href: "#apps"
  }, "Tally"), /*#__PURE__*/React.createElement("a", {
    href: "#apps"
  }, "Plumb"), /*#__PURE__*/React.createElement("a", {
    href: "#apps"
  }, "Ledger"), /*#__PURE__*/React.createElement("a", {
    href: "#apps"
  }, "Cadence")), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h4", null, "Studio"), /*#__PURE__*/React.createElement("a", {
    href: "#principles"
  }, "Principles"), /*#__PURE__*/React.createElement("a", {
    href: "#studio"
  }, "About"), /*#__PURE__*/React.createElement("a", {
    href: "#"
  }, "Changelog")), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h4", null, "Legal"), /*#__PURE__*/React.createElement("a", {
    href: "#",
    onClick: e => {
      e.preventDefault();
      onNav({
        name: "legal"
      });
    }
  }, "Privacy"), /*#__PURE__*/React.createElement("a", {
    href: "#",
    onClick: e => {
      e.preventDefault();
      onNav({
        name: "legal"
      });
    }
  }, "Terms")))), /*#__PURE__*/React.createElement("div", {
    className: "ms-container site-footer__base"
  }, /*#__PURE__*/React.createElement("span", null, "\xA9 2026 MordanSoft"), /*#__PURE__*/React.createElement("span", {
    className: "ms-statusdot ms-statusdot--success"
  }, /*#__PURE__*/React.createElement("span", {
    className: "ms-statusdot__dot"
  }), "All systems operational")));
}
Object.assign(window, {
  Header,
  Hero,
  Apps,
  AppCard,
  Principles,
  Studio,
  Footer,
  Icon,
  APPS,
  StatusBadge
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/site/sections.jsx", error: String((e && e.message) || e) }); }

__ds_ns.Badge = __ds_scope.Badge;

__ds_ns.Button = __ds_scope.Button;

__ds_ns.Card = __ds_scope.Card;

__ds_ns.Eyebrow = __ds_scope.Eyebrow;

__ds_ns.IconButton = __ds_scope.IconButton;

__ds_ns.Input = __ds_scope.Input;

__ds_ns.StatusDot = __ds_scope.StatusDot;

__ds_ns.Switch = __ds_scope.Switch;

__ds_ns.Tabs = __ds_scope.Tabs;

__ds_ns.Tag = __ds_scope.Tag;

})();
