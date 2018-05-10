import { ClassifyEntity } from "./classify.entity";
export declare class ArticleEntity {
    id: number;
    name: string;
    classify: string;
    classifyId: number;
    url: string;
    source: string;
    sourceUrl: string;
    topPlace: string;
    hidden: boolean;
    recycling: boolean;
    publishedTime: Date;
    abstract: string;
    content: string;
    display: string;
    startTime: Date;
    endTime: Date;
    activityAddress: string;
    organizer: string;
    peopleNum: number;
    createAt: Date;
    updateAt: Date;
    bucketName: string;
    pictureName: string;
    type: string;
    pictureUrl: string;
    check: boolean;
    classifications: ClassifyEntity;
    pictureUpload: PictureFace;
}
export declare class PictureFace {
    bucketName: string;
    rawName: string;
    base64: string;
}
