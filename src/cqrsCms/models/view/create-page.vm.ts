import { PageContentEntity } from "../../../entity/page.content.entity";
import { PageEntity } from "../../../entity/page.entity";

export class CreatePageVm {
    /*页面*/
    public page?: PageEntity;

    /*内容*/
    public content?: Array<PageContentEntity>;

    /*每页条数*/
    public limit: number;

    /*第几页*/
    public pages: number;

    /*数组*/
    public array?: Array<number>;
}
