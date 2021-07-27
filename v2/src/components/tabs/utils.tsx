export function childContainsTabItemWithValue(value: string, children: any): boolean {
    for (let child in children) {
        if (children[child] === undefined || children[child] === null) {
            continue;
        }
        if (children[child].value === value) {
            return true;
        }

        if (children[child].props === undefined) {
            continue;
        }
        if (children[child].props.value === value) {
            return true;
        }
    }
    return false;
}