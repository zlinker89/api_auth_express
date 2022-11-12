async function hide(array, obj) {
    return Object.assign(
        {},
        ...array.map(key => ({
            [key]: obj[key]
        }))
    )
}