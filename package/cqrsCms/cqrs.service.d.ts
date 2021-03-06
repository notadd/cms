import { CommandBus } from "@nestjs/cqrs";
import { ArticleCurdVm } from "./models/view/article-curd.vm";
import { ClassifyCurdVm } from "./models/view/classify-curd.vm";
import { CreatePageVm } from "./models/view/create-page.vm";
import { CreateXmlVm } from "./models/view/create-xml-vm";
import { GetPageVm } from "./models/view/get-page.vm";
export declare class CqrsService {
    private readonly commonbus;
    constructor(commonbus: CommandBus);
    createXml(createxmlDto: CreateXmlVm): Promise<any>;
    updateXml(): Promise<any>;
    pageCurd(updateDto: CreatePageVm): Promise<any>;
    getPages(getPageDto: GetPageVm): Promise<any>;
    classifyCurd(getClassifyDto: ClassifyCurdVm): Promise<any>;
    getClassify(getClassifyDto: ClassifyCurdVm): Promise<any>;
    articleCurd(getArticleDto: ArticleCurdVm): Promise<any>;
}
