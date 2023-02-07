import type { Api } from "./api";


export default function main(mishra: Api) {

    let m = mishra
                .designShape("base")
                .extrude("pad");
                
    return m;
}