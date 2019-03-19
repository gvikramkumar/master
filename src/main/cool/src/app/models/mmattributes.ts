export class MMAttributes {

    group: string;
    subgroup: string;
    characteristics: string[];

    constructor(group: string,
        subgroup: string,
        characteristics: string[]
    ) {
        this.group = group;
        this.subgroup = subgroup;
        this.characteristics = characteristics;
    }

}
