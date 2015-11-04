var ref = require('ref');

var types = {
    REGSAM: ref.types.uint64,
    DWORD: ref.types.uint32,
    BYTE: ref.types.uint8,
    HKEY: ref.refType(ref.types.void),
    PHKEY: ref.refType(this.HKEY),
    LPBYTE: ref.refType(this.BYTE),
    LPDWORD: ref.refType(this.DWORD),
    LPCTSTR: ref.refType(ref.types.CString)
};

module.exports = types;

