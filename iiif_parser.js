class GallicaIiifUrlParser {
    constructor(url_string) {
        this.url = new URL(url_string);
    }
    isGallica() {
        return this.url.hostname === "gallica.bnf.fr";
    }

    get ark() {
        return;
    }
    
    toString() {
        return this.url.toString();
    }
}