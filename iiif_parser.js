const base_url = "https://gallica.bnf.fr";

class GallicaIiifUrlParser {
    constructor(url_string) {
        if (!GallicaIiifUrlParser.canParse(url_string)) {
            throw new Error("Invalid Gallica IIIF URL");
        }
        this.url = new URL(url_string, base_url);
    }

    static canParse(url_string) {
        if (!URL.canParse(url_string, base_url)) {
            return false;
        }

        const url = new URL(url_string, base_url);
        return (url.hostname === "gallica.bnf.fr" && /\/ark:\/12148\/[\da-z]+/i.test(url.pathname));
    }

    get arkIdentifier() {
        const re = /\/ark:\/12148\/[\da-z]+/i;
        return this.url.pathname.match(re)?.[0] ?? null;
        /* 
        ?. est un opérateur de chaînage optionnel qui permet d'accéder à la propriété [0] du résultat de match 
        uniquement si le résultat n'est pas null ou undefined. Si le résultat est null ou undefined, 
        l'expression entière retourne null au lieu de lancer une erreur. 
        ?? null est un opérateur de coalescence nulle qui retourne null si le résultat de match est null ou undefined, 
        sinon il retourne le résultat de match.
        */
    }

    get arkName() {
        return this.arkIdentifier?.split("/").at(-1) ?? null;
    }

    get viewNumber() {
        const re = /\/f(\d+)\/?/i;
        return this.url.pathname.match(re)?.[1] ?? null;
    }

    get gallicaViewUrl() {
        if (this.viewNumber === null) {
            return null;
        }
        return `${base_url}${this.arkIdentifier}/f${this.viewNumber}.item`;
    }

    isGallicaView() {
        return this.url.pathname.endsWith(".item");
    }

    isIiifUrl() {
        return this.url.pathname.startsWith("/iiif/");
    }

    iiifImageUrl(region = "full", size = "full", rotation = "0", quality = "native", format = "jpg") {
        if (this.viewNumber === null) {
            return null;
        }
        return `${base_url}/iiif${this.arkIdentifier}/f${this.viewNumber}/${region}/${size}/${rotation}/${quality}.${format}`;
    }

    get iiifInfoUrl() {
        if (this.viewNumber === null) {
            return null;
        }

        return `${base_url}/iiif${this.arkIdentifier}/f${this.viewNumber}/info.json`;
    }

    isInfoJson() {
        return this.url.pathname.endsWith("/info.json");
    }

    get iiifManifestUrl() {
        return `${base_url}/iiif${this.arkIdentifier}/manifest.json`;
    }

    isManifest() {
        return this.url.pathname.endsWith("/manifest.json");
    }

    toString() {
        return this.url.toString();
    }

    get type() {
        if (this.isGallicaView()) return "gallica-view";
        if (this.isInfoJson()) return "iiif-info";
        if (this.isManifest()) return "iiif-manifest";
        if (this.isIiifUrl()) return "iiif";
        return "gallica";
    }
}