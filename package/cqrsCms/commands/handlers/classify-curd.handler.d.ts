import { EventPublisher, ICommandHandler } from "@nestjs/cqrs";
import { PageRepository } from "../../repository/pageRepository";
import { ClassifyService } from "../../service/classify.service";
import { ClassifyParamCommand } from "../impl/classify-param.command";
export declare class ClassifyCurdHandler implements ICommandHandler<ClassifyParamCommand> {
    private readonly repositoty;
    private readonly publisher;
    private readonly classifyService;
    constructor(repositoty: PageRepository, publisher: EventPublisher, classifyService: ClassifyService);
    execute(command: ClassifyParamCommand, resolver: (value?) => void): Promise<any>;
}
