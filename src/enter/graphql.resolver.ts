import { Mutation, Query, Resolver } from "@nestjs/graphql";
import { BlockEntity } from "../entity/block.entity";
import { SiteEntity } from "../entity/site.entity";
import { VisitEntity } from "../entity/visit.entity";
import { PagerService } from "../export/common.paging";
import { RegistrationService } from "./registration.service";

function objToStrMap(obj): Map<string, string> {
    let strMap = new Map();
    for (let k of Object.keys(obj)) {
        strMap.set(k, obj[ k ]);
    }
    return strMap;
}

@Resolver()
export class EnterResolver {
    constructor(private readonly registration: RegistrationService,
                private readonly pagerService: PagerService) {
    }

    @Query('getAllVisits')
    async getAllVisits(obj, arg) {
        const str: string = JSON.stringify(arg);
        let bToJSon = JSON.parse(str);
        let map = new Map();
        map = objToStrMap(bToJSon);
        const result = await this.registration.getVisit(map.get('limit'), map.get('pages'));
        const paging = this.pagerService.getPager(result.totals, map.get('pages'), map.get('limit'));
        return { pagination: paging, visits: result.visits };
    }

    @Query('getAllSites')
    async getAllSites(obj, arg) {
        const str: string = JSON.stringify(arg);
        let bToJSon = JSON.parse(str);
        let map = new Map();
        map = objToStrMap(bToJSon);
        const result = await this.registration.getSite(map.get('limit'), map.get('pages')).then(a => {
            return a
        });
        const paging = this.pagerService.getPager(result.totals, map.get('pages'), map.get('limit'));
        return { sites: result.sites, pagination: paging }
    }

    @Query('getAllBlocks')
    async getAllBlocks(obj, arg) {
        const str: string = JSON.stringify(arg);
        let bToJSon = JSON.parse(str);
        let map = new Map();
        map = objToStrMap(bToJSon);
        const result = await this.registration.getAllBlocks(map.get('limit'), map.get('pages'));
        const paging = this.pagerService.getPager(result.totals, map.get('pages'), map.get('limit'));
        return { blocks: result.blocks, pagination: paging };
    }

    @Mutation('createBlocks')
    async createBlocks(obj, arg) {
        const str: string = JSON.stringify(arg);
        let bToJSon = JSON.parse(str);
        let map = new Map();
        map = objToStrMap(bToJSon);
        let block: BlockEntity = map.get('block');
        const result = await this.registration.createBlock(block);
        return JSON.stringify(result);
    }

    @Mutation('createSites')
    async createSites(obj, arg) {
        const str: string = JSON.stringify(arg);
        let bToJSon = JSON.parse(str);
        let map = new Map();
        map = objToStrMap(bToJSon);
        let site: SiteEntity = map.get('site');
        if (site.eventDate) {
            let date: string = site.eventDate.toString();
            site.eventDate = new Date(Date.parse(date.replace(/- /g, "/")));
        }
        if (site.startTime) {
            let date: string = site.startTime.toString();
            site.startTime = new Date(Date.parse(date.replace(/- /g, "/")));
        }
        if (site.endTime) {
            let date: string = site.endTime.toString();
            site.endTime = new Date(Date.parse(date.replace(/- /g, "/")));
        }
        const result = await this.registration.createSite(site);
        return JSON.stringify(result);
    }

    @Mutation('createVisits')
    async createVisits(obj, arg) {
        const str: string = JSON.stringify(arg);
        let bToJSon = JSON.parse(str);
        let map = new Map();
        map = objToStrMap(bToJSon);
        let visit: VisitEntity = map.get('visit');
        const result = await this.registration.createVisit(visit);
        return JSON.stringify(result);
    }
}
