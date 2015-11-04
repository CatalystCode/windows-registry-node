// https://msdn.microsoft.com/en-us/library/windows/desktop/ms724878(v=vs.85).aspx
module.exports = {
    KEY_ACCESS: {
        KEY_ALL_ACCESS: 0xF003F,
        KEY_CREATE_LINK: 0x0020,
        KEY_CREATE_SUB_KEY: 0x0004,
        KEY_ENUMERATE_SUB_KEYS: 0x0008,
        KEY_EXECUTE: 0x20019,
        KEY_NOTIFY: 0x0010,
        KEY_QUERY_VALUE: 0x0001,
        KEY_READ: 0x20019,
        KEY_SET_VALUE: 0x0002,
        KEY_WOW64_32KEY: 0x0200,
        KEY_WOW64_64KEY: 0x0100,
        KEY_WRITE: 0x20006
    },
    HKEY: {
        HKEY_CLASSES_ROOT: 0x80000000,
        HKEY_CURRENT_USER: 0x80000001,
        HKEY_LOCAL_MACHINE: 0x80000002,
        HKEY_USERS: 0x80000003,
        HKEY_PERFORMANCE_DATA: 0x80000004,
        HKEY_CURRENT_CONFIG: 0x80000005,
        HKEY_DYN_DATA: 0X80000006
    },
    REG_VALUE_TYPE: {
        REG_SZ: 1,
        REG_EXPAND_SZ: 2,
        REG_BINARY: 3,
        REG_DWORD: 4,
        REG_DWORD_BIG_ENDIAN: 5,
        REG_DWORD_LITTLE_ENDIAN: 6,
        REG_LINK: 6,
        REG_MULTI_SZ: 7,
        REG_RESOURCE_LIST: 8
    }
};
