export const cleanEnv = (val: string | undefined) => {
    if (!val) return undefined;
    return val.trim().replace(/^["']|["']$/g, '');
};
