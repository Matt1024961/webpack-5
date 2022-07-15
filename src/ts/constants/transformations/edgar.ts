export const TransformationsEdgar = {
  exchNameEn: (input: string) => {
    if (input) {
      const exchange = {
        BOX: /^\s*(([Tt]he\s+)?[Bb][Oo][Xx]\s+[Ee]xchange(,?\s+[Ll][Ll][Cc])?)\s*$/,
        CboeBYX:
          /^\s*(([Tt]he\s+)?[Cc]boe\s+[Bb][Yy][Xx]\s+[Ee]xchange(,?\s+[Ii]nc[.]?)?)\s*$/,
        CboeBZX:
          /^\s*(([Tt]he\s+)?[Cc]boe\s+[Bb][Zz][Xx]\s+[Ee]xchange(,?\s+[Ii]nc[.]?)?)\s*$/,
        C2: /^\s*(([Tt]he\s+)?[Cc]boe\s+[Cc]2\s+[Ee]xchange(,?\s+[Ii]nc[.]?)?)\s*$/,
        CboeEDGA:
          /^\s*(([Tt]he\s+)?[Cc]boe\s+[Ee][Dd][Gg][Aa]\s+[Ee]xchange(,?\s+[Ii]nc[.]?)?)\s*$/,
        CboeEDGX:
          /^\s*(([Tt]he\s+)?[Cc]boe\s+[Ee][Dd][Gg][Xx]\s+[Ee]xchange(,?\s+[Ii]nc[.]?)?)\s*$/,
        CBOE: /^\s*(([Tt]he\s+)?[Cc]boe\s+[Ee]xchange(,?\s+[Ii]nc[.]?)?)\s*$/,
        CHX: /^\s*(([Tt]he\s+)?[Cc]hicago\s+[Ss]tock\s+[Ee]xchange(,?\s+[Ii]nc[.]?)?)\s*$/,
        IEX: /^\s*(([Tt]he\s+)?[Ii]nvestors\s+[Ee]xchange(,?\s+[Ll][Ll][Cc])?)\s*$/,
        MIAX: /^\s*(([Tt]he\s+)?[Mm]iami\s+[Ii]nternational\s+[Ss]ecurities\s+[Ee]xchange(,?\s+[Ll][Ll][Cc])?)\s*$/,
        PEARL: /^\s*(([Tt]he\s+)?[Mm]IAX\s+[Pp]EARL(,?\s+[Ll][Ll][Cc])?)\s*$/,
        BX: /^\s*(([Tt]he\s+)?[Nn][Aa][Ss][Dd][Aa][Qq]\s+[Bb][Xx](,?\s+[Ii]nc[.]?)?)\s*$/,
        GEMX: /^\s*(([Tt]he\s+)?[Nn][Aa][Ss][Dd][Aa][Qq]\s+[Gg][Ee][Mm][Xx](,?\s+[Ll][Ll][Cc])?)\s*$/,
        ISE: /^\s*(([Tt]he\s+)?[Nn][Aa][Ss][Dd][Aa][Qq]\s+[Ii][Ss][Ee](,?\s+[Ll][Ll][Cc])?)\s*$/,
        MRX: /^\s*(([Tt]he\s+)?[Nn][Aa][Ss][Dd][Aa][Qq]\s+[Mm][Rr][Xx](,?\s+[Ll][Ll][Cc])?)\s*$/,
        Phlx: /^\s*([Nn][Aa][Ss][Dd][Aa][Qq]\s+[Pp][Hh][Ll][Xx](,?\s+[Ll][Ll][Cc])?)\s*$/,
        NYSE: /^\s*(([Tt]he\s+)?[Nn][Yy][Ss][Ee]|([Tt]he\s+)?[Nn]ew\s+[Yy]ork\s+[Ss]tock\s+[Ee]xchange(,?\s+[Ll][Ll][Cc])?)\s*$/,
        NYSEAMER:
          /^\s*(([Tt]he\s+)?[Nn][Yy][Ss][Ee]\s+[Aa]merican(,?\s+[Ll][Ll][Cc])?)\s*$/,
        NYSEArca:
          /^\s*(([Tt]he\s+)?[Nn][Yy][Ss][Ee]\s+[Aa]rca(,?\s+[Ii]nc[.]?)?)\s*$/,
        NYSENAT:
          /^\s*(([Tt]he\s+)?[Nn][Yy][Ss][Ee]\s+[Nn]ational(,?\s+[Ii]nc[.]?)?)\s*$/,
        NASDAQ:
          /^\s*(([Tt]he\s+)?[Nn][Aa][Ss][Dd][Aa][Qq](\s+([Ss]tock|[Gg]lobal(\s+[Ss]elect)?)\s+[Mm]arket(,?\s+[Ll][Ll][Cc])?)?)\s*$/,
      };
      for (const current in exchange)
        if (exchange[current].exec(input) && exchange[current].exec(input)[0]) {
          return current;
        }
    }
    return "Format Error: Exch Name EN";
  },
  entityFilerCategoryEn: (input: string) => {
    if (input) {
      const filerCategory = {
        "Large Accelerated Filer":
          /^\s*([Ll]arge\s+[Aa]ccelerated\s+[Ff]iler)\s*$/,
        "Accelerated Filer": /^\s*([Aa]ccelerated\s+[Ff]iler)\s*$/,
        "Non-accelerated Filer":
          /^\s*([Nn]on[^\w]+[Aa]ccelerated\s+[Ff]iler)\s*$/,
      };
      for (const current in filerCategory)
        if (filerCategory[current].exec(input)) {
          return current;
        }
    }
    return "Format Error: Entity Filer Category EN";
  },
};
