#!/usr/bin/env python3
"""
Convert the Coinomad spike-003 mockup pages (design/spike-003-*.html) into
React components + scoped CSS under src/site/.

Strategy
--------
* CSS  : each page's <style> is scoped to `.site-<page>` (so the marketing
         design can never leak into the existing auth/dashboard app which
         shares this repo). `html`/`body`/`:root`/`[data-theme=...]` selectors
         are remapped onto the page wrapper. `@keyframes` are namespaced
         per-page so they cannot collide with Tailwind/shadcn animation names.
* JSX  : the page <body> is parsed into a tree and re-emitted as JSX with
         camelCase SVG attributes, `class` -> `className`, `style` -> object,
         HTML entities decoded, and internal mockup-file links -> <Link>.
         The shared <nav>/<footer>/cursor chrome is stripped (hand-built as
         React components) so every page stays a pure, editable section tree.
"""
import re
import html as H
import json
from pathlib import Path

BASE = Path("/Users/mac/Desktop/Desktop/My Babies/Coinomad/coinomad-pay-verse")
DESIGN = BASE / "design"
OUT_CSS = BASE / "src" / "site" / "css"
OUT_SECT = BASE / "src" / "site" / "sections"

PAGES = {
    "home":     ("spike-003-home.html",     "cmh_"),
    "products": ("spike-003-products.html", "cmp_"),
    "blog":     ("spike-003-blog.html",     "cmb_"),
    "contact":  ("spike-003-contact.html",  "cmc_"),
}

PAGE_MAP = {
    # the coming-soon docs page has no React route yet — keep the CTA
    # landing on the live API section until it is built out
    "spike-003-docs.html": "/products#api",
    "spike-003-home.html": "/",
    "spike-003-products.html": "/products",
    "spike-003-blog.html": "/blog",
    "spike-003-contact.html": "/contact",
}

# React DOM props whose HTML attr is all-lowercase but React wants camelCase
LOWER_CAMEL = {
    "tabindex": "tabIndex", "readonly": "readOnly", "maxlength": "maxLength",
    "colspan": "colSpan", "rowspan": "rowSpan", "cellpadding": "cellPadding",
    "cellspacing": "cellSpacing", "contenteditable": "contentEditable",
    "spellcheck": "spellCheck", "crossorigin": "crossOrigin",
    "datetime": "dateTime", "autocomplete": "autoComplete",
    "autofocus": "autoFocus", "playsinline": "playsInline",
    "frameborder": "frameBorder", "allowfullscreen": "allowFullScreen",
    "novalidate": "noValidate", "enctype": "encType", "charset": "charSet",
    "acceptcharset": "acceptCharset", "autoplay": "autoPlay",
    "formnovalidate": "formNoValidate",
}

DROP_ATTRS = {"xmlns:xlink", "xml:space", "enable-background"}

VOID = {"area", "base", "br", "col", "embed", "hr", "img", "input", "link",
        "meta", "param", "source", "track", "wbr"}

BOOLEAN_ATTRS = {"disabled", "checked", "selected", "readOnly", "required",
                 "multiple", "autofocus", "controls", "loop", "muted",
                 "playsInline", "default", "open", "hidden", "async", "defer",
                 "noValidate", "autoPlay", "capture", "formNoValidate",
                 "reversed", "itemScope"}

BLOCK_TAGS = {"div", "section", "header", "footer", "main", "nav", "article",
              "aside", "ul", "ol", "li", "p", "h1", "h2", "h3", "h4", "h5",
              "h6", "form", "fieldset", "figure", "figcaption", "blockquote",
              "pre", "table", "thead", "tbody", "tfoot", "tr", "td", "th",
              "dl", "dt", "dd", "hr", "svg", "g", "path", "rect", "circle",
              "ellipse", "line", "polyline", "polygon", "defs", "clippath",
              "lineargradient", "radialgradient", "stop", "use", "mask",
              "pattern", "marker", "text", "tspan", "foreignobject", "symbol",
              "view", "animate", "animatetransform", "animatemotion", "filter",
              "fegaussianblur", "feblend", "feoffset", "femerge",
              "femergenode", "fecolormatrix", "fedropshadow", "metadata",
              "script"}


def camelize(name: str) -> str:
    """kebab-case -> camelCase (only for non data-/aria- names)."""
    parts = name.split("-")
    return parts[0] + "".join(p.capitalize() for p in parts[1:])


def normalize_attr(name: str) -> str | None:
    if name in DROP_ATTRS:
        return None
    if name == "class":
        return "className"
    if name == "for":
        return "htmlFor"
    if name == "xlink:href":
        return "xlinkHref"
    if name == "xml:lang":
        return "xmlLang"
    if name in LOWER_CAMEL:
        return LOWER_CAMEL[name]
    if name.startswith("data-") or name.startswith("aria-"):
        return name
    if "-" in name:
        return camelize(name)
    return name


def css_style_to_obj(style: str) -> str:
    decls = []
    for dec in style.split(";"):
        if ":" not in dec:
            continue
        k, v = dec.split(":", 1)
        k, v = k.strip(), v.strip()
        if not k:
            continue
        if k.startswith("--"):
            key_js = "[" + json.dumps(k) + "]"
        elif k.isidentifier():
            key_js = k
        else:
            key_js = json.dumps(camelize(k))
        val = json.dumps(v)
        decls.append(f"{key_js}:{val}")
    return "{" + ",".join(decls) + "}"


def map_href(href: str):
    for k, v in PAGE_MAP.items():
        if href == k:
            return v
        if href.startswith(k + "#"):
            return v + href[len(k):]
    return None


# --------------------------------------------------------------------------
# HTML tokenizer -> tree
# --------------------------------------------------------------------------
class Tag:
    def __init__(self, name, attrs, selfclose=False):
        self.name = name
        self.attrs = attrs          # list of (raw_name, raw_value_or_None)
        self.selfclose = selfclose
        self.children = []


class Text:
    def __init__(self, data):
        self.data = data


def tokenize(body: str):
    """Return a list of top-level nodes (Tag | Text)."""
    i, n = 0, len(body)
    root = []
    stack = [root]

    def push(node):
        stack[-1].append(node)
        if isinstance(node, Tag) and not node.selfclose:
            stack.append(node.children)

    while i < n:
        # comments / doctype
        if body.startswith("<!--", i):
            j = body.find("-->", i)
            if j == -1:
                break
            i = j + 3
            continue
        if body.startswith("<!", i):
            j = body.find(">", i)
            if j == -1:
                break
            i = j + 1
            continue
        if body[i] == "<":
            if body.startswith("</", i):
                j = body.find(">", i)
                name = body[i+2:j].strip().lower()
                if len(stack) > 1:
                    stack.pop()
                i = j + 1
                continue
            # start tag
            j = i + 1
            m = re.match(r"[A-Za-z][^\s/>]*", body[j:])
            if not m:
                i += 1
                continue
            name = m.group(0)
            k = j + len(name)
            # parse attributes until '>' or '/>'
            attrs = []
            selfclose = False
            while k < n:
                while k < n and body[k] in " \t\r\n":
                    k += 1
                if body.startswith("/>", k):
                    selfclose = True
                    k += 2
                    break
                if body[k] == ">":
                    k += 1
                    break
                # attribute name
                am = re.match(r"[^\s=/>]+", body[k:])
                if not am:
                    k += 1
                    continue
                aname = am.group(0)
                k += len(aname)
                while k < n and body[k] in " \t\r\n":
                    k += 1
                if k < n and body[k] == "=":
                    k += 1
                    while k < n and body[k] in " \t\r\n":
                        k += 1
                    if k < n and body[k] in "\"'":
                        q = body[k]
                        k += 1
                        jj = k
                        while jj < n and body[jj] != q:
                            jj += 1
                        aval = body[k:jj]
                        k = jj + 1
                    else:
                        vm = re.match(r"[^\s>]+", body[k:])
                        aval = vm.group(0) if vm else ""
                        k += len(aval) if vm else 0
                    attrs.append((aname, aval))
                else:
                    attrs.append((aname, None))
            if name.lower() in VOID:
                selfclose = True
            tag = Tag(name, attrs, selfclose)
            push(tag)
            i = k
        else:
            j = body.find("<", i)
            if j == -1:
                j = n
            txt = body[i:j]
            if txt:
                if txt.strip() == "" and "&" not in txt:
                    # whitespace run — keep a marker for now; preserve_inline_ws()
                    # decides below whether it is a real word gap or indentation
                    stack[-1].append(Text(" "))
                else:
                    stack[-1].append(Text(H.unescape(txt)))
            i = j
    return root


INLINE_TAGS = {
    "a", "span", "b", "i", "em", "strong", "small", "code", "u", "s",
    "sub", "sup", "mark", "label", "abbr", "time",
}


def preserve_inline_ws(nodes):
    """Keep a single space between inline siblings; drop layout indentation.

    The emitter writes inline elements back-to-back and JSX discards whitespace
    that spans a newline, so a word gap between two inline elements in the
    mockup used to disappear ("for" + "global" -> "forglobal").
    """
    def is_inline(n):
        return isinstance(n, Tag) and n.name.lower() in INLINE_TAGS

    out = []
    for idx, node in enumerate(nodes):
        if isinstance(node, Text) and node.data.strip() == "":
            prev = out[-1] if out else None
            nxt = nodes[idx + 1] if idx + 1 < len(nodes) else None
            if is_inline(prev) and is_inline(nxt):
                out.append(Text(" "))
            continue
        if isinstance(node, Tag):
            preserve_inline_ws(node.children)
        out.append(node)
    nodes[:] = out
    return nodes


def strip_chrome(nodes):
    """Remove top-level <nav>, <footer>, and cursor divs."""
    out = []
    for node in nodes:
        if isinstance(node, Tag):
            if node.name.lower() in ("nav", "footer", "script"):
                continue
            if node.name.lower() == "div":
                cls = ""
                for an, av in node.attrs:
                    if an == "class" and av:
                        cls = av
                if cls.startswith("cursor-"):
                    continue
        out.append(node)
    return out


# --------------------------------------------------------------------------
# JSX emitter
# --------------------------------------------------------------------------
class Emitter:
    def __init__(self):
        self.used_link = False
        self.used_css_type = False
        self.parts = []

    def line(self, depth, s):
        self.parts.append("  " * depth + s + "\n")

    def emit_attrs(self, attrs):
        out = []
        for an, av in attrs:
            # HTML inline event handlers -> React handler props
            if re.match(r"^on[a-z]+$", an) and av is not None:
                react_name = "on" + an[2:].capitalize()
                if av.strip() == "return false":
                    out.append(f"{react_name}={{(e) => e.preventDefault()}}")
                else:
                    out.append(f"{react_name}={{() => {{}}}}")
                continue
            nn = normalize_attr(an)
            if nn is None:
                continue
            if nn == "style" and av is not None:
                obj = css_style_to_obj(av)
                if "[" in obj:  # contains a computed custom-property key (e.g. --i)
                    self.used_css_type = True
                    out.append(f"style={{{obj} as CSSProperties}}")
                else:
                    out.append(f"style={{{obj}}}")
            elif av is None:
                out.append(f"{nn}={{true}}")
            else:
                # mockups reference assets as ../public/x (relative to design/).
                # In the app, public/ is served from the web root — the raw path
                # only works in dev (Vite's static middleware) and 404s on Vercel.
                av = av.replace("../public/", "/")
                out.append(f'{nn}="{av}"')
        return out

    def emit(self, node, depth):
        if isinstance(node, Text):
            data = node.data
            if "{" in data or "}" in data:
                self.parts.append("{" + json.dumps(data, ensure_ascii=False) + "}")
            else:
                self.parts.append(data)
            return
        name = node.name
        attrs = self.emit_attrs(node.attrs)
        is_link = False
        link_to = None
        if name.lower() == "a":
            for an, av in node.attrs:
                if an == "href" and av:
                    m = map_href(av)
                    if m:
                        link_to = m
                        break
            if link_to is not None:
                is_link = True
                self.used_link = True
                attrs = [a for a in attrs if not a.startswith("href=")]
                attrs.insert(0, f'to="{link_to}"')

        block = name.lower() in BLOCK_TAGS
        open_name = "Link" if is_link else name

        if node.selfclose:
            tag_str = f"<{open_name}{'' if not attrs else ' ' + ' '.join(attrs)} />"
            if block:
                if self.parts and not self.parts[-1].endswith("\n"):
                    self.parts.append("\n")
                self.line(depth, tag_str)
            else:
                self.parts.append(tag_str)
            return

        if block and self.parts and not self.parts[-1].endswith("\n"):
            self.parts.append("\n")

        if block:
            self.line(depth, f"<{open_name}{'' if not attrs else ' ' + ' '.join(attrs)}>")
        else:
            self.parts.append(f"<{open_name}{'' if not attrs else ' ' + ' '.join(attrs)}>")

        for c in node.children:
            self.emit(c, depth + 1 if block else depth)
        if block:
            self.line(depth, f"</{open_name}>")
        else:
            self.parts.append(f"</{open_name}>")


def emit_jsx(nodes):
    e = Emitter()
    for n in nodes:
        e.emit(n, 2)
    return "".join(e.parts), e.used_link, e.used_css_type


# --------------------------------------------------------------------------
# CSS scoping + keyframe namespacing
# --------------------------------------------------------------------------
def split_top_level_commas(s):
    parts, depth, cur = [], 0, ""
    for ch in s:
        if ch in "([":
            depth += 1
            cur += ch
        elif ch in ")]":
            depth -= 1
            cur += ch
        elif ch == "," and depth == 0:
            parts.append(cur)
            cur = ""
        else:
            cur += ch
    if cur.strip():
        parts.append(cur)
    return parts


def scope_selector(sel, page):
    s = sel.strip()
    if not s:
        return s
    if s.startswith(":root"):
        rest = s[len(":root"):]
        return f".site-{page}{rest}"
    if s.startswith("html"):
        # word boundary check
        if len(s) == 4 or not (s[4].isalnum() or s[4] == "-"):
            return f".site-{page}{s[4:]}"
    if s.startswith("body"):
        if len(s) == 4 or not (s[4].isalnum() or s[4] == "-"):
            return f".site-{page}{s[4:]}"
    if s.startswith("[data-theme"):
        return f".site-{page}{s}"
    if s.startswith("::"):
        return f".site-{page} {s}"
    return f".site-{page} {s}"


def scope_selector_list(header, page):
    return ", ".join(scope_selector(s, page) for s in split_top_level_commas(header))


def namespace_keyframes(css, prefix):
    names = sorted(set(re.findall(r"@keyframes\s+([\w-]+)", css)),
                   key=len, reverse=True)
    mapping = {nm: prefix + nm for nm in names}
    for nm in names:
        css = re.sub(rf"@keyframes\s+{re.escape(nm)}\b",
                     f"@keyframes {mapping[nm]}", css)
    for nm in names:
        # reference inside animation / animation-name (and shorthand)
        css = re.sub(
            rf"(animation(?:-name)?\s*:[^;}}]*?)(?<![-\w]){re.escape(nm)}(?![-\w])",
            rf"\1{mapping[nm]}", css)
    return css, names


def transform_css(css, page, prefix, _top=True):
    # keep a global html{scroll-behavior} so anchor scrolling stays smooth
    scroll_global = ""
    if re.search(r"(?:^|\})[^{}]*html[^{]*scroll-behavior", css, re.S):
        scroll_global = "html{scroll-behavior:smooth;}\n"

    css, names = namespace_keyframes(css, prefix)

    out = []
    i, n = 0, len(css)
    while i < n:
        # skip whitespace/comments
        if css[i] in " \t\r\n":
            out.append(css[i])
            i += 1
            continue
        if css.startswith("/*", i):
            j = css.find("*/", i)
            j = n if j == -1 else j + 2
            out.append(css[i:j])
            i = j
            continue
        # find next '{'
        brace = css.find("{", i)
        if brace == -1:
            out.append(css[i:])
            break
        header = css[i:brace]
        # find matching '}'
        depth = 0
        k = brace
        while k < n:
            if css[k] == "{":
                depth += 1
            elif css[k] == "}":
                depth -= 1
                if depth == 0:
                    break
            k += 1
        body = css[brace+1:k]
        hdr = header.strip()
        if hdr.startswith("@"):
            # NB: mockups write "@media(...)" with no space, so split()[0] would
            # yield the whole "@media(max-width:960px)" — split on whitespace OR
            # the opening paren so the keyword is isolated.
            kw = re.split(r"[\s(]", hdr, 1)[0].lower()
            if kw in ("@media", "@supports", "@layer", "@container"):
                inner = transform_css(body, page, prefix, _top=False) if kw in (
                    "@media", "@supports", "@container") else body
                out.append(header + "{" + inner + "}")
            else:
                # keyframes/font-face/import/... -> keep body untouched
                out.append(header + "{" + body + "}")
        else:
            scoped = scope_selector_list(header, page)
            out.append(scoped + "{" + body + "}")
        i = k + 1

    base = "".join(out)
    # recursive calls (inside @media/@supports) must not re-append the globals
    if not _top:
        return base
    # ensure wrapper has full-height background + proper font inheritance
    base += f"\n.site-root{{min-height:100vh;}}\n"
    return scroll_global + base


# --------------------------------------------------------------------------
# Main
# --------------------------------------------------------------------------
def convert(page, filename, prefix):
    src = (DESIGN / filename).read_text(encoding="utf-8")
    css_m = re.search(r"<style[^>]*>(.*?)</style>", src, re.S)
    css = css_m.group(1) if css_m else ""
    body_m = re.search(r"<body[^>]*>(.*)</body>", src, re.S)
    body = body_m.group(1) if body_m else ""
    # drop inline <script> blocks before parsing — their JS is reimplemented in React
    body = re.sub(r"<script[^>]*>.*?</script>", "", body, flags=re.S)

    scoped_css = transform_css(css, page, prefix)
    OUT_CSS.mkdir(parents=True, exist_ok=True)
    (OUT_CSS / f"{page}.css").write_text(scoped_css, encoding="utf-8")

    nodes = tokenize(body)
    preserve_inline_ws(nodes)
    sections = strip_chrome(nodes)
    jsx, used_link, used_css_type = emit_jsx(sections)

    OUT_SECT.mkdir(parents=True, exist_ok=True)
    component = "".join(w.capitalize() for w in page.split("-")) + "Sections"
    link_import = "import { Link } from 'react-router-dom';\n" if used_link else ""
    type_import = "import type { CSSProperties } from 'react';\n" if used_css_type else ""
    head = (
        f"// AUTO-GENERATED from design/{filename} — edit the mockup, then re-run "
        f"design/convert_mockups.py\n{link_import}{type_import}\n"
        f"export default function {component}() {{\n  return (\n    <>\n"
    )
    tail = "\n    </>\n  );\n}\n"
    (OUT_SECT / f"{component}.tsx").write_text(
        head + jsx.rstrip() + tail, encoding="utf-8")

    print(f"[{page}] css={len(scoped_css)}B sections={component}.tsx "
          f"jsx={len(jsx)}B keyframes={len(re.findall(chr(64)+'keyframes', scoped_css))} "
          f"links={used_link}")


def main():
    for page, (fn, prefix) in PAGES.items():
        convert(page, fn, prefix)
    print("DONE")


if __name__ == "__main__":
    main()
