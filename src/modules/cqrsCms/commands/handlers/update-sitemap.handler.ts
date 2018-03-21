import {CommandHandler, EventPublisher, ICommandHandler} from "@nestjs/cqrs";
import {PageRepository} from "../../repository/pageRepository";
import {DeleteParamCommand} from "../impl/delete-param.command";
const clc=require('cli-color');
@CommandHandler(DeleteParamCommand)
export class UpdateSitemapHandler implements  ICommandHandler<DeleteParamCommand> {
    constructor(private readonly repositoty: PageRepository,
                private readonly publisher: EventPublisher) {
    }
    async execute(command: DeleteParamCommand, resolver: (value?) => void) {
        console.log(clc.greenBright('handlerCommand  UpdateXmlCommand...'));
        const sitemap = this.publisher.mergeObjectContext(await this.repositoty.siteMap());
        sitemap.updatexml('0');
        sitemap.commit();
        resolver();
    }
}