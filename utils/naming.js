export function generateName(stack, name, delimiter = '-') {
    return `${stack.stage}${delimiter}${name}`
}
export function generateDomainName(stack, subdomain = null) {
    if (subdomain) {
        return `${subdomain}${stack.stage === 'dev' ? 'dev.' : '.'}looplend.it`
    } else {
        return `${stack.stage === 'dev' ? 'dev.' : ''}looplend.it`
    }
}
