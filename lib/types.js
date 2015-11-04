var ref = require('ref');

var types = {
    REGSAM: ref.types.uint64,
    DWORD: ref.types.uint32,
    BYTE: ref.types.uint8,
    HKEY: ref.refType(ref.types.void),
    PVOID: ref.refType(ref.types.void),
    LPCTSTR: ref.refType(ref.types.CString)
};

types.PHKEY = ref.refType(types.HKEY);
types.LPBYTE = ref.refType(types.BYTE);
types.LPDWORD = ref.refType(types.DWORD);
module.exports = types;
