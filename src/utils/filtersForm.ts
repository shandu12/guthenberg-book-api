// This file defines the fields for the filters form used in the application. I put it here to make it easier to change.
export const fields = [
    { name: "author", type: "text", label: "Autore" },
    { name: "title", type: "text", label: "Titolo" },
    { name: "subject", type: "text", label: "Argomento" },
    { name: "minReadingEaseScore", type: "number", label: "Punteggio facilità" },
    { name: "minDownloadCount", type: "number", label: "Min Download" },
    { name: "year" , type: "number", label: "Anno di pubblicazione" },
];
